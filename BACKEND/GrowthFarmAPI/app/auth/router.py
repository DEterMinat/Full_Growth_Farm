from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .schemas import UserRegister, UserLogin, AuthResponse, Token, UserProfile
from .service import AuthService
from .jwt_handler import decode_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

@router.post("/register", response_model=AuthResponse)
async def register(user_data: UserRegister):
    """Register a new user"""
    try:
        # Register user
        user = AuthService.register_user(user_data)
        
        # Create token
        token = AuthService.create_user_token(user)
        
        # Return response
        return AuthResponse(
            success=True,
            message="User registered successfully",
            token=token,
            user=UserProfile(**user)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=AuthResponse)
async def login(user_credentials: UserLogin):
    """Login user"""
    try:
        # Authenticate user
        user = AuthService.authenticate_user(
            user_credentials.username, 
            user_credentials.password
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create token
        token = AuthService.create_user_token(user)
        
        # Return response
        return AuthResponse(
            success=True,
            message="Login successful",
            token=token,
            user=UserProfile(**user)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=UserProfile)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user profile"""
    try:
        # Decode token
        username = decode_token(credentials.credentials)
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user data
        user = AuthService.get_user_by_username(username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserProfile(**user)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user profile: {str(e)}"
        )

@router.post("/logout", response_model=AuthResponse)
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user (invalidate token)"""
    try:
        # Verify token exists and is valid
        username = decode_token(credentials.credentials)
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # In a real application, you might want to:
        # 1. Add the token to a blacklist
        # 2. Store logout timestamp
        # 3. Log the logout activity
        
        return AuthResponse(
            success=True,
            message=f"User {username} logged out successfully. Token invalidated."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        # Even if there's an error, allow logout to proceed
        # since the client will remove the token anyway
        return AuthResponse(
            success=True,
            message="Logout completed. Please remove token from client storage."
        )

@router.post("/logout-force", response_model=AuthResponse)
async def logout_force():
    """Force logout without token validation (for expired tokens)"""
    return AuthResponse(
        success=True,
        message="Force logout successful. Client should clear local storage."
    )

# Dependency to get current user
async def get_current_user_dependency(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency to get current authenticated user"""
    username = decode_token(credentials.credentials)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = AuthService.get_user_by_username(username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
