from fastapi import APIRouter
from pydantic import BaseModel

from services.auth_service import google_login

router = APIRouter(
prefix="/auth",
tags=["Authentication"]
)

class GoogleLoginRequest(BaseModel):
    token: str

@router.post("/google")
def login(data: GoogleLoginRequest):
    return google_login(data.token)
