import json
import os

from flask import Blueprint, jsonify, request

from backend.auth import admin_required, create_admin_token
from backend.config import Config

admin_bp = Blueprint("admin", __name__)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HOTEL_IMAGES_FILE = os.path.join(ROOT_DIR, "data", "hotel_images.json")


def _load_hotel_images():
    if not os.path.exists(HOTEL_IMAGES_FILE):
        return {}
    with open(HOTEL_IMAGES_FILE, "r") as f:
        return json.load(f)


def _save_hotel_images(data: dict):
    os.makedirs(os.path.dirname(HOTEL_IMAGES_FILE), exist_ok=True)
    with open(HOTEL_IMAGES_FILE, "w") as f:
        json.dump(data, f, indent=2)


@admin_bp.post("/login")
def admin_login():
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")

    if password != Config.ADMIN_PASSWORD:
        return jsonify({"error": "Invalid admin credentials."}), 401

    return jsonify({"token": create_admin_token(), "message": "Authenticated"})


@admin_bp.get("/verify")
def admin_verify():
    from backend.auth import verify_admin_token

    auth_header = request.headers.get("Authorization", "")
    token = auth_header.removeprefix("Bearer ").strip() if auth_header else ""
    if not verify_admin_token(token):
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True})


@admin_bp.get("/hotel-images")
@admin_required
def get_hotel_images():
    """Return the saved hotel → images mapping."""
    return jsonify(_load_hotel_images())


@admin_bp.post("/hotel-images")
@admin_required
def save_hotel_images():
    """
    Body: { "hotelId": ["url1", "url2", ...], ... }
    Merges with existing data so partial updates are safe.
    """
    incoming = request.get_json(silent=True) or {}
    existing = _load_hotel_images()
    existing.update(incoming)
    _save_hotel_images(existing)
    return jsonify({"ok": True, "saved": list(incoming.keys())})
