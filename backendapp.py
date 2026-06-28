import os
from flask import Flask, send_from_directory, Blueprint, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# ─── Database ────────────────────────────────────────────────────────────────
db = SQLAlchemy()

# ─── Config ──────────────────────────────────────────────────────────────────
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///travel.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

# ─── Models ──────────────────────────────────────────────────────────────────
class Lead(db.Model):
    id                    = db.Column(db.Integer, primary_key=True)
    name                  = db.Column(db.String(120), nullable=False)
    email                 = db.Column(db.String(120), nullable=False)
    phone                 = db.Column(db.String(20))
    budget_min            = db.Column(db.Integer)
    budget_max            = db.Column(db.Integer)
    preferred_destinations = db.Column(db.Text)
    travel_start          = db.Column(db.String(20))
    travel_end            = db.Column(db.String(20))
    adults                = db.Column(db.Integer, default=2)
    kids                  = db.Column(db.Integer, default=0)

class Package(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    name           = db.Column(db.String(150), nullable=False)
    duration       = db.Column(db.String(20))
    route          = db.Column(db.Text)
    total_cost     = db.Column(db.Integer)
    cab_type       = db.Column(db.String(50))
    hotel_category = db.Column(db.String(50))
    inclusions     = db.Column(db.Text)
    exclusions     = db.Column(db.Text)
    day_plan       = db.Column(db.Text)

class Booking(db.Model):
    id           = db.Column(db.Integer, primary_key=True)
    lead_id      = db.Column(db.Integer, db.ForeignKey("lead.id"),     nullable=False)
    package_id   = db.Column(db.Integer, db.ForeignKey("package.id"),  nullable=False)
    status       = db.Column(db.String(50),  default="draft")
    pdf_path     = db.Column(db.Text)
    email_status = db.Column(db.String(50),  default="not_sent")

# ─── Leads blueprint ─────────────────────────────────────────────────────────
leads_bp = Blueprint("leads", __name__)

@leads_bp.post("/")
def create_lead():
    data = request.json
    lead = Lead(
        name                  = data["name"],
        email                 = data["email"],
        phone                 = data.get("phone", ""),
        budget_min            = data.get("budget_min"),
        budget_max            = data.get("budget_max"),
        preferred_destinations = data.get("preferred_destinations", ""),
        travel_start          = data.get("travel_start", ""),
        travel_end            = data.get("travel_end", ""),
        adults                = data.get("adults", 2),
        kids                  = data.get("kids", 0),
    )
    db.session.add(lead)
    db.session.commit()
    return jsonify({"id": lead.id, "message": "lead created"})

# ─── Packages blueprint ───────────────────────────────────────────────────────
packages_bp = Blueprint("packages", __name__)

@packages_bp.post("/")
def create_package():
    data = request.json
    pkg = Package(
        name           = data["name"],
        duration       = data.get("duration", ""),
        route          = data.get("route", ""),
        total_cost     = data.get("total_cost", 0),
        cab_type       = data.get("cab_type", "Sedan"),
        hotel_category = data.get("hotel_category", "Deluxe"),
        inclusions     = data.get("inclusions", "[]"),
        exclusions     = data.get("exclusions", "[]"),
        day_plan       = data.get("day_plan", "[]"),
    )
    db.session.add(pkg)
    db.session.commit()
    return jsonify({"id": pkg.id, "message": "package created"})

# ─── App factory ─────────────────────────────────────────────────────────────
def create_app():
    app = Flask(__name__, static_folder="dist", static_url_path="/")
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)

    # Import blueprints that live in their own files (large enough to keep separate)
    from backendroutesitinerary import itinerary_bp
    from backendroutesemail import email_bp

    app.register_blueprint(leads_bp,     url_prefix="/api/leads")
    app.register_blueprint(packages_bp,  url_prefix="/api/packages")
    app.register_blueprint(itinerary_bp, url_prefix="/api/itinerary")
    app.register_blueprint(email_bp,     url_prefix="/api/email")

    with app.app_context():
        db.create_all()

    @app.route("/")
    def serve_frontend():
        return app.send_static_file("index.html")

    @app.route("/output/<path:filename>")
    def serve_output(filename):
        return send_from_directory(os.path.join(os.getcwd(), "output"), filename)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
