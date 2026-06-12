from fastapi import APIRouter, UploadFile, File
from datetime import datetime

from services.file_service import scan_file
from utils.database import scans_collection

router = APIRouter(
    prefix="/file",
    tags=["File Scanner"]
)


@router.post("/scan")
async def scan_uploaded_file(
    file: UploadFile = File(...)
):
    result = await scan_file(file)

    scans_collection.insert_one({
        "type": "file",
        "filename": result["filename"],
        "risk_level": result["risk_level"],
        "confidence": result["confidence"],
        "reasons": result["reasons"],
        "created_at": datetime.utcnow()
    })

    return result