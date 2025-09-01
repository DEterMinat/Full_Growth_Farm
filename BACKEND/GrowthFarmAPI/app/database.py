from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Database configuration from environment variables
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Database URL for SQLAlchemy
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set!")

# Traditional MySQL connector config (for legacy functions)
DB_CONFIG = {
    'host': DB_HOST,
    'port': DB_PORT,
    'user': DB_USER,
    'password': DB_PASSWORD,
    'database': DB_NAME,
    'ssl_disabled': True,
    'autocommit': True
}

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={
        "ssl_disabled": True,
    }
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Legacy MySQL connector functions (for compatibility)
def get_mysql_connection():
    """Create and return MySQL connection using mysql-connector-python"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("Successfully connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def test_connection():
    """Test MySQL connection using mysql-connector-python"""
    connection = None
    try:
        connection = get_mysql_connection()
        if connection and connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"MySQL Server version: {version[0]}")
            
            # Test basic query
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            print("Available databases:")
            for db in databases:
                print(f"  - {db[0]}")
            
            cursor.close()
            return True
    except Error as e:
        print(f"Error testing connection: {e}")
        return False
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("MySQL connection closed")

# Create all tables
def create_tables():
    """Create all database tables if they don't exist"""
    from .models import Base
    try:
        # Only create tables that don't exist
        Base.metadata.create_all(bind=engine, checkfirst=True)
        print("✅ Database tables checked/created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise

# Test database connection
def test_sqlalchemy_connection():
    """Test SQLAlchemy database connection"""
    try:
        db = SessionLocal()
        # Test query
        result = db.execute(text("SELECT 1"))
        print("✅ SQLAlchemy connection successful!")
        db.close()
        return True
    except Exception as e:
        print(f"❌ SQLAlchemy connection failed: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Testing SQLAlchemy connection...")
    if test_sqlalchemy_connection():
        print("📋 Creating tables with SQLAlchemy...")
        create_tables()
    else:
        print("❌ Failed to connect with SQLAlchemy")
