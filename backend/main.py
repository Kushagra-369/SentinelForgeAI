from fastapi import FastAPI
from api.email_routes import router

app = FastAPI(title="SentinelForge AI")

app.include_router(router)