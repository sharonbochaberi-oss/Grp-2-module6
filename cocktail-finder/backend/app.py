import os
from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, migrate, bcrypt

from routes.cocktails import cocktail_bp
from routes.notes import note_bp
from routes.favorites import favorite_bp
from routes.auth import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

allowed_origin = os.environ.get("ALLOWED_ORIGIN", "*")
CORS(app, resources={r"/api/*": {"origins": allowed_origin, "allow_headers": ["Content-Type", "Authorization"]}})

db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)

app.register_blueprint(cocktail_bp)
app.register_blueprint(note_bp)
app.register_blueprint(favorite_bp)
app.register_blueprint(auth_bp)

with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return {
        "message": "Cocktail Finder API is running."
    }


if __name__ == "__main__":
    app.run(port=4000, debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true")