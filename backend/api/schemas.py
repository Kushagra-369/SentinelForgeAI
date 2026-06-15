from pydantic import BaseModel

class EmailRequest(BaseModel):
    text: str
    user_id: str | None = None
    plan: str = "guest"

class URLRequest(BaseModel):
    url: str
    user_id: str | None = None
    plan: str = "guest"
