import apiClient from './apiClient';

// --- Interfaces ทั้งหมดเหมือนเดิม ไม่มีการเปลี่ยนแปลง ---
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

interface CropsListResponse {
  success: boolean;
  data: Crop[];
}

interface CropResponse {
    success: boolean;
    message: string;
    data: Crop;
}

// 🔽 --- แก้ไขวิธีการเรียกใช้ apiClient ทั้งหมดที่นี่ --- 🔽
export const cropsService = {
  // Get all crops
  getAllCrops: async (): Promise<Crop[]> => {
    try {
      const response = await apiClient<CropsListResponse>('/api/crops'); // GET ไม่ต้องมี options
      if (response.success) {
        return response.data;
      } else {
        throw new Error('Failed to fetch crops');
      }
    } catch (error) {
      console.error('Error fetching all crops:', error);
      throw new Error('Failed to fetch crops');
    }
  },

  // Get all crops for a farm
  getCropsByFarm: async (farmId: number): Promise<Crop[]> => {
    try {
        const response = await apiClient<CropsListResponse>(`/api/crops/farm/${farmId}`);
        if (response.success) {
          return response.data;
        } else {
          throw new Error('Failed to fetch crops by farm');
        }
    } catch (error) {
      console.error('Error fetching crops by farm:', error);
      throw new Error('Failed to fetch crops by farm');
    }
  },

  // Create new crop
  createCrop: async (newCrop: CreateCropRequest): Promise<Crop> => {
    try {
      const response = await apiClient<CropResponse>('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCrop),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating crop:', error);
      throw error;
    }
  },

  // Update existing crop
  updateCrop: async (id: number, updatedCrop: UpdateCropRequest): Promise<Crop> => {
    try {
      const response = await apiClient<CropResponse>(`/api/crops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCrop),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating crop:', error);
      throw error;
    }
  },

  // Delete crop
  deleteCrop: async (id: number): Promise<void> => {
    try {
      await apiClient(`/api/crops/${id}`, {
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
      const response = await apiClient<CropResponse>(`/api/crops/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating crop status:', error);
      throw error;
    }
  },

  // Update crop stage
  updateCropStage: async (id: number, stage: string): Promise<Crop> => {
    try {
        const response = await apiClient<CropResponse>(`/api/crops/${id}/stage`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage }),
        });
        return response.data;
    } catch (error) {
      console.error('Error updating crop stage:', error);
      throw error;
    }
  },
};