# Travel Booking Dashboard

A Flask + React starter for travel lead management, dynamic itinerary generation, pricing, PDF export, and email delivery.

## Features
- Lead capture
- Package management
- Dynamic itinerary generation
- PDF-ready quote structure
- Email delivery endpoint
- SQLite database support

## Tech Stack
- Backend: Python Flask
- Frontend: React + Vite
- Database: SQLite / PostgreSQL
- Email: SMTP / SendGrid-ready

## Project Structure
travel-dashboard/
backend/
frontend/

## Run Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

## Run Frontend
cd frontend
npm install
npm run dev

## Environment Variables
Create a .env file for secrets and SMTP settings.

## Notes
Replace sample package data with your own travel templates before going live.
