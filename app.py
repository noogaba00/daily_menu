import os
import random
import sqlite3
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

DB_PATH = os.environ.get("DB_PATH", "/data/menu.db")


def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS restaurants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT DEFAULT '',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/restaurants", methods=["GET"])
def list_restaurants():
    conn = get_db()
    rows = conn.execute(
        "SELECT id, name, category FROM restaurants ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/restaurants", methods=["POST"])
def add_restaurant():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    category = (data.get("category") or "").strip()

    if not name:
        return jsonify({"error": "식당 이름을 입력해주세요."}), 400

    conn = get_db()
    conn.execute(
        "INSERT INTO restaurants (name, category) VALUES (?, ?)",
        (name, category),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "추가되었습니다."}), 201


@app.route("/api/restaurants/<int:restaurant_id>", methods=["DELETE"])
def delete_restaurant(restaurant_id):
    conn = get_db()
    conn.execute("DELETE FROM restaurants WHERE id = ?", (restaurant_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "삭제되었습니다."})


@app.route("/api/random", methods=["GET"])
def random_menu():
    conn = get_db()
    rows = conn.execute("SELECT id, name, category FROM restaurants").fetchall()
    conn.close()

    if not rows:
        return jsonify({"error": "등록된 식당이 없습니다. 먼저 식당을 추가해주세요."}), 400

    pick = random.choice(rows)
    return jsonify(dict(pick))


init_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
