import apiClient from './apiClient';

// Interface สำหรับข้อมูลผู้ขายที่ส่งมาจาก Backend
export interface Seller {
  id: number;
  username: string;
  full_name: string;
}

// Interface สำหรับ Product ที่ตรงกับข้อมูลจาก Backend
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  unit: string;
  quantity: number; // แก้ไขจาก quantity_available
  imageUrl: string | null;
  status: 'available' | 'out_of_stock' | 'discontinued';
  sellerId: number;
  createdAt: string;
  updatedAt: string;
  seller: Seller; // เพิ่มข้อมูลผู้ขาย
}

// Interface สำหรับ Response ทั้งหมดจาก API
export interface MarketplaceResponse {
  success: boolean;
  products: Product[];
}

class MarketplaceService {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      // [แก้ไข] เปลี่ยน Endpoint ให้ถูกต้อง และคาดหวัง Response แบบใหม่
      const response = await apiClient<MarketplaceResponse>('/marketplace/products');
      return response.products || []; // คืนค่า array ของ products
    } catch (error) {
      console.error('Error fetching all products:', error);
      return []; // ถ้า error ให้คืนค่าเป็น array ว่าง
    }
  }
}

export const marketplaceService = new MarketplaceService();