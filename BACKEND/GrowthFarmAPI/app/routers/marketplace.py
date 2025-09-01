from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas
from ..database import get_db
from ..auth.dependencies import get_current_user

router = APIRouter(
    prefix="/api/marketplace",
    tags=["marketplace"]
)

@router.get("/", response_model=List[schemas.MarketplaceProduct])
async def get_marketplace_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    organic_only: Optional[bool] = Query(False),
    db: Session = Depends(get_db)
):
    """Get all marketplace products with optional filters"""
    try:
        query = db.query(models.MarketplaceProduct).filter(
            models.MarketplaceProduct.is_active == True
        )
        
        if category:
            query = query.filter(models.MarketplaceProduct.category == category)
        
        if search:
            query = query.filter(
                models.MarketplaceProduct.name.ilike(f"%{search}%") |
                models.MarketplaceProduct.description.ilike(f"%{search}%")
            )
        
        if min_price is not None:
            query = query.filter(models.MarketplaceProduct.price >= min_price)
        
        if max_price is not None:
            query = query.filter(models.MarketplaceProduct.price <= max_price)
        
        if organic_only:
            query = query.filter(models.MarketplaceProduct.organic_certified == True)
        
        products = query.all()
        
        # Add seller information
        for product in products:
            seller = db.query(models.User).filter(
                models.User.id == product.seller_id
            ).first()
            if seller:
                product.seller_name = seller.full_name or seller.username
                product.contact_info = seller.phone_number or seller.email
        
        return products
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching marketplace products: {str(e)}"
        )

@router.get("/my-products", response_model=List[schemas.MarketplaceProduct])
async def get_my_products(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get current user's marketplace products"""
    try:
        products = db.query(models.MarketplaceProduct).filter(
            models.MarketplaceProduct.seller_id == current_user.id
        ).all()
        
        return products
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching my products: {str(e)}"
        )

@router.post("/", response_model=schemas.MarketplaceProduct)
async def create_product(
    product: schemas.MarketplaceProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new marketplace product"""
    try:
        # Validate farm ownership if farm_id is provided
        if product.farm_id:
            farm = db.query(models.Farm).filter(
                models.Farm.id == product.farm_id,
                models.Farm.user_id == current_user.id,
                models.Farm.is_active == True
            ).first()
            
            if not farm:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Farm not found or not owned by user"
                )
        
        db_product = models.MarketplaceProduct(
            **product.dict(),
            seller_id=current_user.id,
            is_active=True,
            rating_average=0.0,
            total_reviews=0
        )
        
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        
        return db_product
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating product: {str(e)}"
        )

@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Delete (soft delete) a marketplace product"""
    try:
        db_product = db.query(models.MarketplaceProduct).filter(
            models.MarketplaceProduct.id == product_id,
            models.MarketplaceProduct.seller_id == current_user.id
        ).first()
        
        if not db_product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found or not owned by user"
            )
        
        # Soft delete
        db_product.is_active = False
        db.commit()
        
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting product: {str(e)}"
        )
