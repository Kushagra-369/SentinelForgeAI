from google.oauth2 import id_token
from google.auth.transport import requests
from utils.database import users_collection
from datetime import datetime

GOOGLE_CLIENT_ID = "923952499756-lsfht6clutmt9l0ka28uprndqp356n99.apps.googleusercontent.com"


def google_login(token: str):
    user_info = id_token.verify_oauth2_token(
        token,
        requests.Request(),
        GOOGLE_CLIENT_ID
    )

    google_id = user_info["sub"]

    existing_user = users_collection.find_one(
        {"google_id": google_id}
    )

    if not existing_user:
        user = {
            "google_id": google_id,
            "name": user_info.get("name"),
            "email": user_info.get("email"),
            "picture": user_info.get("picture"),
            "plan": "free",
            "daily_limit": 5,
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow()
        }

        users_collection.insert_one(user)

    else:
        users_collection.update_one(
            {"google_id": google_id},
            {
                "$set": {
                    "last_login": datetime.utcnow()
                }
            }
        )

    return {
        "success": True,
        "google_id": google_id,
        "name": user_info.get("name"),
        "email": user_info.get("email"),
        "picture": user_info.get("picture"),
        "plan": existing_user["plan"] if existing_user else "free"
    }