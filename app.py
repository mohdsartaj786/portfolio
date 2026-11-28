import os
import sqlite3
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

ADMIN_KEY = os.environ.get("ADMIN_KEY", "sartaj786")
DB_PATH = os.environ.get("DB_PATH", "portfolio.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT NOT NULL,
            client_email TEXT NOT NULL,
            client_phone TEXT,
            package_selected TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'New',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            badge TEXT DEFAULT 'Featured',
            description TEXT NOT NULL,
            tech_stack TEXT NOT NULL,
            live_url TEXT,
            repo_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        seed_projects = [
            ('AuraNet Digital', 'web', 'Live on Vercel', 'Modern corporate digital agency & AI solutions web platform with interactive service workflows and responsive dark UI.', 'HTML5,CSS3,JavaScript,Node.js', 'https://aura-net-digital-modern-web-solutio.vercel.app/', 'https://github.com/mohdsartaj786/-Aura-net-Digital-.git'),
            ('Travel Bharat', 'web', 'Tourism Platform', 'Cultural tourism and destination discovery web application featuring curated Indian travel circuits and interactive booking UI.', 'HTML5,CSS3,JavaScript,Express', '', 'https://github.com/mohdsartaj786/TravelBharat.git'),
            ('PIXORA', 'frontend', 'Creative Gallery', 'High-contrast visual showcase and creative media gallery engineered with responsive CSS Grid and smooth transitions.', 'HTML5,CSS Grid,JavaScript', '', 'https://github.com/mohdsartaj786/PIXORA.git'),
            ('ReWear', 'frontend', 'E-Commerce UI', 'Multi-page dark-mode peer-to-peer clothing exchange and sustainable fashion marketplace frontend built in pure Vanilla JS.', 'HTML5,CSS3,Vanilla JS', '', ''),
            ('FoodRush', 'frontend', 'Ordering Web App', 'Interactive food delivery web interface featuring dynamic menu filtering, live cart counter, and WhatsApp order checkout.', 'HTML5,CSS3,JavaScript', '', ''),
            ('Railway Reservation System', 'java', 'BCA Minor Project', 'Full-featured desktop ticket booking, PNR lookup, and train route management system built with Core Java, Swing, JDBC & MySQL.', 'Core Java,Java Swing,JDBC,MySQL', '', '')
        ]
        cursor.executemany("""
            INSERT INTO projects (title, category, badge, description, tech_stack, live_url, repo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, seed_projects)
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def serve_home():
    return send_from_directory('.', 'index.html')

@app.route('/admin')
def serve_admin():
    return send_from_directory('.', 'admin.html')

@app.route('/api/projects', methods=['GET'])
def get_projects():
    conn = None
    try:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM projects ORDER BY id ASC").fetchall()
        return jsonify({"success": True, "projects": [dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/projects', methods=['POST'])
def add_project():
    if request.headers.get("X-Admin-Key") != ADMIN_KEY:
        return jsonify({"success": False, "error": "Unauthorized Admin Key"}), 401

    data = request.get_json() or {}
    conn = None
    try:
        conn = get_db_connection()
        conn.execute("""
            INSERT INTO projects (title, category, badge, description, tech_stack, live_url, repo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            (data.get("title") or "")[:150],
            data.get("category", "web"),
            (data.get("badge") or "New")[:60],
            (data.get("description") or "")[:2000],
            (data.get("tech_stack") or "")[:255],
            (data.get("live_url") or "")[:255],
            (data.get("repo_url") or "")[:255]
        ))
        conn.commit()
        return jsonify({"success": True, "message": "Project added to database!"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/inquiries', methods=['POST'])
def create_inquiry():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()[:120]
    email = (data.get("email") or "").strip()[:150]
    phone = (data.get("phone") or "").strip()[:30]
    package = (data.get("package") or "Standard Package").strip()[:100]
    message = (data.get("message") or "").strip()[:2000]

    if not name or not email or not message:
        return jsonify({"success": False, "error": "Name, Email, and Message are required."}), 400

    conn = None
    try:
        conn = get_db_connection()
        conn.execute("""
            INSERT INTO inquiries (client_name, client_email, client_phone, package_selected, message)
            VALUES (?, ?, ?, ?, ?)
        """, (name, email, phone, package, message))
        conn.commit()
        return jsonify({"success": True, "message": "Inquiry saved in database! Sartaj will contact you soon."}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/inquiries', methods=['GET'])
def list_inquiries():
    if request.headers.get("X-Admin-Key") != ADMIN_KEY:
        return jsonify({"success": False, "error": "Unauthorized Admin Key"}), 401

    conn = None
    try:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 100").fetchall()
        return jsonify({"success": True, "inquiries": [dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.errorhandler(404)
def not_found(e):
    return send_from_directory('.', '404.html'), 404

if __name__ == '__main__':
    app.run(debug=False, port=5000)
