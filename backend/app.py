from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from database import get_db_connection

import os
import uuid

from werkzeug.utils import secure_filename
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)


# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)

app.config["SECRET_KEY"] = "civicconnect-secret-key"

CORS(
    app,
    resources={
        r"/*": {
            "origins": "*"
        }
    }
)


# ============================================================
# UPLOAD FOLDER
# ============================================================

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(__file__),
    "uploads"
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ============================================================
# DATABASE HELPER
# ============================================================

def get_connection():
    return get_db_connection()


# ============================================================
# PASSWORD FUNCTIONS
# ============================================================

def hash_password(password):
    return generate_password_hash(password)


def verify_password(plain_password, stored_password):

    if not stored_password:
        return False

    try:

        return check_password_hash(
            stored_password,
            plain_password
        )

    except Exception:

        return False


# ============================================================
# HOME
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "CivicConnect Backend Running!",
        "status": "online"
    }), 200


# ============================================================
# SERVE UPLOADED IMAGES
# ============================================================

@app.route(
    "/uploads/<path:filename>",
    methods=["GET"]
)
def uploaded_file(filename):

    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


# ============================================================
# CITIZEN REGISTER
# ============================================================

@app.route(
    "/register",
    methods=["POST"]
)
def register():

    conn = None
    cursor = None

    try:

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({
                "error":
                    "Invalid request data."
            }), 400

        name = str(
            data.get("name", "")
        ).strip()

        email = str(
            data.get("email", "")
        ).strip()

        phone = str(
            data.get("phone", "")
        ).strip()

        password = str(
            data.get("password", "")
        )

        if not name:

            return jsonify({
                "error":
                    "Name is required."
            }), 400

        if not email:

            return jsonify({
                "error":
                    "Email is required."
            }), 400

        if not password:

            return jsonify({
                "error":
                    "Password is required."
            }), 400

        if len(password) < 6:

            return jsonify({
                "error":
                    "Password must contain at least 6 characters."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE LOWER(TRIM(email))
                  =
                  LOWER(TRIM(%s))
            """,
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:

            return jsonify({
                "error":
                    "An account with this email already exists. Please login instead."
            }), 409

        hashed_password = hash_password(
            password
        )

        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                phone,
                password
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s
            )
            RETURNING id
            """,
            (
                name,
                email,
                phone,
                hashed_password
            )
        )

        user_id = cursor.fetchone()[0]

        conn.commit()

        return jsonify({

            "message":
                "User Registered Successfully!",

            "user_id":
                user_id,

            "id":
                user_id,

            "name":
                name,

            "email":
                email,

            "phone":
                phone

        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "REGISTRATION ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Registration failed.",

            "details":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# CITIZEN LOGIN
# ============================================================

@app.route(
    "/login",
    methods=["POST"]
)
def login():

    conn = None
    cursor = None

    try:

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({
                "error":
                    "Invalid request data."
            }), 400

        email = str(
            data.get("email", "")
        ).strip()

        password = str(
            data.get("password", "")
        )

        if not email:

            return jsonify({
                "message":
                    "Email is required."
            }), 400

        if not password:

            return jsonify({
                "message":
                    "Password is required."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                password,
                phone
            FROM users
            WHERE LOWER(TRIM(email))
                  =
                  LOWER(TRIM(%s))
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "message":
                    "This email is not registered. Please create an account first."
            }), 404

        password_ok = verify_password(
            password,
            user[3]
        )

        if not password_ok:

            return jsonify({
                "message":
                    "Incorrect password."
            }), 401

        return jsonify({

            "message":
                "Login Successful!",

            "user_id":
                user[0],

            "id":
                user[0],

            "name":
                user[1],

            "email":
                user[2],

            "phone":
                user[4] or ""

        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "LOGIN ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Login failed.",

            "details":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# ADMIN LOGIN
# ============================================================

@app.route(
    "/admin/login",
    methods=["POST"]
)
def admin_login():

    conn = None
    cursor = None

    try:

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({
                "error":
                    "Invalid request data."
            }), 400

        email = str(
            data.get("email", "")
        ).strip()

        password = str(
            data.get("password", "")
        )

        if not email:

            return jsonify({
                "message":
                    "Admin email is required."
            }), 400

        if not password:

            return jsonify({
                "message":
                    "Admin password is required."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                a.admin_id,
                a.name,
                a.email,
                a.password,
                a.department_id,
                a.municipality_id,
                d.department_name,
                m.municipality_name
            FROM admins a

            LEFT JOIN departments d
                ON a.department_id =
                   d.department_id

            LEFT JOIN municipalities m
                ON a.municipality_id =
                   m.municipality_id

            WHERE LOWER(TRIM(a.email))
                  =
                  LOWER(TRIM(%s))
            """,
            (email,)
        )

        admin = cursor.fetchone()

        if not admin:

            return jsonify({
                "message":
                    "Admin account not found."
            }), 404

        password_ok = verify_password(
            password,
            admin[3]
        )

        if not password_ok:

            return jsonify({
                "message":
                    "Incorrect admin password."
            }), 401

        return jsonify({

            "message":
                "Admin login successful!",

            "admin_id":
                admin[0],

            "name":
                admin[1],

            "email":
                admin[2],

            "department_id":
                admin[4],

            "municipality_id":
                admin[5],

            "department_name":
                admin[6] or "Not Assigned",

            "municipality_name":
                admin[7] or "Not Assigned"

        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "ADMIN LOGIN ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Admin login failed.",

            "details":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# GET USER
# ============================================================

@app.route(
    "/user/<int:user_id>",
    methods=["GET"]
)
def get_user(user_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                phone
            FROM users
            WHERE id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "error":
                    "User not found."
            }), 404

        return jsonify({

            "id":
                user[0],

            "user_id":
                user[0],

            "name":
                user[1],

            "email":
                user[2],

            "phone":
                user[3] or ""

        }), 200

    except Exception as e:

        print(
            "GET USER ERROR:",
            repr(e)
        )

        return jsonify({
            "error":
                "Unable to fetch user.",
            "details":
                str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# GET MUNICIPALITIES
# ============================================================

@app.route(
    "/municipalities",
    methods=["GET"]
)
def get_municipalities():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                municipality_id,
                municipality_name,
                address,
                contact_number,
                email
            FROM municipalities
            ORDER BY municipality_name
            """
        )

        rows = cursor.fetchall()

        municipalities = []

        for row in rows:

            municipalities.append({

                "municipality_id":
                    row[0],

                "municipality_name":
                    row[1],

                "address":
                    row[2],

                "contact_number":
                    row[3],

                "email":
                    row[4]

            })

        return jsonify(
            municipalities
        ), 200

    except Exception as e:

        print(
            "MUNICIPALITY ERROR:",
            repr(e)
        )

        return jsonify({
            "error":
                "Unable to fetch municipalities.",
            "details":
                str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# GET DEPARTMENTS
# ============================================================

@app.route(
    "/departments",
    methods=["GET"]
)
def get_departments():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                department_id,
                department_name,
                contact_details,
                description
            FROM departments
            ORDER BY department_id
            """
        )

        rows = cursor.fetchall()

        departments = []

        for row in rows:

            departments.append({

                "department_id":
                    row[0],

                "department_name":
                    row[1],

                "contact_details":
                    row[2],

                "description":
                    row[3]

            })

        return jsonify(
            departments
        ), 200

    except Exception as e:

        print(
            "DEPARTMENT ERROR:",
            repr(e)
        )

        return jsonify({
            "error":
                "Unable to fetch departments.",
            "details":
                str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# STATISTICS
# ============================================================

@app.route(
    "/statistics",
    methods=["GET"]
)
def get_statistics():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM complaints
            """
        )

        total_complaints = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM complaints
            WHERE LOWER(TRIM(status))
                  = 'resolved'
            """
        )

        resolved_complaints = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM complaints
            WHERE LOWER(TRIM(status))
                  <> 'resolved'
               OR status IS NULL
            """
        )

        active_complaints = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM users
            """
        )

        registered_citizens = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM departments
            """
        )

        departments = (
            cursor.fetchone()[0] or 0
        )

        return jsonify({

            "total_complaints":
                total_complaints,

            "resolved_complaints":
                resolved_complaints,

            "active_complaints":
                active_complaints,

            "registered_citizens":
                registered_citizens,

            "departments":
                departments

        }), 200

    except Exception as e:

        print(
            "STATISTICS ERROR:",
            repr(e)
        )

        return jsonify({
            "error":
                "Unable to fetch statistics.",
            "details":
                str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# CATEGORY -> DEPARTMENT
# ============================================================

CATEGORY_DEPARTMENT_MAP = {

    "waste management":
        "Sanitation Department",

    "sanitation":
        "Sanitation Department",

    "roads and footpaths":
        "Roads Department",

    "roads":
        "Roads Department",

    "roads & potholes":
        "Roads Department",

    "storm water drainage":
        "Drainage Department",

    "drainage":
        "Drainage Department",

    "street lighting / electrical":
        "Electricity Department",

    "street lights":
        "Electricity Department",

    "electricity":
        "Electricity Department",

    "water supply":
        "Water Supply Department",

    "public health":
        "Public Health Department",

    "parks and playgrounds":
        "Parks and Recreation Department",

    "trees and environment":
        "Environment Department",

    "buildings and construction":
        "Town Planning Department",

    "revenue / tax / licensing":
        "Revenue Department",

    "public facilities":
        "Public Facilities Department",

    "education":
        "Education Department",

    "general":
        "General Administration Department"
}


DEPARTMENT_KEYWORDS = {

    "Roads Department": [
        "road",
        "roads",
        "pothole",
        "potholes",
        "footpath",
        "footpaths",
        "sidewalk",
        "divider",
        "manhole",
        "road sign",
        "road signs",
        "cave-in",
        "road debris",
        "road obstruction"
    ],

    "Sanitation Department": [
        "waste",
        "garbage",
        "trash",
        "rubbish",
        "dumping",
        "litter",
        "littering",
        "dead animal",
        "wet waste",
        "dry waste",
        "plastic waste",
        "construction waste",
        "garden waste",
        "garbage burning"
    ],

    "Electricity Department": [
        "electric",
        "electrical",
        "street light",
        "streetlight",
        "electric pole",
        "power",
        "flickering",
        "dark street",
        "exposed wire",
        "electrical hazard"
    ],

    "Water Supply Department": [
        "water supply",
        "water leakage",
        "water leak",
        "pipeline",
        "water pressure",
        "contaminated water",
        "illegal water connection",
        "broken water pipe"
    ],

    "Drainage Department": [
        "drain",
        "drainage",
        "sewage",
        "sewer",
        "flooding",
        "flood",
        "waterlogging",
        "stagnant water",
        "water flow obstruction"
    ],

    "Public Health Department": [
        "mosquito",
        "unhygienic",
        "public toilet",
        "sanitation issue",
        "stray animal",
        "health hazard"
    ],

    "Parks and Recreation Department": [
        "park",
        "playground",
        "bench",
        "fencing",
        "walking path",
        "garbage in park"
    ],

    "Environment Department": [
        "tree",
        "fallen tree",
        "tree branch",
        "environmental pollution",
        "open burning",
        "tree cutting"
    ],

    "Town Planning Department": [
        "illegal construction",
        "unauthorized building",
        "unsafe building",
        "construction debris",
        "encroachment",
        "building obstruction"
    ],

    "Revenue Department": [
        "property tax",
        "professional tax",
        "trade license",
        "tax payment",
        "tax information",
        "license renewal"
    ],

    "Public Facilities Department": [
        "public toilet",
        "community hall",
        "public building",
        "drinking water",
        "public facility"
    ],

    "Education Department": [
        "school",
        "municipal school"
    ],

    "General Administration Department": [
        "other civic issue",
        "general municipal complaint"
    ]
}


# ============================================================
# DEPARTMENT LOOKUP
# ============================================================

def get_department_name_lookup(cursor):

    cursor.execute(
        """
        SELECT
            department_id,
            department_name
        FROM departments
        """
    )

    rows = cursor.fetchall()

    return {
        str(name).strip().lower():
            department_id
        for department_id, name in rows
    }


def find_department(
    cursor,
    category,
    subcategory=None
):

    name_lookup = (
        get_department_name_lookup(
            cursor
        )
    )

    category_text = str(
        category or ""
    ).strip().lower()

    subcategory_text = str(
        subcategory or ""
    ).strip().lower()

    combined_text = (
        f"{category_text} "
        f"{subcategory_text}"
    ).strip()

    target_department_name = (
        CATEGORY_DEPARTMENT_MAP.get(
            category_text
        )
    )

    if target_department_name:

        department_id = (
            name_lookup.get(
                target_department_name
                .strip()
                .lower()
            )
        )

        if department_id is not None:

            return (
                department_id,
                target_department_name
            )

    if combined_text:

        for department_name, keywords in (
            DEPARTMENT_KEYWORDS.items()
        ):

            for keyword in keywords:

                if keyword in combined_text:

                    department_id = (
                        name_lookup.get(
                            department_name
                            .strip()
                            .lower()
                        )
                    )

                    if department_id is not None:

                        return (
                            department_id,
                            department_name
                        )

    return None, None


# ============================================================
# ADD COMPLAINT
# ============================================================

@app.route(
    "/complaint",
    methods=["POST"]
)
def add_complaint():

    conn = None
    cursor = None

    try:

        if (
            request.content_type
            and
            "multipart/form-data"
            in request.content_type
        ):

            data = request.form

        else:

            data = request.get_json(
                silent=True
            )

        if not data:

            return jsonify({
                "error":
                    "Invalid complaint data."
            }), 400

        user_id = data.get(
            "user_id"
        )

        municipality_id = data.get(
            "municipality_id"
        )

        gender = data.get(
            "gender"
        )

        street_address = data.get(
            "street_address"
        )

        pin_code = data.get(
            "pin_code"
        )

        category = data.get(
            "category"
        )

        subcategory = data.get(
            "subcategory"
        )

        title = data.get(
            "title"
        )

        description = data.get(
            "description"
        )

        location = data.get(
            "location"
        )

        if not user_id:

            return jsonify({
                "error":
                    "Login required. Please login before submitting a complaint."
            }), 401

        if not municipality_id:

            return jsonify({
                "error":
                    "Municipality is required."
            }), 400

        if not gender:

            return jsonify({
                "error":
                    "Gender is required."
            }), 400

        if not street_address:

            return jsonify({
                "error":
                    "Street address is required."
            }), 400

        if not pin_code:

            return jsonify({
                "error":
                    "PIN code is required."
            }), 400

        if not category:

            return jsonify({
                "error":
                    "Complaint category is required."
            }), 400

        if not title:

            return jsonify({
                "error":
                    "Complaint title is required."
            }), 400

        if not description:

            return jsonify({
                "error":
                    "Complaint description is required."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                name,
                email
            FROM users
            WHERE id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "error":
                    "User account not found. Please login again."
            }), 401

        cursor.execute(
            """
            SELECT
                municipality_id,
                municipality_name
            FROM municipalities
            WHERE municipality_id = %s
            """,
            (municipality_id,)
        )

        municipality = cursor.fetchone()

        if not municipality:

            return jsonify({
                "error":
                    "Selected municipality was not found."
            }), 404

        (
            department_id,
            department_name
        ) = find_department(
            cursor,
            category,
            subcategory
        )

        if department_id is None:

            return jsonify({

                "error":
                    "Could not determine a department for this complaint.",

                "category":
                    category,

                "subcategory":
                    subcategory

            }), 400

        cursor.execute(
            """
            SELECT
                admin_id,
                name,
                email
            FROM admins
            WHERE department_id = %s
              AND municipality_id = %s
            ORDER BY admin_id
            LIMIT 1
            """,
            (
                department_id,
                municipality_id
            )
        )

        admin = cursor.fetchone()

        assigned_admin = None
        admin_name = None
        admin_email = None

        if admin:

            assigned_admin = admin[0]
            admin_name = admin[1]
            admin_email = admin[2]

        status = "Department Processing"
        priority = "Normal"
        image_url = None

        if "image" in request.files:

            image = request.files["image"]

            if image and image.filename:

                original_name = secure_filename(
                    image.filename
                )

                extension = os.path.splitext(
                    original_name
                )[1]

                unique_name = (
                    str(uuid.uuid4())
                    +
                    extension
                )

                image_path = os.path.join(
                    app.config["UPLOAD_FOLDER"],
                    unique_name
                )

                image.save(
                    image_path
                )

                image_url = (
                    "/uploads/"
                    +
                    unique_name
                )

        if not location:

            location = (
                f"{street_address}, "
                f"PIN {pin_code}"
            )

        cursor.execute(
            """
            INSERT INTO complaints
            (
                user_id,
                title,
                description,
                category,
                location,
                image_url,
                status,
                priority,
                assigned_department,
                municipality_id,
                department_id,
                gender,
                street_address,
                pin_code,
                subcategory,
                updated_at,
                assigned_admin
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                CURRENT_TIMESTAMP,
                %s
            )
            RETURNING id
            """,
            (
                user_id,
                title,
                description,
                category,
                location,
                image_url,
                status,
                priority,
                department_id,
                municipality_id,
                department_id,
                gender,
                street_address,
                pin_code,
                subcategory,
                assigned_admin
            )
        )

        complaint_id = cursor.fetchone()[0]

        cursor.execute(
            """
            INSERT INTO complaint_history
            (
                complaint_id,
                old_status,
                new_status
            )
            VALUES
            (
                %s,
                %s,
                %s
            )
            """,
            (
                complaint_id,
                "Submitted",
                status
            )
        )

        conn.commit()

        return jsonify({

            "success":
                True,

            "message":
                "Complaint submitted successfully!",

            "complaint_id":
                complaint_id,

            "user_id":
                user_id,

            "municipality_id":
                municipality_id,

            "municipality_name":
                municipality[1],

            "department_id":
                department_id,

            "department_name":
                department_name,

            "assigned_admin":
                assigned_admin,

            "admin_name":
                admin_name,

            "admin_email":
                admin_email,

            "status":
                status,

            "priority":
                priority,

            "image_url":
                image_url

        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "COMPLAINT SUBMISSION ERROR:",
            repr(e)
        )

        return jsonify({

            "success":
                False,

            "error":
                "Unable to submit complaint.",

            "details":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# GET ALL COMPLAINTS
# ============================================================

@app.route(
    "/complaints",
    methods=["GET"]
)
def get_complaints():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                c.id,
                c.title,
                c.description,
                c.category,
                c.subcategory,
                c.location,
                c.image_url,
                c.status,
                c.priority,
                c.created_at,
                c.updated_at,
                d.department_name,
                m.municipality_name
            FROM complaints c

            LEFT JOIN departments d
                ON c.department_id =
                   d.department_id

            LEFT JOIN municipalities m
                ON c.municipality_id =
                   m.municipality_id

            ORDER BY c.id DESC
            """
        )

        rows = cursor.fetchall()

        complaints = []

        for row in rows:

            complaints.append({

                "complaint_id":
                    row[0],

                "title":
                    row[1],

                "description":
                    row[2],

                "category":
                    row[3],

                "subcategory":
                    row[4],

                "location":
                    row[5],

                "image_url":
                    row[6],

                "status":
                    row[7],

                "priority":
                    row[8],

                "created_at":
                    row[9].isoformat()
                    if row[9]
                    else None,

                "updated_at":
                    row[10].isoformat()
                    if row[10]
                    else None,

                "department_name":
                    row[11]
                    or
                    "Not Assigned",

                "municipality_name":
                    row[12]
                    or
                    "Not Assigned"

            })

        return jsonify(
            complaints
        ), 200

    except Exception as e:

        print(
            "GET COMPLAINTS ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Unable to fetch complaints.",

            "details":
                str(e),

            "complaints":
                []

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# MY COMPLAINTS
# ============================================================

@app.route(
    "/my_complaints/<int:user_id>",
    methods=["GET"]
)
def my_complaints(user_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

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
                "error":
                    "User not found."
            }), 404

        cursor.execute(
            """
            SELECT
                c.id,
                c.title,
                c.description,
                c.category,
                c.subcategory,
                c.location,
                c.image_url,
                c.status,
                c.priority,
                c.created_at,
                c.updated_at,
                d.department_name,
                m.municipality_name,
                c.remarks,
                c.assigned_admin
            FROM complaints c

            LEFT JOIN departments d
                ON c.department_id =
                   d.department_id

            LEFT JOIN municipalities m
                ON c.municipality_id =
                   m.municipality_id

            WHERE c.user_id = %s

            ORDER BY c.id DESC
            """,
            (user_id,)
        )

        rows = cursor.fetchall()

        complaints = []

        for row in rows:

            complaints.append({

                "complaint_id":
                    row[0],

                "title":
                    row[1],

                "description":
                    row[2],

                "category":
                    row[3],

                "subcategory":
                    row[4],

                "location":
                    row[5],

                "image_url":
                    row[6],

                "status":
                    row[7],

                "priority":
                    row[8],

                "created_at":
                    row[9].isoformat()
                    if row[9]
                    else None,

                "updated_at":
                    row[10].isoformat()
                    if row[10]
                    else None,

                "department_name":
                    row[11]
                    or
                    "Not Assigned",

                "municipality_name":
                    row[12]
                    or
                    "Not Assigned",

                "remarks":
                    row[13],

                "assigned_admin":
                    row[14]

            })

        return jsonify(
            complaints
        ), 200

    except Exception as e:

        print(
            "MY COMPLAINTS ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Unable to fetch your complaints.",

            "details":
                str(e),

            "complaints":
                []

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# COMPLAINT HISTORY
# ============================================================

@app.route(
    "/complaint_history/<int:complaint_id>",
    methods=["GET"]
)
def complaint_history(complaint_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                complaint_id,
                old_status,
                new_status,
                remarks,
                created_at
            FROM complaint_history
            WHERE complaint_id = %s
            ORDER BY id ASC
            """,
            (complaint_id,)
        )

        rows = cursor.fetchall()

        history = []

        for row in rows:

            history.append({

                "id":
                    row[0],

                "complaint_id":
                    row[1],

                "old_status":
                    row[2],

                "new_status":
                    row[3],

                "remarks":
                    row[4],

                "created_at":
                    row[5].isoformat()
                    if row[5]
                    else None

            })

        return jsonify({
            "success": True,
            "history": history
        }), 200

    except Exception as e:

        print(
            "COMPLAINT HISTORY ERROR:",
            repr(e)
        )

        return jsonify({

            "success":
                False,

            "error":
                "Unable to fetch complaint history.",

            "details":
                str(e),

            "history":
                []

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# TRACK SINGLE COMPLAINT
#
# GET /track_complaint/1
# AND
# GET /complaint/1
#
# Both are supported.
# ============================================================

def get_single_complaint(complaint_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                c.id,
                c.user_id,
                c.title,
                c.description,
                c.category,
                c.subcategory,
                c.location,
                c.image_url,
                c.status,
                c.priority,
                c.created_at,
                c.updated_at,
                d.department_id,
                d.department_name,
                m.municipality_id,
                m.municipality_name,
                a.admin_id,
                a.name,
                c.remarks
            FROM complaints c

            LEFT JOIN departments d
                ON c.department_id =
                   d.department_id

            LEFT JOIN municipalities m
                ON c.municipality_id =
                   m.municipality_id

            LEFT JOIN admins a
                ON c.assigned_admin =
                   a.admin_id

            WHERE c.id = %s
            """,
            (complaint_id,)
        )

        complaint = cursor.fetchone()

        if not complaint:

            return jsonify({
                "message":
                    "Complaint not found."
            }), 404

        return jsonify({

            "complaint_id":
                complaint[0],

            "user_id":
                complaint[1],

            "title":
                complaint[2],

            "description":
                complaint[3],

            "category":
                complaint[4],

            "subcategory":
                complaint[5],

            "location":
                complaint[6],

            "image_url":
                complaint[7],

            "status":
                complaint[8],

            "priority":
                complaint[9],

            "created_at":
                complaint[10].isoformat()
                if complaint[10]
                else None,

            "updated_at":
                complaint[11].isoformat()
                if complaint[11]
                else None,

            "department_id":
                complaint[12],

            "department_name":
                complaint[13]
                or
                "Not Assigned",

            "municipality_id":
                complaint[14],

            "municipality_name":
                complaint[15]
                or
                "Not Assigned",

            "assigned_admin":
                complaint[16],

            "admin_name":
                complaint[17],

            "remarks":
                complaint[18],

            "message":
                "Complaint tracking details"

        }), 200

    except Exception as e:

        print(
            "TRACK COMPLAINT ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Unable to track complaint.",

            "details":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route(
    "/track_complaint/<int:complaint_id>",
    methods=["GET"]
)
def track_complaint(complaint_id):

    return get_single_complaint(
        complaint_id
    )


# ============================================================
# IMPORTANT FIX:
#
# Your frontend was requesting:
#
# GET /complaint/1
#
# Previously this URL only accepted PUT.
#
# Now GET /complaint/1 works for tracking.
# ============================================================

@app.route(
    "/complaint/<int:complaint_id>",
    methods=["GET"]
)
def get_complaint_by_id(complaint_id):

    return get_single_complaint(
        complaint_id
    )


# ============================================================
# UPDATE COMPLAINT
# ============================================================

@app.route(
    "/complaint/<int:complaint_id>",
    methods=["PUT"]
)
def update_complaint(complaint_id):

    conn = None
    cursor = None

    try:

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({
                "error":
                    "Invalid request data."
            }), 400

        new_status = data.get(
            "status"
        )

        remarks = data.get(
            "remarks"
        )

        if (
            not new_status
            and
            remarks is None
        ):

            return jsonify({
                "error":
                    "Provide a status and/or remarks to update."
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                status,
                remarks
            FROM complaints
            WHERE id = %s
            """,
            (complaint_id,)
        )

        complaint = cursor.fetchone()

        if not complaint:

            return jsonify({
                "error":
                    "Complaint not found."
            }), 404

        old_status = complaint[0]
        old_remarks = complaint[1]

        status_to_save = (
            new_status
            if new_status
            else old_status
        )

        remarks_to_save = (
            remarks
            if remarks is not None
            else old_remarks
        )

        cursor.execute(
            """
            UPDATE complaints
            SET
                status = %s,
                remarks = %s,
                updated_at =
                    CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (
                status_to_save,
                remarks_to_save,
                complaint_id
            )
        )

        cursor.execute(
            """
            INSERT INTO complaint_history
            (
                complaint_id,
                old_status,
                new_status,
                remarks
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s
            )
            """,
            (
                complaint_id,
                old_status,
                status_to_save,
                remarks_to_save
            )
        )

        conn.commit()

        return jsonify({

            "message":
                "Complaint updated successfully!",

            "complaint_id":
                complaint_id,

            "old_status":
                old_status,

            "new_status":
                status_to_save,

            "remarks":
                remarks_to_save

        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "UPDATE COMPLAINT ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Unable to update complaint.",

            "details":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# ADMIN COMPLAINTS
# ============================================================

@app.route(
    "/admin/complaints/<int:admin_id>",
    methods=["GET"]
)
def get_admin_complaints(admin_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                admin_id,
                name,
                email,
                department_id,
                municipality_id
            FROM admins
            WHERE admin_id = %s
            """,
            (admin_id,)
        )

        admin = cursor.fetchone()

        if not admin:

            return jsonify({

                "error":
                    "Admin not found.",

                "complaints":
                    []

            }), 404

        department_id = admin[3]
        municipality_id = admin[4]

        if department_id is None:

            return jsonify({

                "error":
                    "This admin has no department assigned.",

                "complaints":
                    []

            }), 200

        cursor.execute(
            """
            SELECT
                c.id,
                c.title,
                c.description,
                c.category,
                c.subcategory,
                c.location,
                c.image_url,
                c.status,
                c.priority,
                c.created_at,
                c.updated_at,
                c.user_id,
                u.name,
                u.email,
                u.phone,
                c.department_id,
                d.department_name,
                c.municipality_id,
                m.municipality_name,
                c.remarks,
                c.assigned_admin
            FROM complaints c

            LEFT JOIN users u
                ON c.user_id = u.id

            LEFT JOIN departments d
                ON c.department_id =
                   d.department_id

            LEFT JOIN municipalities m
                ON c.municipality_id =
                   m.municipality_id

            WHERE c.department_id = %s
              AND (
                    c.municipality_id = %s
                    OR c.municipality_id IS NULL
                  )

            ORDER BY c.id DESC
            """,
            (
                department_id,
                municipality_id
            )
        )

        rows = cursor.fetchall()

        complaints = []

        for row in rows:

            complaints.append({

                "complaint_id":
                    row[0],

                "title":
                    row[1],

                "description":
                    row[2],

                "category":
                    row[3],

                "subcategory":
                    row[4],

                "location":
                    row[5],

                "image_url":
                    row[6],

                "status":
                    row[7],

                "priority":
                    row[8],

                "created_at":
                    row[9].isoformat()
                    if row[9]
                    else None,

                "updated_at":
                    row[10].isoformat()
                    if row[10]
                    else None,

                "user_id":
                    row[11],

                "user_name":
                    row[12],

                "user_email":
                    row[13],

                "user_phone":
                    row[14],

                "department_id":
                    row[15],

                "department_name":
                    row[16]
                    or
                    "Not Assigned",

                "municipality_id":
                    row[17],

                "municipality_name":
                    row[18]
                    or
                    "Not Assigned",

                "remarks":
                    row[19],

                "assigned_admin":
                    row[20]

            })

        return jsonify({

            "admin": {

                "admin_id":
                    admin[0],

                "name":
                    admin[1],

                "email":
                    admin[2],

                "department_id":
                    admin[3],

                "municipality_id":
                    admin[4]

            },

            "total_complaints":
                len(complaints),

            "complaints":
                complaints

        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "ADMIN COMPLAINTS ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Unable to fetch admin complaints.",

            "details":
                str(e),

            "complaints":
                []

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# ADMIN STATISTICS
# ============================================================

@app.route(
    "/admin/stats",
    methods=["GET"]
)
def admin_stats():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM complaints
            """
        )

        total_complaints = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM complaints
            WHERE LOWER(TRIM(status))
            IN
            (
                'submitted',
                'pending',
                'department processing',
                'under review'
            )
            """
        )

        pending_complaints = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM complaints
            WHERE LOWER(TRIM(status))
            =
            'in progress'
            """
        )

        in_progress_complaints = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM complaints
            WHERE LOWER(TRIM(status))
            IN
            (
                'resolved',
                'closed'
            )
            """
        )

        resolved_complaints = (
            cursor.fetchone()[0] or 0
        )

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM users
            """
        )

        registered_citizens = (
            cursor.fetchone()[0] or 0
        )

        return jsonify({

            "total_complaints":
                total_complaints,

            "pending_complaints":
                pending_complaints,

            "in_progress_complaints":
                in_progress_complaints,

            "resolved_complaints":
                resolved_complaints,

            "registered_citizens":
                registered_citizens

        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "ADMIN STATS ERROR:",
            repr(e)
        )

        return jsonify({

            "error":
                "Unable to fetch admin statistics.",

            "details":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# ANNOUNCEMENTS
# ============================================================

@app.route(
    "/announcements",
    methods=["GET"]
)
def get_announcements():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                title,
                message,
                announcement_type,
                is_important,
                created_by,
                created_at,
                updated_at
            FROM announcements
            ORDER BY created_at DESC
            """
        )

        rows = cursor.fetchall()

        announcements = []

        for row in rows:

            announcements.append({

                "id":
                    row[0],

                "title":
                    row[1],

                "message":
                    row[2],

                "announcement_type":
                    row[3],

                "is_important":
                    row[4],

                "created_by":
                    row[5],

                "created_at":
                    row[6].isoformat()
                    if row[6]
                    else None,

                "updated_at":
                    row[7].isoformat()
                    if row[7]
                    else None

            })

        return jsonify({

            "success":
                True,

            "announcements":
                announcements

        }), 200

    except Exception as e:

        print(
            "GET ANNOUNCEMENTS ERROR:",
            repr(e)
        )

        return jsonify({

            "success":
                False,

            "message":
                "Failed to fetch announcements",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# IMPORTANT ANNOUNCEMENTS
# ============================================================

@app.route(
    "/announcements/important",
    methods=["GET"]
)
def get_important_announcements():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                title,
                message,
                announcement_type,
                is_important,
                created_by,
                created_at,
                updated_at
            FROM announcements
            WHERE is_important = TRUE
            ORDER BY created_at DESC
            LIMIT 3
            """
        )

        rows = cursor.fetchall()

        announcements = []

        for row in rows:

            announcements.append({

                "id":
                    row[0],

                "title":
                    row[1],

                "message":
                    row[2],

                "announcement_type":
                    row[3],

                "is_important":
                    row[4],

                "created_by":
                    row[5],

                "created_at":
                    row[6].isoformat()
                    if row[6]
                    else None,

                "updated_at":
                    row[7].isoformat()
                    if row[7]
                    else None

            })

        return jsonify({

            "success":
                True,

            "announcements":
                announcements

        }), 200

    except Exception as e:

        print(
            "GET IMPORTANT ANNOUNCEMENTS ERROR:",
            repr(e)
        )

        return jsonify({

            "success":
                False,

            "message":
                "Failed to fetch important announcements",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# SERVER
# ============================================================

if __name__ == "__main__":

    print(
        "🚀 CivicConnect Flask Server Starting..."
    )

    print(
        "📍 http://127.0.0.1:5000"
    )

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )