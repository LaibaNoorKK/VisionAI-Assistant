# app.py
from flask import Flask, request, session, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
import logging

# Import your agent logic
from chat_history import get_chat_history
from agent import run_supervisor
from qna_data import PREDEFINED_QAS
from chat_history import get_user_chat_sessions

# Load env vars
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "super-secret-key")  # required for session

# Enable CORS with credentials so browser cookies (Flask session) work
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

# Database connection
DATABASE_URL = (
    os.getenv("NEON_API_URL")
    or os.getenv("DATABASE_URL")
    or os.getenv("POSTGRES_URL")
)
if not DATABASE_URL:
    raise RuntimeError("Database URL not found. Set NEON_API_URL or DATABASE_URL in your environment.")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


# ---------------------------
# Chat Endpoint
# ---------------------------
@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    token = request.json.get("token")
    user_id = session.get("user_id")

    # If a token is provided (format username-userId), bind backend session to that user
    if token and not user_id:
        try:
            parts = str(token).split("-")
            if len(parts) >= 2:
                session["user_id"] = parts[-1]
                user_id = session["user_id"]
        except Exception:
            pass

    if "session_id" not in session:
        session["session_id"] = os.urandom(8).hex()
    session_id = session["session_id"]

    try:
        # Check if this is a category button click
        if user_message.startswith("I'm interested in "):
            category = user_message.replace("I'm interested in ", "").strip()
            # Map category names to predefined Q&A
            category_mapping = {
                "popular-majors": "What are the most popular majors in Malaysia?",
                "malaysia-visa-requirements": "How do I apply for a student visa in Malaysia?",
                "scholarship-options": "What are the scholarship opportunities for international students?",
                "top-malaysian-universities": "What are the top universities in Malaysia?",
                "international-student-guide": "What is the cost of living for a student in Malaysia?"
            }
            
            if category in category_mapping:
                question = category_mapping[category]
                if question in PREDEFINED_QAS:
                                        # Save both user and AI message to DB
                    history, user_id, session_id = get_chat_history(
                        session.get("user_id"), session.get("session_id")
                    )
                    history.add_user_message(user_message)
                    history.add_ai_message(PREDEFINED_QAS[question])
                    return jsonify({"reply": PREDEFINED_QAS[question]})

        # Load history from DB
        history, user_id, session_id = get_chat_history(
            session.get("user_id"), session.get("session_id")
        )
        history.add_user_message(user_message)
        # Run AI (run_supervisor handles saving both user and AI messages)
        assistant_reply = run_supervisor(user_message, history)

        return jsonify({"reply": assistant_reply,"session_id": session_id})
    except Exception as e:
        logging.exception("Error in /api/chat")
        return jsonify({"error": str(e)}), 500


# ---------------------------
# Category Endpoint
# ---------------------------
@app.route("/api/category/<category_name>", methods=["GET"])
def get_category_answer(category_name):
    """Get predefined answer for category button clicks"""
    category_mapping = {
        "popular-majors": "What are the most popular majors in Malaysia?",
        "malaysia-visa-requirements": "How do I apply for a student visa in Malaysia?",
        "scholarship-options": "What are the scholarship opportunities for international students?",
        "top-malaysian-universities": "What are the top universities in Malaysia?",
        "international-student-guide": "What is the cost of living for a student in Malaysia?"
    }
    
    if category_name in category_mapping:
        question = category_mapping[category_name]
        if question in PREDEFINED_QAS:
            return jsonify({"reply": PREDEFINED_QAS[question]})
    
    return jsonify({"error": "Category not found"}), 404


# ---------------------------
# Auth Endpoints
# ---------------------------
@app.route("/api/auth/signup", methods=["POST"])
def signup():
    data = request.json
    try:
        with engine.begin() as conn:
            result = conn.execute(
                text(
                    """
                    INSERT INTO aisupersearch_signup (institute, studying, username, contact_number, email)
                    VALUES (:institute, :studying, :username, :contact_number, :email)
                    ON CONFLICT (email) DO NOTHING
                    RETURNING user_id
                    """
                ),
                data,
            )
            row = result.fetchone()
            if not row:
                return jsonify({"ok": False, "error": "Email already exists"}), 409
            return jsonify({"ok": True, "user_id": row[0]})
    except Exception as e:
        logging.exception("Error in /api/auth/signup")
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/auth/signin", methods=["POST"])
def signin():
    data = request.json
    try:
        with engine.begin() as conn:
            row = conn.execute(
                text("SELECT user_id, username FROM aisupersearch_signup WHERE email = :email"),
                {"email": data["email"]},
            ).fetchone()
            if not row:
                return jsonify({"ok": False, "error": "Email not found"}), 404

            # store in session for chat
            session["user_id"] = row[0]

            return jsonify({"ok": True, "user_id": row[0], "username": row[1]})
    except Exception as e:
        logging.exception("Error in /api/auth/signin")
        return jsonify({"ok": False, "error": str(e)}), 500


# ---------------------------
# Healthcheck
# ---------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "ok"}


# ---------------------------
# Sessions for sidebar
# ---------------------------
@app.route("/api/chat/sessions", methods=["GET"])
def list_sessions():
    try:
        token = request.args.get("token")
        user_id = session.get("user_id")
        if token and not user_id:
            try:
                parts = str(token).split("-")
                if len(parts) >= 2:
                    session["user_id"] = parts[-1]
                    user_id = session["user_id"]
            except Exception:
                pass
        if not user_id:
            return jsonify([])
        sessions = get_user_chat_sessions(user_id)
        # Normalize for frontend expectations
        data = [
            {
                "id": s["session_id"],
                "title": s["title"] or "(No title)",
                "first_time": s["first_time"].isoformat() if s["first_time"] else None,
            }
            for s in sessions
        ]
        return jsonify(data)
    except Exception as e:
        logging.exception("Error in /api/chat/sessions")
        return jsonify({"error": str(e)}), 500


# ---------------------------
# Run
# ---------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
