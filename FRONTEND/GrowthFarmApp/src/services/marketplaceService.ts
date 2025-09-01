import apiClient from './apiClient';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  unit: string;
  quantity_available: number;
  location?: string;
  contact_info?: string;
  seller_name?: string;
  seller_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  unit: string;
  quantity_available: number;
  location?: string | null;
  contact_info?: string | null;
}

export interface MarketplaceResponse {
  success: boolean;
  message: string;
  products: Product[];
}

class MarketplaceService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await apiClient(endpoint, options);
      return response;
    } catch (error) {
      console.error(`MarketplaceService error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all products (with optional example data for guest users)
  async getAllProducts(includeExamples: boolean = false): Promise<Product[]> {
    try {
      const response = await this.makeRequest<MarketplaceResponse>('/api/marketplace/', {
        method: 'GET',
      });
      
      let products = response.products || [];
      
      // Add example products for guest users or when no products exist
      if (includeExamples || products.length === 0) {
        const exampleProducts: Product[] = [
          {
            id: 999999,
            name: 'Organic Tomatoes',
            description: 'Fresh organic tomatoes from our greenhouse. Perfect for cooking and salads.',
            price: 45,
            category: 'Vegetables',
            unit: 'kg',
            quantity_available: 50,
            location: 'Chiang Mai',
            contact_info: 'Call 081-234-5678',
            seller_name: 'Green Farm Co.',
            seller_id: 9999,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 999998,
            name: 'Premium Rice Seeds',
            description: 'High-quality jasmine rice seeds with 95% germination rate.',
            price: 120,
            category: 'Seeds',
            unit: 'kg',
            quantity_available: 25,
            location: 'Bangkok',
            contact_info: 'Line: @seedstore',
            seller_name: 'Thai Seeds Ltd.',
            seller_id: 9998,
            is_active: true,
            created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            updated_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 999997,
            name: 'Organic Fertilizer',
            description: 'Natural compost fertilizer made from organic materials. Improves soil quality.',
            price: 25,
            category: 'Fertilizer',
            unit: 'bag',
            quantity_available: 100,
            location: 'Nakhon Ratchasima',
            contact_info: '044-123-456',
            seller_name: 'Eco Farm Supply',
            seller_id: 9997,
            is_active: true,
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updated_at: new Date(Date.now() - 172800000).toISOString(),
          }
        ];
        
        products = [...exampleProducts, ...products];
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      // Return example products on error
      return [
        {
          id: 999999,
          name: 'Organic Tomatoes',
          description: 'Fresh organic tomatoes from our greenhouse.',
          price: 45,
          category: 'Vegetables',
          unit: 'kg',
          quantity_available: 50,
          location: 'Chiang Mai',
          contact_info: 'Call 081-234-5678',
          seller_name: 'Green Farm Co.',
          seller_id: 9999,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
    }
  }

  // Get user's own products
  async getMyProducts(): Promise<MarketplaceResponse> {
    try {
      return await this.makeRequest<MarketplaceResponse>('/api/marketplace/my-products', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error fetching my products:', error);
      return {
        success: false,
        message: 'Failed to fetch products',
        products: []
      };
    }
  }

  // Get user's own products as a list
  async getMyProductsAsList(): Promise<Product[]> {
    try {
      const response = await this.getMyProducts();
      return response.products || [];
    } catch (error) {
      console.error('Error fetching my products list:', error);
      return [];
    }
  }

  // Create a new product
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      const response = await this.makeRequest<{ success: boolean; message: string; product: Product }>(
        '/api/marketplace/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        }
      );
      return response.product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(productId: number): Promise<void> {
    try {
      await this.makeRequest<{ success: boolean; message: string }>(
        `/api/marketplace/${productId}`,
        {
          method: 'DELETE',
        }
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Update a product
  async updateProduct(productId: number, productData: Partial<CreateProductRequest>): Promise<Product> {
    try {
      const response = await this.makeRequest<{ success: boolean; message: string; product: Product }>(
        `/api/marketplace/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        }
      );
      return response.product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Get a single product by ID
  async getProduct(productId: number): Promise<Product> {
    try {
      const response = await this.makeRequest<{ success: boolean; product: Product }>(
        `/api/marketplace/${productId}`,
        {
          method: 'GET',
        }
      );
      return response.product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
}

export const marketplaceService = new MarketplaceService();
export default marketplaceService;
