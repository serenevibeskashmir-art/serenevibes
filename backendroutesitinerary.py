from flask import Blueprint, request, jsonify
import json
import os
from backendservicespdf_service import generate_pdf
import datetime

itinerary_bp = Blueprint('itinerary', __name__)

@itinerary_bp.route('/generate', methods=['POST'])
def generate_custom_itinerary():
    data = request.get_json() or {}
    
    # 1. Force the output folder to exist on Render
    output_dir = os.path.join(os.getcwd(), 'output')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 2. Capture parameters from incoming frontend request safely
    client_name = data.get('client_name', 'Valued Client')
    client_email = data.get('client_email', 'N/A')
    days = int(data.get('days', 5))
    budget_tier = data.get('budget_tier', 'Mid-Range')
    trip_pace = data.get('trip_pace', 'Moderate')
    adults = data.get('adults', 2)
    start_date = data.get('start_date', 'TBD')
    custom_cost = data.get('custom_cost')
    selected_hotels=data.get('hotelSelections') or data.get('selected_hotels',[])

    # Calculate default estimated cost if not manually overridden on screen
    calculated_cost = int(custom_cost) if custom_cost else (days * (4000 if budget_tier == "Budget" else 6500))

    # 3. Build a FLAT dictionary matching exactly what backendservicespdf_service.py expects
    response_payload = {
        "client_name": client_name,
        "client_email": client_email,
        "days": days,
        "adults": adults,
        "kids":data.get('kids',0),
        "start_date": data.get('start_date','Flexible'),
        "budget_tier": budget_tier,
        "vehicle_type": data.get('vehicle_type', "Sedan" if int(data.get('adults', 2)) <= 3 else ("Ertiga/Innova" if int(data.get('adults', 2)) <= 7 else "Tempo/Traveler")),
        "trip_pace": trip_pace,
        "selected_hotels":selected_hotels,
        "custom_cost":custom_cost,
        "meta_summary": {
            "client_name": client_name,
            "client_email": client_email,
            "total_days": days,
            "budget_tier": budget_tier,
            "trip_pace": trip_pace,
            "kids": data.get('kids', 0),
            "adults": adults,
            "start_date": data.get('start_date', 'Flexible'),
            "vehicle_type": data.get('vehicle_type', "Sedan" if int(data.get('adults', 2)) <= 3 else ("Ertiga/Innova" if int(data.get('adults', 2)) <= 7 else "Tempo/Traveler"))
        },
        "logistics": {
            "assigned_vehicle": "Sedan" if adults <=3 else("Ertiga/Innova" if adults <=7 else "Tempo/Traveller")
        },
        "financial_summary": {
            "total_payable_inr": calculated_cost
        },
        # Map timeline values cleanly using both keys to avoid frontend/backend naming mismatches
        "timeline": data.get('timeline') or [
            {
                "day": 1,
                "title": "Arrival in Srinagar & Leisure Exploration",
                "date": "Day 1 Plan",
                "overnight_stay": "Srinagar",
                "schedule": [
                    {"time_slot": "Morning", "activity_title": "Airport Pickup", "description": "Meet driver at Srinagar Airport and check into your houseboat."},
                    {"time_slot": "Evening", "activity_title": "Shikara Ride", "description": "Enjoy a 1-hour sunset Shikara ride on Dal Lake."}
                ]
            },
            {
                "day": 2,
                "title": "Excursion to the Alpine Meadows of Gulmarg",
                "date": "Day 2 Plan",
                "overnight_stay": "Srinagar",
                "schedule": [
                    {"time_slot": "09:00 AM", "activity_title": "Gulmarg Excursion", "description": "Drive to Gulmarg for snow activities and explore Phase 1 Gondola cable car ride."}
                ]
            },
            {
                "day": 3,
                "title": "Srinagar to Pahalgam (Valley of Shepherds)",
                "date": "Day 3 Plan",
                "overnight_stay": "Pahalgam",
                "schedule": [
                    {"time_slot": "08:30 AM", "activity_title": "Srinagar to Pahalgam", "description": "Travel to Pahalgam. Stop at beautiful saffron fields and Avantipur temple ruins along the highway stretch."}
                ]
            },
            {
                "day": 4,
                "title": "Srinagar to Pahalgam (Valley of Shepherds)",
                "date": "Day 3 Plan",
                "overnight_stay": "Pahalgam",
                "schedule": [
                    {"time_slot": "08:30 AM", "activity_title": "Srinagar to Pahalgam", "description": "Travel to Pahalgam. Stop at beautiful saffron fields and Avantipur temple ruins along the highway stretch."}
                ]
            },
            {
                "day": 5,
                "title": "Exploring Local Valleys of Pahalgam",
                "date": "Day 4 Plan",
                "overnight_stay": "Srinagar",
                "schedule": [
                    {"time_slot": "10:00 AM", "activity_title": "Pahalgam Local Sightseeing", "description": "Visit Aru Valley and Betaab Valley via local eco-union cabs."}
                ]
            },
            {
                "day": 6,
                "title": "Srinagar to Sonamarg (Meadow of Gold)",
                "date": "Day 5 Plan",
                "overnight_stay": "Srinagar",
                "schedule": [
                    {"time_slot": "09:00 AM", "activity_title": "Sonamarg Excursion", "description": "Day excursion to Sonamarg along the Sindh River, visiting Thajiwas Glacier via pony or local union vehicle."},
                    {"time_slot": "04:00 PM", "activity_title": "Return to Srinagar", "description": "Return drive back to Srinagar for overnight stay."}
                ]
            },
            {
                "day": 7,
                "title": "Souvenir Shopping & Departure Transfer",
                "date": "Day 6 Plan",
                "overnight_stay": "Departure",
                "schedule": [
                    {"time_slot": "11:00 AM", "activity_title": "Souvenir Shopping", "description": "Quick drop at local emporiums for authentic walnuts, saffron, and pashmina shawls before heading to airport terminal entry gates."}
                ]
            }
        ]
    }
    
    # Trim baseline timeline to match days count criteria
    if not data.get('timeline'):
        response_payload["timeline"] = response_payload["timeline"][:days]

    # Mirror to itinerary_timeline to satisfy frontend mapping layouts
    response_payload["itinerary_timeline"] = response_payload["timeline"]

    # 4. Trigger the PDF Generation service with the matching payload keys
    try:
        generate_pdf(response_payload)
    except Exception as pdf_error:
        print(f"PDF Generation Failed: {str(pdf_error)}")
        return jsonify({"error": f"Failed to build file structure: {str(pdf_error)}"}), 500

    return jsonify(response_payload), 200
