import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

ADMIN_KEY = os.environ.get("ADMIN_KEY", "sartaj786")

def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "portfolio_db")
    )

@app.route('/')
def serve_home():
    return send_from_directory('.', 'index.html')

@app.route('/admin')
def serve_admin():
    return send_from_directory('.', 'admin.html')

@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM projects ORDER BY id ASC")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "projects": rows}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/projects', methods=['POST'])
def add_project():
    if request.headers.get("X-Admin-Key") != ADMIN_KEY:
        return jsonify({"success": False, "error": "Unauthorized Admin Key"}), 401

    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = """INSERT INTO projects (title, category, badge, description, tech_stack, live_url, repo_url)
                 VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        values = (
            data.get("title"),
            data.get("category", "web"),
            data.get("badge", "New"),
            data.get("description"),
            data.get("tech_stack"),
            data.get("live_url", ""),
            data.get("repo_url", "")
        )
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Project added to database!"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/inquiries', methods=['POST'])
def create_inquiry():
    data = request.get_json()
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    package = (data.get("package") or "Standard Package").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "error": "Name, Email, and Message are required."}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = """INSERT INTO inquiries (client_name, client_email, client_phone, package_selected, message)
                 VALUES (%s, %s, %s, %s, %s)"""
        cursor.execute(sql, (name, email, phone, package, message))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Inquiry saved in database! Sartaj will contact you soon."}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/inquiries', methods=['GET'])
def list_inquiries():
    if request.headers.get("X-Admin-Key") != ADMIN_KEY:
        return jsonify({"success": False, "error": "Unauthorized Admin Key"}), 401

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM inquiries ORDER BY created_at DESC")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "inquiries": rows}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return send_from_directory('.', '404.html'), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
