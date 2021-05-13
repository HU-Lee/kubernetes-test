from typing import Generator
from .session import SessionLocal

# DB 초기 구동 설정(?)

def get_db():
    try:
        db = SessionLocal()
        return db
    finally:
        db.close()