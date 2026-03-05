import psycopg2
import psycopg2.extras
import os

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    return conn