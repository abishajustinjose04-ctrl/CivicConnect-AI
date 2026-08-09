from flask import Flask, request, jsonify
from flask_cors import CORS
from database import conn, cursor

import os
from werkzeug.utils import secure_filename


# =====================================================
# FLASK APP
# =====================================================

app = Flask(__name__)

# Allow React frontend
CORS(app)


# =====================================================
# HOME
# =====================================================

@app.route("/", methods=["GET"])
def home():
    return "Welcome to CivicConnect AI Backend!"


# =====================================================
# REGISTER
# =====================================================

@app.route("/register", methods=["POST"])
def register():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Invalid request data"
            }), 400

        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({
                "error": "Name, email and password are required"
            }), 400

        # Check whether email already exists
        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({
                "error": "An account with this email already exists. Please login instead."
            }), 409

        # Create user
        cursor.execute(
            """
            INSERT INTO users
            (name, email, phone, password)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """,
            (
                name,
                email,
                phone,
                password
            )
        )

        user_id = cursor.fetchone()[0]

        conn.commit()

        return jsonify({
            "message": "User Registered Successfully!",
            "user_id": user_id
        }), 201

    except Exception as e:

        conn.rollback()

        print("Registration Error:", e)

        return jsonify({
            "error": "Registration failed. Please try again."
        }), 500


# =====================================================
# LOGIN
# =====================================================

@app.route("/login", methods=["POST"])
def login():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Invalid request data"
            }), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "message": "Email and password are required"
            }), 400

        cursor.execute(
            """
            SELECT id, name, email
            FROM users
            WHERE email = %s
            AND password = %s
            """,
            (
                email,
                password
            )
        )

        user = cursor.fetchone()

        if user:

            return jsonify({
                "message": "Login Successful!",
                "user_id": user[0],
                "name": user[1],
                "email": user[2]
            }), 200

        return jsonify({
            "message": "Invalid Email or Password"
        }), 401

    except Exception as e:

        print("Login Error:", e)

        return jsonify({
            "error": "Login failed. Please try again."
        }), 500


# =====================================================
# SUBMIT COMPLAINT
# =====================================================

@app.route("/complaint", methods=["POST"])
def add_complaint():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Invalid request data"
            }), 400

        user_id = data.get("user_id")
        title = data.get("title")
        description = data.get("description")
        category = data.get("category")
        location = data.get("location")

        if not user_id:
            return jsonify({
                "error": "User ID is required"
            }), 400

        if not title:
            return jsonify({
                "error": "Complaint title is required"
            }), 400

        if not description:
            return jsonify({
                "error": "Complaint description is required"
            }), 400

        if not category:
            return jsonify({
                "error": "Complaint category is required"
            }), 400

        if not location:
            return jsonify({
                "error": "Complaint location is required"
            }), 400

        # Check user exists
        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "error": "User not found. Please login again."
            }), 404

        cursor.execute(
            """
            INSERT INTO complaints
            (
                user_id,
                title,
                description,
                category,
                location
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                user_id,
                title,
                description,
                category,
                location
            )
        )

        complaint_id = cursor.fetchone()[0]

        conn.commit()

        return jsonify({
            "message": "Complaint submitted successfully!",
            "complaint_id": complaint_id
        }), 201

    except Exception as e:

        conn.rollback()

        print("Complaint Submission Error:", e)

        return jsonify({
            "error": "Unable to submit complaint."
        }), 500


# =====================================================
# GET ALL COMPLAINTS
# =====================================================

@app.route("/complaints", methods=["GET"])
def get_complaints():

    try:

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                title,
                description,
                category,
                location,
                image_url,
                status,
                priority,
                assigned_department,
                created_at
            FROM complaints
            ORDER BY id DESC
            """
        )

        rows = cursor.fetchall()

        complaints = []

        for row in rows:

            complaints.append({

                "complaint_id": row[0],
                "user_id": row[1],
                "title": row[2],
                "description": row[3],
                "category": row[4],
                "location": row[5],
                "image_url": row[6],
                "status": row[7],
                "priority": row[8],
                "assigned_department": row[9],
                "created_at": row[10]

            })

        return jsonify(complaints), 200

    except Exception as e:

        print("Get Complaints Error:", e)

        return jsonify({
            "error": "Unable to fetch complaints."
        }), 500


# =====================================================
# TRACK SINGLE COMPLAINT
# =====================================================

