from fastapi import APIRouter, UploadFile, File, Form
from datetime import datetime

from services.file_service import scan_file

from utils.database import scans_collection
from utils.usage import (
    check_usage,
    increment_usage,
    get_limit
)

router = APIRouter(
    prefix="/file",
    tags=["File Scanner"]
)


@router.post("/scan")
async def scan_uploaded_file(
    file: UploadFile = File(...),
    user_id: str = Form("guest"),
    plan: str = Form("guest")
):

    print("USER ID:", user_id)
    print("PLAN:", plan)

    # Usage limit check
    if not check_usage(
        user_id,
        "file",
        plan
    ):

        if plan == "guest":
            return {
                "success": False,
                "message": "Please sign in to continue scanning files. Guest users are limited to 1 scan per day."
            }

        return {
            "success": False,
            "message": f"You have reached your daily file scan limit ({get_limit(plan)} scans/day)."
        }

    # AI Scan
    result = await scan_file(file)

    # Usage increment
    increment_usage(
        user_id,
        "file"
    )

    # Save history only for logged-in users
    if plan != "guest":
        scans_collection.insert_one({
            "type": "file",
            "user_id": user_id,
            "plan": plan,
            "filename": result.get("filename"),
            "risk_level": result.get("risk_level"),
            "confidence": result.get("confidence"),
            "reasons": result.get("reasons", []),
            "created_at": datetime.utcnow()
        })

    return {
        "success": True,
        "user_id": user_id,
        "plan": plan,
        **result
    }