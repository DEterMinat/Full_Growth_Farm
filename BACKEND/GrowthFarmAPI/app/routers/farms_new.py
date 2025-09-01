from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from ..database import get_db
from ..models import Farm, FarmZone, Crop, Planting, User, IoTDevice, SensorData
from ..schemas import FarmCreate, FarmResponse, FarmZoneCreate, FarmZoneResponse, PlantingCreate, PlantingResponse
from ..auth.service import get_current_user

router = APIRouter(prefix="/api/farms", tags=["farms"])

# Farm Endpoints
@router.get("/", response_model=List[FarmResponse])
async def get_farms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all farms (admin) or user's farms (farmer/buyer)"""
    if current_user.role.value == "admin":
        farms = db.query(Farm).offset(skip).limit(limit).all()
    else:
        farms = db.query(Farm).filter(Farm.user_id == current_user.id).offset(skip).limit(limit).all()
    
    return farms

@router.get("/{farm_id}", response_model=FarmResponse)
async def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific farm by ID"""
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check permission
    if current_user.role.value != "admin" and farm.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this farm")
    
    return farm

@router.post("/", response_model=FarmResponse)
async def create_farm(
    farm: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new farm"""
    db_farm = Farm(
        user_id=current_user.id,
        name=farm.name,
        description=farm.description,
        address=farm.address,
        latitude=farm.latitude,
        longitude=farm.longitude,
        total_area=farm.total_area,
        farm_type=farm.farm_type,
        established_date=farm.established_date
    )
    
    db.add(db_farm)
    db.commit()
    db.refresh(db_farm)
    
    return db_farm

@router.put("/{farm_id}", response_model=FarmResponse)
async def update_farm(
    farm_id: int,
    farm_data: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update farm"""
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check permission
    if current_user.role.value != "admin" and farm.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this farm")
    
    for field, value in farm_data.dict(exclude_unset=True).items():
        setattr(farm, field, value)
    
    farm.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(farm)
    
    return farm

@router.delete("/{farm_id}")
async def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete farm"""
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check permission
    if current_user.role.value != "admin" and farm.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this farm")
    
    db.delete(farm)
    db.commit()
    
    return {"message": "Farm deleted successfully"}

# Farm Zones Endpoints
@router.get("/{farm_id}/zones", response_model=List[FarmZoneResponse])
async def get_farm_zones(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all zones in a farm"""
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check permission
    if current_user.role.value != "admin" and farm.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this farm")
    
    zones = db.query(FarmZone).filter(FarmZone.farm_id == farm_id).all()
    return zones

@router.post("/{farm_id}/zones", response_model=FarmZoneResponse)
async def create_farm_zone(
    farm_id: int,
    zone: FarmZoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new zone in farm"""
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check permission
    if current_user.role.value != "admin" and farm.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this farm")
    
    db_zone = FarmZone(
        farm_id=farm_id,
        zone_name=zone.zone_name,
        zone_code=zone.zone_code,
        area_size=zone.area_size,
        soil_type=zone.soil_type,
        irrigation_type=zone.irrigation_type
    )
    
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    
    return db_zone

# Dashboard Data
@router.get("/{farm_id}/dashboard")
async def get_farm_dashboard(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get farm dashboard data"""
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Check permission
    if current_user.role.value != "admin" and farm.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this farm")
    
    # Get counts
    zones_count = db.query(FarmZone).filter(FarmZone.farm_id == farm_id).count()
    active_plantings = db.query(Planting).join(FarmZone).filter(
        FarmZone.farm_id == farm_id, 
        Planting.status.in_(['planted', 'growing'])
    ).count()
    devices_count = db.query(IoTDevice).join(FarmZone).filter(FarmZone.farm_id == farm_id).count()
    online_devices = db.query(IoTDevice).join(FarmZone).filter(
        FarmZone.farm_id == farm_id,
        IoTDevice.status == 'online'
    ).count()
    
    return {
        "farm_info": {
            "id": farm.id,
            "name": farm.name,
            "total_area": float(farm.total_area) if farm.total_area else 0,
            "farm_type": farm.farm_type.value if farm.farm_type else None,
            "address": farm.address,
            "description": farm.description
        },
        "stats": {
            "zones_count": zones_count,
            "active_plantings": active_plantings,
            "devices_count": devices_count,
            "online_devices": online_devices
        },
        "recent_activity": f"Farm has {zones_count} zones and {active_plantings} active plantings"
    }
