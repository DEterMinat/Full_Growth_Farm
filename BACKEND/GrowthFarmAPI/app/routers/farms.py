from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas
from ..database import get_db
from ..auth.dependencies import get_current_user

router = APIRouter(
    prefix="/api/farms",
    tags=["farms"]
)

@router.get("/", response_model=List[schemas.Farm])
async def get_farms(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all farms for current user"""
    try:
        farms = db.query(models.Farm).filter(
            models.Farm.user_id == current_user.id,
            models.Farm.is_active == True
        ).all()
        return farms
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching farms: {str(e)}"
        )

@router.get("/{farm_id}", response_model=schemas.Farm)
async def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get specific farm by ID"""
    try:
        farm = db.query(models.Farm).filter(
            models.Farm.id == farm_id,
            models.Farm.user_id == current_user.id,
            models.Farm.is_active == True
        ).first()
        
        if not farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        return farm
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching farm: {str(e)}"
        )

@router.post("/", response_model=schemas.Farm)
async def create_farm(
    farm: schemas.FarmCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new farm"""
    try:
        # Check if user already has a farm with this name
        existing_farm = db.query(models.Farm).filter(
            models.Farm.user_id == current_user.id,
            models.Farm.name == farm.name,
            models.Farm.is_active == True
        ).first()
        
        if existing_farm:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Farm with this name already exists"
            )
        
        db_farm = models.Farm(
            **farm.dict(),
            user_id=current_user.id,
            is_active=True
        )
        
        db.add(db_farm)
        db.commit()
        db.refresh(db_farm)
        
        return db_farm
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating farm: {str(e)}"
        )

@router.put("/{farm_id}", response_model=schemas.Farm)
async def update_farm(
    farm_id: int,
    farm_update: schemas.FarmUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Update a farm"""
    try:
        db_farm = db.query(models.Farm).filter(
            models.Farm.id == farm_id,
            models.Farm.user_id == current_user.id,
            models.Farm.is_active == True
        ).first()
        
        if not db_farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        # Update only provided fields
        update_data = farm_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_farm, field, value)
        
        db.commit()
        db.refresh(db_farm)
        
        return db_farm
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating farm: {str(e)}"
        )

@router.delete("/{farm_id}")
async def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Delete (soft delete) a farm"""
    try:
        db_farm = db.query(models.Farm).filter(
            models.Farm.id == farm_id,
            models.Farm.user_id == current_user.id,
            models.Farm.is_active == True
        ).first()
        
        if not db_farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        # Soft delete
        db_farm.is_active = False
        db.commit()
        
        return {"message": "Farm deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting farm: {str(e)}"
        )

@router.get("/{farm_id}/zones", response_model=List[schemas.Zone])
async def get_farm_zones(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all zones for a farm"""
    try:
        # Verify farm ownership
        farm = db.query(models.Farm).filter(
            models.Farm.id == farm_id,
            models.Farm.user_id == current_user.id,
            models.Farm.is_active == True
        ).first()
        
        if not farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        zones = db.query(models.Zone).filter(
            models.Zone.farm_id == farm_id,
            models.Zone.is_active == True
        ).all()
        
        return zones
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching zones: {str(e)}"
        )

@router.post("/{farm_id}/zones", response_model=schemas.Zone)
async def create_zone(
    farm_id: int,
    zone: schemas.ZoneCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new zone in farm"""
    try:
        # Verify farm ownership
        farm = db.query(models.Farm).filter(
            models.Farm.id == farm_id,
            models.Farm.user_id == current_user.id,
            models.Farm.is_active == True
        ).first()
        
        if not farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        # Check for duplicate zone name in farm
        existing_zone = db.query(models.Zone).filter(
            models.Zone.farm_id == farm_id,
            models.Zone.name == zone.name,
            models.Zone.is_active == True
        ).first()
        
        if existing_zone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Zone with this name already exists in this farm"
            )
        
        db_zone = models.Zone(
            **zone.dict(),
            farm_id=farm_id,
            is_active=True
        )
        
        db.add(db_zone)
        db.commit()
        db.refresh(db_zone)
        
        return db_zone
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating zone: {str(e)}"
        )

@router.get("/{farm_id}/dashboard", response_model=schemas.FarmDashboard)
async def get_farm_dashboard(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get dashboard data for a farm"""
    try:
        # Verify farm ownership
        farm = db.query(models.Farm).filter(
            models.Farm.id == farm_id,
            models.Farm.user_id == current_user.id,
            models.Farm.is_active == True
        ).first()
        
        if not farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found"
            )
        
        # Get zone count
        zones_count = db.query(models.Zone).filter(
            models.Zone.farm_id == farm_id,
            models.Zone.is_active == True
        ).count()
        
        # Get active plantings count
        active_plantings = db.query(models.Planting).filter(
            models.Planting.zone_id.in_(
                db.query(models.Zone.id).filter(
                    models.Zone.farm_id == farm_id,
                    models.Zone.is_active == True
                )
            ),
            models.Planting.status.in_(['planted', 'growing'])
        ).count()
        
        # Get device counts (mock data for now)
        devices_count = 5
        online_devices = 4
        
        dashboard_data = schemas.FarmDashboard(
            farm_info=schemas.FarmDashboardInfo(
                id=farm.id,
                name=farm.name,
                total_area=farm.total_area or 0,
                farm_type=farm.farm_type,
                address=farm.address,
                description=farm.description
            ),
            stats=schemas.FarmStats(
                zones_count=zones_count,
                active_plantings=active_plantings,
                devices_count=devices_count,
                online_devices=online_devices
            ),
            recent_activity="Farm data updated successfully. All systems operational."
        )
        
        return dashboard_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching dashboard data: {str(e)}"
        )
