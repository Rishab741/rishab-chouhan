import os
import json
from langchain.agents import tool
from googleapiclient.discovery import build
from google.oauth2 import service_account
from datetime import datetime, timedelta, timezone

SCOPES = ['https://www.googleapis.com/auth/calendar']
PERSONAL_CALENDAR_ID = "crishab07@gmail.com"

# Sydney is UTC+10 (AEST, April–October). Daylight saving (AEDT, UTC+11) runs Oct–Apr.
# Using zoneinfo if tzdata is available, otherwise falling back to fixed AEST offset.
try:
    from zoneinfo import ZoneInfo
    SYDNEY_TZ = ZoneInfo("Australia/Sydney")
    def _sydney_dt(year, month, day, hour, minute=0, second=0):
        return datetime(year, month, day, hour, minute, second, tzinfo=SYDNEY_TZ)
except Exception:
    SYDNEY_TZ = timezone(timedelta(hours=10))  # AEST fallback
    def _sydney_dt(year, month, day, hour, minute=0, second=0):
        return datetime(year, month, day, hour, minute, second, tzinfo=SYDNEY_TZ)


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
    """Check Rishab's availability for a given date (format: YYYY-MM-DD).
    Returns available time slots in AEST (Sydney, Australia) timezone.
    """
    try:
        service = get_calendar_service()

        date = datetime.strptime(date_str, "%Y-%m-%d")
        day_start = _sydney_dt(date.year, date.month, date.day, 9)
        day_end = _sydney_dt(date.year, date.month, date.day, 17)

        # Convert to UTC for the freebusy API
        t_min = day_start.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        t_max = day_end.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        body = {
            "timeMin": t_min,
            "timeMax": t_max,
            "items": [{"id": PERSONAL_CALENDAR_ID}]
        }

        fb_result = service.freebusy().query(body=body).execute()
        busy_slots = fb_result['calendars'][PERSONAL_CALENDAR_ID]['busy']

        if not busy_slots:
            return (f"Rishab is fully available on {date_str} between 9:00 AM and 5:00 PM "
                    f"AEST (Sydney, Australia). All times are in Sydney local time.")

        busy_display = []
        for s in busy_slots:
            start_utc = datetime.fromisoformat(s['start'].replace('Z', '+00:00'))
            end_utc = datetime.fromisoformat(s['end'].replace('Z', '+00:00'))
            start_aest = start_utc.astimezone(SYDNEY_TZ).strftime("%I:%M %p")
            end_aest = end_utc.astimezone(SYDNEY_TZ).strftime("%I:%M %p")
            busy_display.append(f"{start_aest} to {end_aest}")

        slots_str = ", ".join(busy_display)
        return (f"On {date_str}, Rishab is busy (AEST): {slots_str}. "
                f"Other times between 9:00 AM and 5:00 PM AEST are free.")
    except Exception as e:
        return f"Error checking calendar: {str(e)}"


@tool
def request_meeting_approval(start_time_str: str, guest_email: str, meeting_context: str) -> str:
    """
    Proposes a 30-min meeting by adding a tentative request to Rishab's calendar.
    Rishab must manually accept this to confirm.
    Args:
        start_time_str: Start time in AEST (Sydney) as 'YYYY-MM-DDTHH:MM:SS' — no Z suffix, no UTC conversion.
                        Example: '2026-05-02T11:00:00' means 11:00 AM Sydney time.
        guest_email: The email of the person requesting the meeting.
        meeting_context: A brief summary of why the person wants to meet.
    """
    try:
        service = get_calendar_service()

        # Strip any accidental Z or UTC offset — treat bare datetime as Sydney time
        clean_str = start_time_str.replace('Z', '')
        if '+' in clean_str:
            clean_str = clean_str[:clean_str.index('+')]
        # If it already has offset info after the time part, strip it
        parts = clean_str.split('T')
        if len(parts) == 2:
            time_part = parts[1][:8]  # take only HH:MM:SS
            clean_str = f"{parts[0]}T{time_part}"

        dt_naive = datetime.strptime(clean_str, "%Y-%m-%dT%H:%M:%S")
        dt_sydney = dt_naive.replace(tzinfo=SYDNEY_TZ)
        dt_end_sydney = dt_sydney + timedelta(minutes=30)

        start_iso = dt_sydney.isoformat()
        end_iso = dt_end_sydney.isoformat()
        display_time = dt_sydney.strftime("%B %d, %Y at %I:%M %p AEST")

        event = {
            'summary': f'📅 PENDING: Meeting with {guest_email}',
            'description': (
                f"--- AI ASSISTANT REQUEST ---\n"
                f"GUEST: {guest_email}\n"
                f"PURPOSE: {meeting_context}\n\n"
                f"ACTION REQUIRED: Please click 'Yes' to confirm this meeting. "
                f"A Google Meet link will be automatically generated upon confirmation."
            ),
            'start': {'dateTime': start_iso, 'timeZone': 'Australia/Sydney'},
            'end': {'dateTime': end_iso, 'timeZone': 'Australia/Sydney'},
            'status': 'tentative',
            'transparency': 'transparent',
        }

        service.events().insert(
            calendarId=PERSONAL_CALENDAR_ID,
            body=event
        ).execute()

        return (f"I've placed a tentative meeting request on Rishab's calendar for {display_time}. "
                "Once he reviews the context and accepts it, the meeting will be finalized.")

    except Exception as e:
        return f"Failed to send request: {str(e)}"


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    print(list_available_slots.invoke("2026-05-02"))
