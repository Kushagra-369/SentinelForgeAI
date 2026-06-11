from fastapi import APIRouter
from datetime import datetime

from api.schemas import EmailRequest
from services.email_service import scan_email
from utils.database import scans_collection

router = APIRouter(
    prefix="/email",
    tags=["Email Scanner"]
)


@router.post("/scan")
def scan(data: EmailRequest):

    result = scan_email(data.text)

    scans_collection.insert_one({
        "type": "email",
        "input": data.text,
        "is_spam": result["is_spam"],
        "risk_level": result["risk_level"],
        "confidence": result["confidence"],
        "reasons": result["reasons"],
        "created_at": datetime.utcnow()
    })

    return result