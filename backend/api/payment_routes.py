from fastapi import APIRouter
from pydantic import BaseModel

import os
import razorpay

router = APIRouter(
    prefix="/payment",
    tags=["Payments"]
)

client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET")
    )
)



class CreateOrderRequest(BaseModel):
    plan: str


@router.post("/create-order")
def create_order(data: CreateOrderRequest):
    print("CREATING ORDER")
    plans = {
        "pro_monthly": 99,
        "pro_yearly": 999,

        "unlimited_monthly": 299,
        "unlimited_yearly": 2999,

        "lifetime": 4999
    }

    amount = plans.get(data.plan)

    if not amount:
        return {
            "success": False,
            "message": "Invalid plan"
        }

    order = client.order.create({
        "amount": amount * 100,
        "currency": "INR",
        "payment_capture": 1
    })

    return {
        "success": True,
        "order_id": order["id"],
        "amount": amount,
        "key": os.getenv("RAZORPAY_KEY_ID")
    }

from utils.database import users_collection


class VerifyPaymentRequest(BaseModel):
    email: str
    plan: str


@router.post("/verify")
def verify_payment(data: VerifyPaymentRequest):

    new_plan = "free"

    if "pro" in data.plan:
        new_plan = "pro"

    elif "unlimited" in data.plan:
        new_plan = "unlimited"

    elif data.plan == "lifetime":
        new_plan = "lifetime"

    users_collection.update_one(
        {
            "email": data.email
        },
        {
            "$set": {
                "plan": new_plan
            }
        }
    )

    return {
        "success": True,
        "plan": new_plan
    }