@app.route(
    "/track_complaint/<int:complaint_id>",
    methods=["GET"]
)
def track_complaint(complaint_id):

    try:

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                title,
                description,
                category,
                location,
                image_url,
                status,
                priority,
                assigned_department,
                created_at
            FROM complaints
            WHERE id = %s
            """,
            (complaint_id,)
        )

        complaint = cursor.fetchone()

        if not complaint:

            return jsonify({
                "message": "Complaint not found"
            }), 404

        return jsonify({

            "complaint_id": complaint[0],
            "user_id": complaint[1],
            "title": complaint[2],
            "description": complaint[3],
            "category": complaint[4],
            "location": complaint[5],
            "image_url": complaint[6],
            "status": complaint[7],
            "priority": complaint[8],
            "assigned_department": complaint[9],
            "created_at": complaint[10],
            "message": "Complaint tracking details"

        }), 200

    except Exception as e:

        print("Track Complaint Error:", e)

        return jsonify({
            "error": "Unable to track complaint."
        }), 500


# =====================================================
# UPDATE COMPLAINT STATUS
# =====================================================

@app.route(
    "/complaint/<int:complaint_id>",
    methods=["PUT"]
)
def update_complaint(complaint_id):

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Invalid request data"
            }), 400

        new_status = data.get("status")

        if not new_status:

            return jsonify({
                "error": "Status is required"
            }), 400

        # Get current status
        cursor.execute(
            """
            SELECT status
            FROM complaints
            WHERE id = %s
            """,
            (complaint_id,)
        )

        complaint = cursor.fetchone()

        if not complaint:

            return jsonify({
                "message": "Complaint not found"
            }), 404

        old_status = complaint[0]

        # Update status
        cursor.execute(
            """
            UPDATE complaints
            SET status = %s
            WHERE id = %s
            """,
            (
                new_status,
                complaint_id
            )
        )

        # Add history
        cursor.execute(
            """
            INSERT INTO complaint_history
            (
                complaint_id,
                old_status,
                new_status
            )
            VALUES (%s, %s, %s)
            """,
            (
                complaint_id,
                old_status,
                new_status
            )
        )

        conn.commit()

        return jsonify({

            "message": "Complaint status updated successfully!",
            "old_status": old_status,
            "new_status": new_status

        }), 200

    except Exception as e:

        conn.rollback()

        print("Update Complaint Error:", e)

        return jsonify({
            "error": "Unable to update complaint."
        }), 500


# =====================================================
# DELETE COMPLAINT
# =====================================================

@app.route(
    "/complaint/<int:complaint_id>",
    methods=["DELETE"]
)
def delete_complaint(complaint_id):

    try:

        cursor.execute(
            """
            DELETE FROM complaints
            WHERE id = %s
            RETURNING id
            """,
            (complaint_id,)
        )

        deleted = cursor.fetchone()

        if not deleted:

            return jsonify({
                "message": "Complaint not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Complaint deleted successfully!"
        }), 200

    except Exception as e:

        conn.rollback()

        print("Delete Complaint Error:", e)

        return jsonify({
            "error": "Unable to delete complaint."
        }), 500


# =====================================================
# COMPLAINT HISTORY
# =====================================================

@app.route(
    "/complaint_history/<int:complaint_id>",
    methods=["GET"]
)
def get_complaint_history(complaint_id):

    try:

        cursor.execute(
            """
            SELECT
                history_id,
                complaint_id,
                old_status,
                new_status,
                updated_at
            FROM complaint_history
            WHERE complaint_id = %s
            ORDER BY updated_at ASC
            """,
            (complaint_id,)
        )

        rows = cursor.fetchall()

        history = []

        for row in rows:

            history.append({

                "history_id": row[0],
                "complaint_id": row[1],
                "old_status": row[2],
                "new_status": row[3],
                "updated_at": row[4]

            })

        return jsonify(history), 200

    except Exception as e:

        print("Complaint History Error:", e)

        return jsonify({
            "error": "Unable to fetch complaint history."
        }), 500


# =====================================================
# UPLOAD IMAGE
# =====================================================

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route(
    "/upload_image/<int:complaint_id>",
    methods=["POST"]
)
def upload_image(complaint_id):

    try:

        if "image" not in request.files:

            return jsonify({
                "message": "No image uploaded"
            }), 400

        image = request.files["image"]

        if image.filename == "":

            return jsonify({
                "message": "No image selected"
            }), 400

        filename = secure_filename(image.filename)

        image_path = os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )

        image.save(image_path)

        # Check complaint exists
        cursor.execute(
            """
            SELECT id
            FROM complaints
            WHERE id = %s
            """,
            (complaint_id,)
        )

        complaint = cursor.fetchone()

        if not complaint:

            return jsonify({
                "message": "Complaint not found"
            }), 404

        cursor.execute(
            """
            UPDATE complaints
            SET image_url = %s
            WHERE id = %s
            """,
            (
                image_path,
                complaint_id
            )
        )

        conn.commit()

        return jsonify({

            "message": "Image uploaded successfully!",
            "image_url": image_path

        }), 200

    except Exception as e:

        conn.rollback()

        print("Image Upload Error:", e)

        return jsonify({
            "error": "Unable to upload image."
        }), 500


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )