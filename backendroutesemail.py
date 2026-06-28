import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text      import MIMEText
from email.mime.base      import MIMEBase
from email                import encoders
from flask                import Blueprint, request, jsonify

# ─── SMTP sender ─────────────────────────────────────────────────────────────
def send_email(to_email, subject, html_body, pdf_path=None):
    smtp_host = "smtp.gmail.com"
    try:
        smtp_port = int(os.environ.get("SMTP_PORT", 587))
    except (ValueError, TypeError):
        smtp_port = 587

    smtp_user  = os.environ.get("SMTP_USER")
    smtp_pass  = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("EMAIL_FROM") or smtp_user

    if not smtp_user or not smtp_pass:
        print("Mailing Error: SMTP_USER or SMTP_PASS environment variables are missing.")
        return {"status": "error", "message": "Email server credentials missing"}

    try:
        msg            = MIMEMultipart()
        msg["From"]    = email_from
        msg["To"]      = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html"))

        # Attach PDF if path provided
        if pdf_path:
            full_path = pdf_path if os.path.isabs(pdf_path) else os.path.join(os.getcwd(), pdf_path)
            if os.path.exists(full_path):
                with open(full_path, "rb") as f:
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(f.read())
                    encoders.encode_base64(part)
                    part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(full_path)}")
                    msg.attach(part)
            else:
                print(f"PDF not found at path: {full_path}")

        server = smtplib.SMTP(smtp_host, smtp_port, timeout=15)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(smtp_user, smtp_pass)
        server.sendmail(email_from, to_email, msg.as_string())
        server.quit()

        print(f"Email delivered successfully to {to_email}")
        return {"status": "sent", "to": to_email, "subject": subject}

    except Exception as e:
        print(f"SMTP Error: {str(e)}")
        return {"status": "error", "message": f"SMTP failure: {str(e)}"}

# ─── Email blueprint ──────────────────────────────────────────────────────────
email_bp = Blueprint("email", __name__)

@email_bp.post("/send")
def send():
    data = request.json or {}

    recipient = data.get("to_email") or data.get("email_to") or data.get("clientEmail")
    if not recipient:
        return jsonify({"error": "Missing recipient email (to_email)"}), 400

    subject = data.get("subject") or f"Your Travel Itinerary to {data.get('destination', 'your destination')}"

    html_body = data.get("html_body")
    if not html_body:
        client    = data.get("client_name", "Valued Client")
        dest      = data.get("destination", "Destination")
        days      = data.get("days", "")
        itin_text = data.get("itinerary", "")
        html_body = f"""
        <h3>Hello {client},</h3>
        <p>Thank you for choosing Serene Vibes! Here are your custom tour package details:</p>
        <hr/>
        <p><strong>Destination:</strong> {dest}</p>
        <p><strong>Duration:</strong> {days} Days</p>
        <p><strong>Itinerary Details:</strong></p>
        <p style="white-space: pre-line;">{itin_text}</p>
        <hr/>
        <p>Have a wonderful trip!</p>
        """

    result = send_email(recipient, subject, html_body, data.get("pdf_path"))
    return jsonify(result)
