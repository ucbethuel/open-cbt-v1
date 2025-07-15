import requests

BASE_URL = "http://127.0.0.1:8000"
STUDENT_ID = "8148368548"  # Change to an actual student ID from your DB

# 1. Login student via custom endpoint
def login_student(student_id):
    print("Logging in...")
    res = requests.post(f"{BASE_URL}/api/users/student-login/", data={"student_id": student_id})
    res.raise_for_status()
    student = res.json().get("student", res.json())  # handle both your formats
    print("Login successful:", student)
    return student["id"]  # return primary key


# 2. Start exam session (select an exam & subject)
def start_exam_session(exam_id, subject_id):
    payload ={
    "student": 1,        # e.g. 1 — must match an existing student PK
    "exam": exam_id,
    "subject": subject_id,
    "time_remaining": 3600        # Example: 1 hour in seconds
}

    print("Payload being sent:", payload)
    headers = {
    "student-id": STUDENT_ID  # or whatever key you're using to identify the student
}

    res = requests.post(
        f"{BASE_URL}/api/exam-sessions/",
        headers=headers,
        json=payload
    )

    # ADD THIS LINE to see why it's failing
    print("Status:", res.status_code)
    print("Response text:", res.text)

    res.raise_for_status()  # This line throws the exception after the above logs
    return res.json()["id"]


# 3. Submit answers + progress
def submit_progress(session_id, current_q, time_left, answers):
    print("Submitting answers...")
    res = requests.patch(f"{BASE_URL}/api/exam-sessions/{session_id}/", json={
        "time_remaining": time_left,
        "current_question": current_q,
        "answers": answers
    })
    print("PATCH status code:", res.status_code)
    print("PATCH response:", res.text)
    res.raise_for_status()
    print("Progress submitted:", res.json())



# 4. Get exam session result
def get_session_status(session_id):
    print("Fetching session status...")
    res = requests.get(f"{BASE_URL}/api/exam-sessions/{session_id}/")
    res.raise_for_status()
    session = res.json()
    print("Current session state:")
    print("Time remaining:", session["time_remaining"])
    print("Answers:", session.get("answers", []))


# Run everything
if __name__ == "__main__":
    student_pk = login_student(STUDENT_ID)

    # Replace these with valid IDs from your DB
    exam_id = 1
    subject_id = 1

    session_id = start_exam_session(exam_id, subject_id)

    # Submit 2 dummy answers
    answers = [
        {"question": 1, "selected_option": "b"},
        {"question": 2, "selected_option": "a"},
    ]
    submit_progress(session_id, current_q=2, time_left=1500, answers=answers)

    get_session_status(session_id)
