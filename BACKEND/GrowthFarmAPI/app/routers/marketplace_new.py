from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import MarketplaceProduct, User, Farm, Planting, Order, OrderItem
from ..schemas import MarketplaceProductCreate, MarketplaceProductResponse, OrderCreate, OrderResponse
from ..auth.service import get_current_user

router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])

# Marketplace Product Endpoints
@router.get("/", response_model=List[MarketplaceProductResponse])
async def get_marketplace_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    organic_only: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get marketplace products with optional filters"""
    query = db.query(MarketplaceProduct).filter(MarketplaceProduct.is_available == True)
    
    if category:
        query = query.filter(MarketplaceProduct.category == category)
    
    if min_price:
        query = query.filter(MarketplaceProduct.price >= min_price)
    
    if max_price:
        query = query.filter(MarketplaceProduct.price <= max_price)
    
    if organic_only:
        query = query.filter(MarketplaceProduct.organic_certified == True)
    
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=MarketplaceProductResponse)
async def get_marketplace_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Get specific marketplace product by ID"""
    product = db.query(MarketplaceProduct).filter(
        MarketplaceProduct.id == product_id,
        MarketplaceProduct.is_available == True
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product

@router.post("/", response_model=MarketplaceProductResponse)
async def create_marketplace_product(
    product: MarketplaceProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new marketplace product (farmers only)"""
    if current_user.role.value not in ["farmer", "admin"]:
        raise HTTPException(status_code=403, detail="Only farmers can create products")
    
    # Verify farm ownership if farm_id provided
    if product.farm_id:
        farm = db.query(Farm).filter(
            Farm.id == product.farm_id,
            Farm.user_id == current_user.id
        ).first()
        if not farm:
            raise HTTPException(status_code=404, detail="Farm not found or not owned by user")
    
    # Verify planting ownership if planting_id provided
    if product.planting_id:
        planting = db.query(Planting).join(FarmZone).join(Farm).filter(
            Planting.id == product.planting_id,
            Farm.user_id == current_user.id
        ).first()
        if not planting:
            raise HTTPException(status_code=404, detail="Planting not found or not owned by user")
    
    db_product = MarketplaceProduct(
        seller_id=current_user.id,
        farm_id=product.farm_id,
        planting_id=product.planting_id,
        name=product.name,
        description=product.description,
        price=product.price,
        quantity_available=product.quantity_available,
        minimum_order=product.minimum_order,
        unit=product.unit,
        category=product.category,
        product_images=product.product_images,
        harvest_date=product.harvest_date,
        expiry_date=product.expiry_date,
        organic_certified=product.organic_certified
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

@router.put("/{product_id}", response_model=MarketplaceProductResponse)
async def update_marketplace_product(
    product_id: int,
    product_data: MarketplaceProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update marketplace product"""
    product = db.query(MarketplaceProduct).filter(MarketplaceProduct.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check permission
    if current_user.role.value != "admin" and product.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this product")
    
    for field, value in product_data.dict(exclude_unset=True).items():
        setattr(product, field, value)
    
    product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(product)
    
    return product

@router.delete("/{product_id}")
async def delete_marketplace_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete/deactivate marketplace product"""
    product = db.query(MarketplaceProduct).filter(MarketplaceProduct.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check permission
    if current_user.role.value != "admin" and product.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this product")
    
    # Soft delete - just mark as unavailable
    product.is_available = False
    product.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Product removed from marketplace"}

@router.get("/my-products", response_model=List[MarketplaceProductResponse])
async def get_my_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's marketplace products"""
    if current_user.role.value not in ["farmer", "admin"]:
        raise HTTPException(status_code=403, detail="Only farmers can view their products")
    
    products = db.query(MarketplaceProduct).filter(
        MarketplaceProduct.seller_id == current_user.id
    ).all()
    
    return products

@router.get("/categories")
async def get_product_categories(db: Session = Depends(get_db)):
    """Get all available product categories"""
    categories = db.query(MarketplaceProduct.category).distinct().all()
    return [cat[0] for cat in categories if cat[0]]

# Order Endpoints
@router.post("/orders", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new order"""
    if current_user.role.value not in ["buyer", "farmer", "admin"]:
        raise HTTPException(status_code=403, detail="Cannot create orders")
    
    # Calculate total amount
    total_amount = 0
    order_items_data = []
    
    for item in order_data.items:
        product = db.query(MarketplaceProduct).filter(
            MarketplaceProduct.id == item.product_id,
            MarketplaceProduct.is_available == True
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if item.quantity < product.minimum_order:
            raise HTTPException(status_code=400, detail=f"Minimum order for {product.name} is {product.minimum_order}")
        
        if item.quantity > product.quantity_available:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")
        
        item_total = product.price * item.quantity
        total_amount += item_total
        
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "unit_price": product.price,
            "total_price": item_total
        })
    
    # Create order
    import random
    import string
    order_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    
    # Get seller from first product (assuming all products from same seller for simplicity)
    seller_id = order_items_data[0]["product"].seller_id
    
    db_order = Order(
        buyer_id=current_user.id,
        seller_id=seller_id,
        order_number=order_number,
        total_amount=total_amount,
        shipping_cost=order_data.shipping_cost,
        status="pending",
        payment_status="pending",
        payment_method=order_data.payment_method,
        shipping_address=order_data.shipping_address,
        notes=order_data.notes
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item_data in order_items_data:
        db_order_item = OrderItem(
            order_id=db_order.id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"],
            product_snapshot={
                "name": item_data["product"].name,
                "description": item_data["product"].description,
                "category": item_data["product"].category
            }
        )
        db.add(db_order_item)
        
        # Update product quantity
        item_data["product"].quantity_available -= item_data["quantity"]
    
    db.commit()
    
    return db_order

@router.get("/orders", response_model=List[OrderResponse])
async def get_user_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's orders (as buyer or seller)"""
    # Get orders where user is buyer or seller
    orders = db.query(Order).filter(
        (Order.buyer_id == current_user.id) | (Order.seller_id == current_user.id)
    ).order_by(Order.created_at.desc()).all()
    
    return orders

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific order details"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check permission
    if (current_user.role.value != "admin" and 
        order.buyer_id != current_user.id and 
        order.seller_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    return order

@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update order status (sellers and admins only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check permission - only seller or admin can update status
    if (current_user.role.value != "admin" and order.seller_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this order")
    
    valid_statuses = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'completed', 'cancelled', 'refunded']
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    order.status = status
    order.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Order status updated to {status}"}
