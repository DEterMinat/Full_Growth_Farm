import apiClient from './apiClient';

export interface Crop {
  id?: number;
  name: string;
  variety?: string;
  plantingDate: string;
  expectedHarvestDate: string;
  area: number;
  areaUnit: string;
  stage: string;
  status: 'healthy' | 'monitor' | 'critical';
  farmId: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CropStats {
  totalCrops: number;
  healthyCrops: number;
  monitorCrops: number;
  criticalCrops: number;
  totalArea: number;
}

export interface CreateCropRequest {
  name: string;
  variety?: string;
  plantingDate: string;
  expectedHarvestDate: string;
  area: number;
  areaUnit: string;
  stage: string;
  status: 'healthy' | 'monitor' | 'critical';
  farmId: number;
  notes?: string;
}

export interface UpdateCropRequest extends Partial<CreateCropRequest> {
  id: number;
}

export const cropsService = {
  // Get all crops for a farm
  getCropsByFarm: async (farmId: number): Promise<Crop[]> => {
    try {
      return await apiClient<Crop[]>(`/api/crops/farm/${farmId}`);
    } catch (error) {
      console.error('Error fetching crops by farm:', error);
      throw error;
    }
  },

  // Get all crops for current user
  getAllCrops: async (): Promise<Crop[]> => {
    try {
      return await apiClient<Crop[]>('/api/crops');
    } catch (error) {
      console.error('Error fetching all crops:', error);
      throw error;
    }
  },

  // Get single crop by ID
  getCropById: async (id: number): Promise<Crop> => {
    try {
      return await apiClient<Crop>(`/api/crops/${id}`);
    } catch (error) {
      console.error('Error fetching crop by ID:', error);
      throw error;
    }
  },

  // Create new crop
  createCrop: async (cropData: CreateCropRequest): Promise<Crop> => {
    try {
      return await apiClient<Crop>('/api/crops', {
        method: 'POST',
        body: JSON.stringify(cropData),
      });
    } catch (error) {
      console.error('Error creating crop:', error);
      throw error;
    }
  },

  // Update existing crop
  updateCrop: async (id: number, cropData: Partial<CreateCropRequest>): Promise<Crop> => {
    try {
      return await apiClient<Crop>(`/api/crops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cropData),
      });
    } catch (error) {
      console.error('Error updating crop:', error);
      throw error;
    }
  },

  // Delete crop
  deleteCrop: async (id: number): Promise<{ message: string }> => {
    try {
      return await apiClient<{ message: string }>(`/api/crops/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting crop:', error);
      throw error;
    }
  },

  // Get crop statistics
  getCropStats: async (farmId?: number): Promise<CropStats> => {
    try {
      const endpoint = farmId ? `/api/crops/stats/farm/${farmId}` : '/api/crops/stats';
      return await apiClient<CropStats>(endpoint);
    } catch (error) {
      console.error('Error fetching crop stats:', error);
      throw error;
    }
  },

  // Update crop status
  updateCropStatus: async (id: number, status: 'healthy' | 'monitor' | 'critical'): Promise<Crop> => {
    try {
      return await apiClient<Crop>(`/api/crops/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating crop status:', error);
      throw error;
    }
  },

  // Update crop stage
  updateCropStage: async (id: number, stage: string): Promise<Crop> => {
    try {
      return await apiClient<Crop>(`/api/crops/${id}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage }),
      });
    } catch (error) {
      console.error('Error updating crop stage:', error);
      throw error;
    }
  },
};

export default cropsService;