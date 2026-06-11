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
    
    threats_detected = scans_collection.count_documents({
        **base_query,
        "$or": [
            {"is_spam": True},
            {"is_malicious": True}
        ]
    })
    
    detection_rate = (
        round((threats_detected / total_scans) * 100, 2)
        if total_scans > 0
        else 0
    )
    
    # Get recent scans (still from all time but limited)
    recent_scans = list(
        scans_collection.find(
            {},
            {
                "_id": 0,
                "created_at": 1,
                "type": 1,
                "input": 1,
                "risk_level": 1,
                "confidence": 1
            }
        )
        .sort("created_at", -1)
        .limit(10)
    )
    
    # Convert ObjectId and datetime for JSON serialization
    for scan in recent_scans:
        if "created_at" in scan:
            scan["created_at"] = scan["created_at"].isoformat()
    
    # ========== NEW: Daily Scan Trend for Graph ==========
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
                        {"$or": [{"$eq": ["$is_spam", True]}, {"$eq": ["$is_malicious", True]}]},
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
    
    # ========== NEW: Risk Distribution for Pie Chart ==========
    risk_distribution = scans_collection.aggregate([
        {"$match": base_query},
        {"$group": {
            "_id": "$risk_level",
            "count": {"$sum": 1}
        }}
    ])
    
    risk_map = {
        "CRITICAL": {"level": "CRITICAL", "count": 0, "color": "#ff0000"},
        "HIGH": {"level": "HIGH", "count": 0, "color": "#ff4d4d"},
        "MEDIUM": {"level": "MEDIUM", "count": 0, "color": "#ffaa00"},
        "LOW": {"level": "LOW", "count": 0, "color": "#00ff66"},
        None: {"level": "UNKNOWN", "count": 0, "color": "#9ca3af"}
    }
    
    for item in risk_distribution:
        level = item["_id"] if item["_id"] else None
        if level in risk_map:
            risk_map[level]["count"] = item["count"]
        else:
            risk_map[None]["count"] += item["count"]
    
    risk_distribution_list = [v for v in risk_map.values() if v["count"] > 0]
    
    # ========== NEW: Type Distribution for Bar Chart ==========
    email_count = scans_collection.count_documents({**base_query, "type": "email"})
    url_count = scans_collection.count_documents({**base_query, "type": "url"})
    
    type_distribution = [
        {"type": "email", "count": email_count},
        {"type": "url", "count": url_count}
    ]
    
    # ========== NEW: Average Confidence by Risk Level ==========
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
        if item["_id"] is not None  # Skip None values
    ]
    
    return {
        "total_scans": total_scans,
        "email_scans": email_scans,
        "url_scans": url_scans,
        "threats_detected": threats_detected,
        "detection_rate": detection_rate,
        "recent_scans": recent_scans,
        # New fields for graphs
        "daily_scan_trend": daily_scan_trend,
        "risk_distribution": risk_distribution_list,
        "type_distribution": type_distribution,
        "avg_confidence_by_risk": avg_confidence_by_risk
    }