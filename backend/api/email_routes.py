from fastapi import APIRouter

from api.schemas import EmailRequest
from services.email_service import scan_email

router = APIRouter(
    prefix="/email",
    tags=["Email Scanner"]
)


@router.post("/scan")
def scan(data: EmailRequest):
    return scan_email(data.text)