import os

from flask import Flask, send_from_directory
from flask_cors import CORS

from backend.auth import admin_required
from backend.config import Config
from backend.extensions import db
from backend.routes.admin import admin_bp
from backend.routes.email import email_bp
from backend.routes.itinerary import itinerary_bp
from backend.routes.leads import leads_bp
from backend.routes.packages import packages_bp

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = ROOT_DIR
PWA_DIR = ROOT_DIR
ADMIN_DIST = os.path.join(ROOT_DIR, "admin", "dist")
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", "/tmp/output")


def create_app():
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)

    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(leads_bp, url_prefix="/api/leads")
    app.register_blueprint(packages_bp, url_prefix="/api/packages")
    app.register_blueprint(itinerary_bp, url_prefix="/api/itinerary")
    app.register_blueprint(email_bp, url_prefix="/api/email")

    with app.app_context():
        db.create_all()

    @app.get("/")
    def serve_public_home():
        return send_from_directory(PUBLIC_DIR, "index.html")

    @app.get("/css/<path:filename>")
    def serve_public_css(filename):
        return send_from_directory(os.path.join(PUBLIC_DIR, "css"), filename)

    @app.get("/js/<path:filename>")
    def serve_public_js(filename):
        return send_from_directory(os.path.join(PUBLIC_DIR, "js"), filename)

    # --- PWA assets ---
    # sw.js and manifest.json must be served from the root ("/") so the
    # service worker's default scope covers the whole site, not just /public/.
    @app.get("/sw.js")
    def serve_service_worker():
        response = send_from_directory(PWA_DIR, "sw.js")
        # Prevent browsers/CDNs from caching the service worker script itself,
        # so updates to it are picked up promptly.
        response.headers["Cache-Control"] = "no-cache"
        response.headers["Service-Worker-Allowed"] = "/"
        return response

    @app.get("/manifest.json")
    def serve_manifest():
        return send_from_directory(PWA_DIR, "manifest.json")

    @app.get("/icons/<path:filename>")
    def serve_pwa_icons(filename):
        return send_from_directory(os.path.join(PWA_DIR, "icons"), filename)

    @app.get("/admin")
    def serve_admin_root():
        return send_from_directory(ADMIN_DIST, "index.html")

    @app.get("/admin/")
    def serve_admin_root_slash():
        return send_from_directory(ADMIN_DIST, "index.html")

    @app.get("/admin/<path:filename>")
    def serve_admin_assets(filename):
        return send_from_directory(ADMIN_DIST, filename)

    @app.get("/output/<path:filename>")
    @admin_required
    def serve_output(filename):
        return send_from_directory(OUTPUT_DIR, filename)

    return app


app = create_app()

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    app.run(debug=True, port=5000)
