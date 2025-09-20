// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '@/src/services/marketplaceService';

// กำหนดหน้าตาของข้อมูลในตะกร้า
interface CartItem extends Product {
  quantityInCart: number;
}

// กำหนดหน้าตาของ Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  itemCount: number;
}

// สร้าง Context ขึ้นมา
const CartContext = createContext<CartContextType | undefined>(undefined);

// สร้าง Provider เพื่อครอบแอปของเรา
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // ถ้ามีสินค้าอยู่แล้ว, เพิ่มจำนวน
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantityInCart: item.quantityInCart + 1 } : item
        );
      }
      // ถ้ายังไม่มี, เพิ่มสินค้าใหม่เข้าไป
      return [...prevItems, { ...product, quantityInCart: 1 }];
    });
    console.log(`${product.name} added to cart!`);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantityInCart, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// สร้าง Hook สำหรับเรียกใช้ Cart ได้ง่ายๆ
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};