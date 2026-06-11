from utils.database import scans_collection

scans_collection.insert_one({
    "test": True
})

print("Inserted successfully")