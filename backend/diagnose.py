from main import app
from database import engine, Base
import models

try:
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")
except Exception as e:
    print(f"Error creating tables: {e}")

from main import startup
try:
    print("Running startup...")
    startup()
    print("Startup complete.")
except Exception as e:
    print(f"Error during startup: {e}")
