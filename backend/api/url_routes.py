from fastapi import APIRouter
from datetime import datetime

from api.schemas import URLRequest
from services.url_service import scan_url
from utils.database import scans_collection

router = APIRouter(
    prefix="/url",
    tags=["URL Scanner"]
)


@router.post("/scan")
def scan(data: URLRequest):

    result = scan_url(data.url)

    scans_collection.insert_one({
        "type": "url",
        "input": data.url,
        "is_malicious": result["is_malicious"],
        "risk_level": result["risk_level"],
        "confidence": result["confidence"],
        "reasons": result["reasons"],
        "created_at": datetime.utcnow()
    })

    return result