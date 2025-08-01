# backend/db_settings.py
from sqlalchemy import create_engine
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.orm import sessionmaker
from .models import Base
from sqlalchemy.sql import text
import os

# Get database URL from environment variable, with a default fallback
DATABASE_URL = "postgresql://user:password@localhost:5433/detection_db"

# Create an engine for the PostgreSQL server
engine = create_engine(DATABASE_URL)

# Create a session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_database():
    """Create the database if it doesn't exist."""
    # Connect to default 'postgres' database to create a new database
    default_engine = create_engine("postgresql://user:password@localhost:5433/postgres")  # Changed from db:5432 to localhost:5433
    
    # Use a connection context that auto-commits
    with default_engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        try:
            # Try to create the database
            conn.execute(text(f"CREATE DATABASE detection_db"))
            print(f"Database 'detection_db' created successfully!")
        except ProgrammingError as e:
            if "already exists" in str(e):
                print(f"Database 'detection_db' already exists.")
            else:
                raise
        finally:
            default_engine.dispose()

def init_db():
    """Initialize the database and create tables."""
    create_database()  # Ensure the database exists
    Base.metadata.create_all(bind=engine)  # Create all tables