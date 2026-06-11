from pydantic import BaseModel


class EmailRequest(BaseModel):
    text: str

class URLRequest(BaseModel):
    url: str