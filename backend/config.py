from dotenv import load_dotenv

load_dotenv()

import os


class Config:
    # Neon (and some platforms) give 'postgres://' — SQLAlchemy needs 'postgresql://'
    _db_url = os.getenv("DATABASE_URL", "sqlite:///travel.db")
    SQLALCHEMY_DATABASE_URI = _db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Neon serverless: recycle connections to avoid 'SSL connection closed' errors
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,   # test connection before using from pool
        "pool_recycle": 300,     # recycle connections every 5 minutes
    }
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
