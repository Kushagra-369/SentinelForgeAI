from fastapi import APIRouter

from api.schemas import URLRequest
from services.url_service import scan_url

router = APIRouter(
    prefix="/url",
    tags=["URL Scanner"]
)


@router.post("/scan")
def scan(data: URLRequest):
    return scan_url(data.url)