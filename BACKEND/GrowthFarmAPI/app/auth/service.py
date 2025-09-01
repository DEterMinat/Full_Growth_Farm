from fastapi import HTTPException, status
from typing import Optional
from ..database import get_mysql_connection
from .jwt_handler import verify_password, get_password_hash, create_access_token
from .schemas import UserRegister, UserLogin, UserProfile
from datetime import datetime, timedelta

class AuthService:
    
    @staticmethod
    def authenticate_user(username: str, password: str) -> Optional[dict]:
        """Authenticate user with username and password"""
        connection = None
        try:
            connection = get_mysql_connection()
            if not connection:
                return None
                
            cursor = connection.cursor()
            cursor.execute("""
                SELECT id, username, email, password_hash, full_name, phone, role, created_at, updated_at
                FROM users WHERE username = %s OR email = %s
            """, (username, username))
            
            user = cursor.fetchone()
            cursor.close()
            
            if not user:
                return None
                
            # Verify password
            if not verify_password(password, user[3]):
                return None
                
            return {
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "full_name": user[4],
                "phone": user[5],
                "role": user[6],
                "created_at": user[7],
                "updated_at": user[8]
            }
            
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
        finally:
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def register_user(user_data: UserRegister) -> dict:
        """Register a new user"""
        connection = None
        try:
            connection = get_mysql_connection()
            if not connection:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database connection failed"
                )
                
            cursor = connection.cursor()
            
            # Check if username or email already exists
            cursor.execute(
                "SELECT id FROM users WHERE username = %s OR email = %s", 
                (user_data.username, user_data.email)
            )
            
            if cursor.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username or email already exists"
                )
            
            # Hash password
            hashed_password = get_password_hash(user_data.password)
            
            # Insert new user
            cursor.execute("""
                INSERT INTO users (username, email, password_hash, full_name, phone, role)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                user_data.username, 
                user_data.email, 
                hashed_password, 
                user_data.full_name, 
                user_data.phone, 
                user_data.role
            ))
            
            user_id = cursor.lastrowid
            cursor.close()
            connection.commit()
            
            return {
                "id": user_id,
                "username": user_data.username,
                "email": user_data.email,
                "full_name": user_data.full_name,
                "phone": user_data.phone,
                "role": user_data.role,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            
        except HTTPException:
            if connection:
                connection.rollback()
            raise
        except Exception as e:
            if connection:
                connection.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user: {str(e)}"
            )
        finally:
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def get_user_by_username(username: str) -> Optional[dict]:
        """Get user by username"""
        connection = None
        try:
            connection = get_mysql_connection()
            if not connection:
                return None
                
            cursor = connection.cursor()
            cursor.execute("""
                SELECT id, username, email, full_name, phone, role, created_at, updated_at
                FROM users WHERE username = %s
            """, (username,))
            
            user = cursor.fetchone()
            cursor.close()
            
            if not user:
                return None
                
            return {
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "full_name": user[3],
                "phone": user[4],
                "role": user[5],
                "created_at": user[6],
                "updated_at": user[7]
            }
            
        except Exception as e:
            print(f"Get user error: {e}")
            return None
        finally:
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def create_user_token(user_data: dict) -> str:
        """Create access token for user"""
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user_data["username"], "user_id": user_data["id"]}, 
            expires_delta=access_token_expires
        )
        return access_token
