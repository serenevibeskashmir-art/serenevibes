from backend.extensions import db


class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    budget_min = db.Column(db.Integer)
    budget_max = db.Column(db.Integer)
    preferred_destinations = db.Column(db.Text)
    travel_start = db.Column(db.String(20))
    travel_end = db.Column(db.String(20))
    adults = db.Column(db.Integer, default=2)
    kids = db.Column(db.Integer, default=0)


class Package(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    duration = db.Column(db.String(20))
    route = db.Column(db.Text)
    total_cost = db.Column(db.Integer)
    cab_type = db.Column(db.String(50))
    hotel_category = db.Column(db.String(50))
    inclusions = db.Column(db.Text)
    exclusions = db.Column(db.Text)
    day_plan = db.Column(db.Text)


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey("lead.id"), nullable=False)
    package_id = db.Column(db.Integer, db.ForeignKey("package.id"), nullable=False)
    status = db.Column(db.String(50), default="draft")
    pdf_path = db.Column(db.Text)
    email_status = db.Column(db.String(50), default="not_sent")


class HotelImages(db.Model):
    """
    Stores reference photos for each hotel, keyed by hotel ID (e.g. 'htk', 'sghb').
    images_json holds a JSON array of image sources — either https:// URLs or
    base64 data URLs (data:image/jpeg;base64,...) from device uploads.
    Stored in the database so photos survive Render restarts and redeploys.
    """
    __tablename__ = "hotel_images"
    id        = db.Column(db.Integer, primary_key=True)
    hotel_id  = db.Column(db.String(20), unique=True, nullable=False, index=True)
    images_json = db.Column(db.Text, nullable=False, default="[]")
