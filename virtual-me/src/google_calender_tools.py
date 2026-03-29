import os
import json
from langchain.agents import tool
from googleapiclient.discovery import build
from google.oauth2 import service_account
from datetime import datetime, timedelta

SCOPES = ['https://www.googleapis.com/auth/calendar']
PERSONAL_CALENDAR_ID = "crishab07@gmail.com" 

def get_calendar_service():
    """Loads credentials from environment variable and returns a service object."""
    creds_json = os.environ.get("GCP_SERVICE_ACCOUNT_JSON", "").strip().strip("'").strip('"')

    if not creds_json:
        raise EnvironmentError("Missing GCP_SERVICE_ACCOUNT_JSON environment variable.")

    info = json.loads(creds_json)
    if "private_key" in info:
        info["private_key"] = info["private_key"].replace("\\n", "\n")
        
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return build('calendar', 'v3', credentials=creds)

@tool
def list_available_slots(date_str: str) -> str:
    """Check availability for a date (format: YYYY-MM-DD)."""
    try:
        service = get_calendar_service()
        t_min = f"{date_str}T09:00:00Z"
        t_max = f"{date_str}T17:00:00Z"
        
        body = {
            "timeMin": t_min,
            "timeMax": t_max,
            "items": [{"id": PERSONAL_CALENDAR_ID}]
        }
        
        fb_result = service.freebusy().query(body=body).execute()
        busy_slots = fb_result['calendars'][PERSONAL_CALENDAR_ID]['busy']
        
        if not busy_slots:
            return f"I am fully available on {date_str} between 9 AM and 5 PM UTC."
        
        slots_str = ", ".join([f"{s['start']} to {s['end']}" for s in busy_slots])
        return f"On {date_str}, I am busy: {slots_str}. Other times between 9AM-5PM UTC are free."
    except Exception as e:
        return f"Error checking calendar: {str(e)}"

@tool
def request_meeting_approval(start_time_iso: str, guest_email: str, meeting_context: str) -> str:
    """
    Proposes a 30-min meeting by adding a tentative request to the calendar. 
    Rishab must manually accept this to confirm.
    Args:
        start_time_iso: The start time in ISO format (YYYY-MM-DDTHH:MM:SSZ).
        guest_email: The email of the person requesting the meeting.
        meeting_context: A brief summary of why the person wants to meet.
    """
    try:
        service = get_calendar_service()
        dt = datetime.fromisoformat(start_time_iso.replace('Z', ''))
        end_time = (dt + timedelta(minutes=30)).isoformat() + "Z"
        
        event = {
            'summary': f'📅 PENDING: Meeting with {guest_email}',
            'description': (
                f"--- AI ASSISTANT REQUEST ---\n"
                f"GUEST: {guest_email}\n"
                f"PURPOSE: {meeting_context}\n\n"
                f"ACTION REQUIRED: Please click 'Yes' to confirm this meeting. "
                f"A Google Meet link will be automatically generated upon confirmation."
            ),
            'start': {'dateTime': start_time_iso, 'timeZone': 'UTC'},
            'end': {'dateTime': end_time, 'timeZone': 'UTC'},
            # PART A LOGIC:
            'status': 'tentative',        # Marks as tentative request
            'transparency': 'transparent', # Shows as 'Free' so it doesn't block your day yet
        #     'conferenceData': {
        #         'createRequest': {
        #             'requestId': f"meet_{int(datetime.now().timestamp())}",
        #             'conferenceSolutionKey': {'type': 'hangoutsMeet'}
        #         }
        #     }
         }
        
        service.events().insert(
            calendarId=PERSONAL_CALENDAR_ID, 
            body=event
            # conferenceDataVersion=1
        ).execute()
        
        return (f"I've placed a tentative meeting request on Rishab's calendar for {start_time_iso}. "
                "Once he reviews the context and accepts it, the meeting will be finalized.")
                
    except Exception as e:
        return f"Failed to send request: {str(e)}"

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    # Test checking tomorrow's date
    print(list_available_slots.invoke("2026-02-12"))