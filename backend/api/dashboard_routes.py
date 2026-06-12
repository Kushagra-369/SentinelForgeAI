from fastapi import APIRouter, Query
from utils.database import scans_collection
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Optional

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_stats(days: Optional[int] = Query(7, ge=1, le=30, description="Number of days to analyze")):
    """
    Get dashboard statistics with time-range filtering for graphs
    """
    
    # Calculate date filter
    since_date = datetime.utcnow() - timedelta(days=days)
    
    # Base query with time filter
    base_query = {"created_at": {"$gte": since_date}}
    
    # Apply time filter to all counts
    total_scans = scans_collection.count_documents(base_query)
    
    email_scans = scans_collection.count_documents({
        **base_query,
        "type": "email"
    })
    
    url_scans = scans_collection.count_documents({
        **base_query,
        "type": "url"
    })
    
    # ========== FIX: ADD FILE SCANS COUNT ==========
    file_scans = scans_collection.count_documents({
        **base_query,
        "type": "file"
    })
    
    # Threats detected (using risk_level instead of is_spam/is_malicious)
    threats_detected = scans_collection.count_documents({
        **base_query,
        "risk_level": {"$in": ["CRITICAL", "HIGH"]}
    })
    
    detection_rate = (
        round((threats_detected / total_scans) * 100, 2)
        if total_scans > 0
        else 0
    )
    
    # Get recent scans (with file support)
    recent_scans = list(
        scans_collection.find(
            base_query,  # FIX: Apply time filter to recent scans too
            {
                "_id": 0,
                "created_at": 1,
                "type": 1,
                "input": 1,
                "filename": 1,  # FIX: Add filename for file scans
                "risk_level": 1,
                "confidence": 1,
                "reasons": 1
            }
        )
        .sort("created_at", -1)
        .limit(10)
    )
    
    # Convert datetime and handle file scans
    for scan in recent_scans:
        if "created_at" in scan:
            scan["created_at"] = scan["created_at"].isoformat()
        # For file scans, set input as filename for display
        if scan.get("type") == "file" and scan.get("filename"):
            scan["input"] = scan["filename"]
    
    # Daily Scan Trend
    daily_scans = scans_collection.aggregate([
        {"$match": base_query},
        {"$group": {
            "_id": {
                "$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}
            },
            "count": {"$sum": 1},
            "threats": {
                "$sum": {
                    "$cond": [
                        {"$in": ["$risk_level", ["CRITICAL", "HIGH"]]},
                        1,
                        0
                    ]
                }
            }
        }},
        {"$sort": {"_id": 1}}
    ])
    
    daily_scan_trend = [
        {"date": item["_id"], "count": item["count"], "threats": item["threats"]}
        for item in daily_scans
    ]
    
    # Risk Distribution
    risk_distribution = scans_collection.aggregate([
        {"$match": base_query},
        {"$group": {
            "_id": "$risk_level",
            "count": {"$sum": 1}
        }}
    ])
    
    risk_distribution_list = [
        {"level": item["_id"] or "UNKNOWN", "count": item["count"]}
        for item in risk_distribution
    ]
    
    # ========== FIX: Type Distribution with FILE SUPPORT ==========
    type_distribution = [
        {"type": "email", "count": email_scans, "color": "#00ff66"},
        {"type": "url", "count": url_scans, "color": "#ffaa00"},
        {"type": "file", "count": file_scans, "color": "#4a90e2"}  # FILE ADDED
    ]
    
    # Average Confidence by Risk Level
    confidence_by_risk = scans_collection.aggregate([
        {"$match": base_query},
        {"$group": {
            "_id": "$risk_level",
            "avg_confidence": {"$avg": "$confidence"}
        }}
    ])
    
    avg_confidence_by_risk = [
        {
            "risk_level": item["_id"] if item["_id"] else "UNKNOWN",
            "avg_confidence": round(item["avg_confidence"], 2)
        }
        for item in confidence_by_risk
        if item["_id"] is not None
    ]
    
    return {
        "total_scans": total_scans,
        "email_scans": email_scans,
        "url_scans": url_scans,
        "file_scans": file_scans,  # FIX: Add file_scans to response
        "threats_detected": threats_detected,
        "detection_rate": detection_rate,
        "recent_scans": recent_scans,
        "daily_scan_trend": daily_scan_trend,
        "risk_distribution": risk_distribution_list,
        "type_distribution": type_distribution,  # FIX: Now includes files
        "avg_confidence_by_risk": avg_confidence_by_risk
    }