# import asyncio
# from dotenv import load_dotenv
# from motor.motor_asyncio import AsyncIOMotorClient
# from backend.app.security import hash_password
# import sys
# import os
# from pathlib import Path

# # ✅ 루트 경로(e-commerce)까지 sys.path에 추가
# ROOT_DIR = Path(__file__).resolve().parents[2]
# sys.path.append(str(ROOT_DIR))


# # ✅ 루트 경로(e-commerce)까지 sys.path에 추가
# ROOT_DIR = Path(__file__).resolve().parents[2]
# sys.path.append(str(ROOT_DIR))


# load_dotenv()  # .env 파일에 있는 MONGO_URI 가져오기

# MONGO_URI = os.getenv("MONGO_URI", "mongodb://3.35.21.238:27017")
# DB_NAME = os.getenv("DB_NAME", "ai-shop")


# async def create_admin():
#     client = AsyncIOMotorClient(MONGO_URI)
#     db = client[DB_NAME]
#     users = db["users"]

#     admin_email = "admin@eco.com"
#     existing = await users.find_one({"email": admin_email})
#     if existing:
#         print(f"⚠️ 이미 존재하는 관리자 계정입니다: {admin_email}")
#         return

#     admin_doc = {
#         "email": admin_email,
#         "password": hash_password("admin1234"),
#         "name": "관리자",
#         "phone": "010-0000-0000",
#         "address": "서울특별시 강남구",
#         "role": "admin",
#     }

#     await users.insert_one(admin_doc)
#     print(f"✅ 관리자 계정 생성 완료: {admin_email}")

#     client.close()

# if __name__ == "__main__":
#     asyncio.run(create_admin())
