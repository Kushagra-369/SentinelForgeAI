from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.url_routes import router as url_router
from api.email_routes import router

app = FastAPI(title="SentinelForge AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)      # email
app.include_router(url_router)  # url