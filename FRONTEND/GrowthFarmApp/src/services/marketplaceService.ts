import apiClient from './apiClient';
import { mockProducts, getProductsByCategory, searchProducts, getProductById, getAvailableProducts } from '../data/mockMarketplaceData';

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
  // Toggle between mock data and real API (set to true to use mock data)
  private useMockData = true;

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    if (this.useMockData) {
      // Simulate API delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockProducts;
    }

    try {
      // [แก้ไข] เปลี่ยน Endpoint ให้ถูกต้อง และคาดหวัง Response แบบใหม่
      const response = await apiClient<MarketplaceResponse>('/marketplace/products');
      return response.products || []; // คืนค่า array ของ products
    } catch (error) {
      console.error('Error fetching all products:', error);
      return []; // ถ้า error ให้คืนค่าเป็น array ว่าง
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return getProductsByCategory(category);
    }

    try {
      const response = await apiClient<MarketplaceResponse>(`/marketplace/products?category=${category}`);
      return response.products || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return searchProducts(query);
    }

    try {
      const response = await apiClient<MarketplaceResponse>(`/marketplace/products/search?q=${encodeURIComponent(query)}`);
      return response.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Get product by ID
  async getProductById(id: number): Promise<Product | null> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getProductById(id) || null;
    }

    try {
      const response = await apiClient<{success: boolean; product: Product}>(`/marketplace/products/${id}`);
      return response.product || null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  // Get only available products
  async getAvailableProducts(): Promise<Product[]> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getAvailableProducts();
    }

    try {
      const response = await apiClient<MarketplaceResponse>('/marketplace/products?status=available');
      return response.products || [];
    } catch (error) {
      console.error('Error fetching available products:', error);
      return [];
    }
  }

  // Toggle method for switching between mock and real API (for development)
  toggleMockData(useMock: boolean = true): void {
    this.useMockData = useMock;
  }

  // Get current mock data status
  isMockDataEnabled(): boolean {
    return this.useMockData;
  }
}

export const marketplaceService = new MarketplaceService();