from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric, Enum, ForeignKey, Boolean, BigInteger, Date, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

# Enums
class UserRole(enum.Enum):
    farmer = "farmer"
    guest = "guest" 
    admin = "admin"
    buyer = "buyer"

class FarmType(enum.Enum):
    organic = "organic"
    conventional = "conventional"
    hydroponic = "hydroponic"
    greenhouse = "greenhouse"

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    phone = Column(String(20))
    role = Column(Enum(UserRole), nullable=False, default=UserRole.farmer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    farms = relationship("Farm", back_populates="owner")

class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    owner_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    address = Column(Text)
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    total_area = Column(Numeric(10, 2))
    farm_type = Column(Enum(FarmType))
    is_organic = Column(Boolean, default=False)
    established_date = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="farms")
    zones = relationship("FarmZone", back_populates="farm")
    products = relationship("MarketplaceProduct", back_populates="farm")

class FarmZone(Base):
    __tablename__ = "farm_zones"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    farm_id = Column(BigInteger, ForeignKey("farms.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    area = Column(Numeric(10, 2))
    soil_type = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    farm = relationship("Farm", back_populates="zones")

class MarketplaceProduct(Base):
    __tablename__ = "marketplace_products"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    seller_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    farm_id = Column(BigInteger, ForeignKey("farms.id"))
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    quantity_available = Column(Integer, nullable=False)
    minimum_order = Column(Integer, default=1)
    unit = Column(String(20), nullable=False)
    category = Column(String(100), nullable=False)
    product_images = Column(JSON)
    harvest_date = Column(Date)
    expiry_date = Column(Date)
    organic_certified = Column(Boolean, default=False)
    rating_average = Column(Numeric(3, 2), default=0.0)
    total_reviews = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    seller = relationship("User")
    farm = relationship("Farm", back_populates="products")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    buyer_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    seller_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    payment_method = Column(String(50))
    payment_status = Column(String(50), default="pending")
    delivery_address = Column(Text)
    delivery_date = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    order_id = Column(BigInteger, ForeignKey("orders.id"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("marketplace_products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("MarketplaceProduct")
