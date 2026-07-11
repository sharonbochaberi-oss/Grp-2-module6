import os

_database_url = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost/cocktailfinder"
)
# Some hosts (e.g. Heroku-style providers) still hand out postgres:// URLs,
# which SQLAlchemy/psycopg2 no longer accept.
if _database_url.startswith("postgres://"):
    _database_url = _database_url.replace("postgres://", "postgresql://", 1)


class Config:
    SQLALCHEMY_DATABASE_URI = _database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False