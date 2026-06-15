from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client.get_default_database()

scans_collection = db["scans"]
users_collection = db["users"]

print("MongoDB Connected") 