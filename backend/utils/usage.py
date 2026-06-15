from datetime import datetime
from utils.database import usage_collection

def get_today():
    return datetime.utcnow().strftime("%Y-%m-%d")


def get_limit(plan: str):
    if plan == "free":
        return 5

    if plan == "pro":
        return 20

    if plan == "unlimited":
        return 999999

    return 1  # guest


def check_usage(user_id, scan_type, plan):
    today = get_today()

    usage = usage_collection.find_one({
        "user_id": user_id,
        "date": today
    })

    if not usage:
        return True

    limit = get_limit(plan)

    current = usage.get(
        f"{scan_type}_count",
        0
    )

    return current < limit


def increment_usage(
    user_id,
    scan_type
):
    today = get_today()

    usage_collection.update_one(
        {
            "user_id": user_id,
            "date": today
        },
        {
            "$inc": {
                f"{scan_type}_count": 1
            }
        },
        upsert=True
    )