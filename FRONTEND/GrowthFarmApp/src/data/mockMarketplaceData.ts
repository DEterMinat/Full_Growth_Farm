import { Product } from '../services/marketplaceService';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "เมล็ดข้าวหอมมะลิ พรีเมี่ยม",
    description: "เมล็ดข้าวหอมมะลิแท้ 100% คุณภาพดี เก็บเกี่ยวใหม่ ให้ข้าวหอมนุ่ม",
    price: "45.00",
    category: "Seeds",
    unit: "กก.",
    quantity: 150,
    imageUrl: null,
    status: "available",
    sellerId: 1,
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-15T08:30:00Z",
    seller: {
      id: 1,
      username: "farmer_somchai",
      full_name: "สมชาย เกษตรกร"
    }
  },
  {
    id: 2,
    name: "ปุ๋ยอินทรีย์ชีวภาพ",
    description: "ปุ๋ยอินทรีย์จากวัตถุดิบธรรมชาติ 100% ปรับปรุงดินและเพิ่มความอุดมสมบูรณ์",
    price: "180.00",
    category: "Fertilizers",
    unit: "ถุง 25 กก.",
    quantity: 50,
    imageUrl: null,
    status: "available",
    sellerId: 2,
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    seller: {
      id: 2,
      username: "organic_farm",
      full_name: "ฟาร์มออร์แกนิค จำกัด"
    }
  },
  {
    id: 3,
    name: "เมล็ดพันธุ์มะเขือเทศเชอรี่",
    description: "เมล็ดพันธุ์มะเขือเทศเชอรี่หวาน ผลผลิตสูง ทนต่อโรค",
    price: "25.00",
    category: "Seeds",
    unit: "ซอง",
    quantity: 200,
    imageUrl: null,
    status: "available",
    sellerId: 3,
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
    seller: {
      id: 3,
      username: "seeds_center",
      full_name: "ศูนย์เมล็ดพันธุ์ภูเก็ต"
    }
  },
  {
    id: 4,
    name: "จอบมือถือสแตนเลส",
    description: "จอบมือถือสแตนเลสคุณภาพดี ทนทาน ใช้งานง่าย เหมาะสำหรับสวนครัว",
    price: "350.00",
    category: "Tools",
    unit: "อัน",
    quantity: 30,
    imageUrl: null,
    status: "available",
    sellerId: 4,
    createdAt: "2024-01-18T11:30:00Z",
    updatedAt: "2024-01-18T11:30:00Z",
    seller: {
      id: 4,
      username: "tool_shop",
      full_name: "ร้านเครื่องมือการเกษตร"
    }
  },
  {
    id: 5,
    name: "ปุ๋ยเคมี NPK 16-20-0",
    description: "ปุ๋ยเคมีสำหรับข้าว เสริมการเจริญเติบโตและเพิ่มผลผลิต",
    price: "850.00",
    category: "Fertilizers",
    unit: "ถุง 50 กก.",
    quantity: 25,
    imageUrl: null,
    status: "available",
    sellerId: 2,
    createdAt: "2024-01-19T13:45:00Z",
    updatedAt: "2024-01-19T13:45:00Z",
    seller: {
      id: 2,
      username: "organic_farm",
      full_name: "ฟาร์มออร์แกนิค จำกัด"
    }
  },
  {
    id: 6,
    name: "เมล็ดพันธุ์แตงโม",
    description: "เมล็ดพันธุ์แตงโมหวาน เนื้อแน่น สีแดงสด ให้ผลผลิตดี",
    price: "35.00",
    category: "Seeds",
    unit: "ซอง",
    quantity: 80,
    imageUrl: null,
    status: "available",
    sellerId: 3,
    createdAt: "2024-01-20T14:20:00Z",
    updatedAt: "2024-01-20T14:20:00Z",
    seller: {
      id: 3,
      username: "seeds_center",
      full_name: "ศูนย์เมล็ดพันธุ์ภูเก็ต"
    }
  },
  {
    id: 7,
    name: "สายยางรดน้ำ 25 เมตร",
    description: "สายยางรดน้ำคุณภาพดี ยืดหยุ่น ทนทานต่อแสงแดด",
    price: "450.00",
    category: "Tools",
    unit: "เส้น",
    quantity: 15,
    imageUrl: null,
    status: "available",
    sellerId: 4,
    createdAt: "2024-01-21T15:00:00Z",
    updatedAt: "2024-01-21T15:00:00Z",
    seller: {
      id: 4,
      username: "tool_shop",
      full_name: "ร้านเครื่องมือการเกษตร"
    }
  },
  {
    id: 8,
    name: "เมล็ดพันธุ์ผักบุ้งจีน",
    description: "เมล็ดพันธุ์ผักบุ้งจีน โตเร็ว ใบเขียวสด รสชาติดี",
    price: "15.00",
    category: "Seeds",
    unit: "ซอง",
    quantity: 120,
    imageUrl: null,
    status: "available",
    sellerId: 1,
    createdAt: "2024-01-22T16:15:00Z",
    updatedAt: "2024-01-22T16:15:00Z",
    seller: {
      id: 1,
      username: "farmer_somchai",
      full_name: "สมชาย เกษตรกร"
    }
  },
  {
    id: 9,
    name: "ปุ๋ยหมักจากมูลไก่",
    description: "ปุ๋ยหมักจากมูลไก่แท้ ผ่านกระบวนการหมักครบถ้วน ปลอดภัยต่อพืช",
    price: "120.00",
    category: "Fertilizers",
    unit: "ถุง 20 กก.",
    quantity: 40,
    imageUrl: null,
    status: "available",
    sellerId: 5,
    createdAt: "2024-01-23T17:30:00Z",
    updatedAt: "2024-01-23T17:30:00Z",
    seller: {
      id: 5,
      username: "poultry_farm",
      full_name: "ฟาร์มไก่เพื่อปุ๋ย"
    }
  },
  {
    id: 10,
    name: "เครื่องพ่นยาแบบหิ้ว",
    description: "เครื่องพ่นยาแบบหิ้ว ขนาด 16 ลิตร น้ำหนักเบา ใช้งานสะดวก",
    price: "1200.00",
    category: "Tools",
    unit: "เครื่อง",
    quantity: 8,
    imageUrl: null,
    status: "available",
    sellerId: 4,
    createdAt: "2024-01-24T18:00:00Z",
    updatedAt: "2024-01-24T18:00:00Z",
    seller: {
      id: 4,
      username: "tool_shop",
      full_name: "ร้านเครื่องมือการเกษตร"
    }
  },
  {
    id: 11,
    name: "เมล็ดพันธุ์ข้าวโพดหวาน",
    description: "เมล็ดพันธุ์ข้าวโพดหวาน หวานกรอบ เก็บเกี่ยวได้ตลอดปี",
    price: "40.00",
    category: "Seeds",
    unit: "ซอง",
    quantity: 90,
    imageUrl: null,
    status: "available",
    sellerId: 3,
    createdAt: "2024-01-25T19:00:00Z",
    updatedAt: "2024-01-25T19:00:00Z",
    seller: {
      id: 3,
      username: "seeds_center",
      full_name: "ศูนย์เมล็ดพันธุ์ภูเก็ต"
    }
  },
  {
    id: 12,
    name: "ปุ๋ยใส่ใบ สูตรพิเศษ",
    description: "ปุ๋ยใส่ใบสูตรพิเศษ เพิ่มความเขียวข่นของใบ กระตุ้นการออกดอก",
    price: "75.00",
    category: "Fertilizers",
    unit: "ขวด 500 มล.",
    quantity: 60,
    imageUrl: null,
    status: "available",
    sellerId: 2,
    createdAt: "2024-01-26T20:15:00Z",
    updatedAt: "2024-01-26T20:15:00Z",
    seller: {
      id: 2,
      username: "organic_farm",
      full_name: "ฟาร์มออร์แกนิค จำกัด"
    }
  },
  {
    id: 13,
    name: "พลั่วปลูกต้นไม้",
    description: "พลั่วปลูกต้นไม้ขนาดกลาง ด้ามไม้ทนทาน เหมาะสำหรับขุดหลุม",
    price: "280.00",
    category: "Tools",
    unit: "อัน",
    quantity: 20,
    imageUrl: null,
    status: "available",
    sellerId: 4,
    createdAt: "2024-01-27T21:00:00Z",
    updatedAt: "2024-01-27T21:00:00Z",
    seller: {
      id: 4,
      username: "tool_shop",
      full_name: "ร้านเครื่องมือการเกษตร"
    }
  },
  {
    id: 14,
    name: "เมล็ดพันธุ์กะหล่ำปลี",
    description: "เมล็ดพันธุ์กะหล่ำปลีขาว หัวแน่น ทนต่อโรคราน้ำค้าง",
    price: "30.00",
    category: "Seeds",
    unit: "ซอง",
    quantity: 70,
    imageUrl: null,
    status: "available",
    sellerId: 1,
    createdAt: "2024-01-28T08:30:00Z",
    updatedAt: "2024-01-28T08:30:00Z",
    seller: {
      id: 1,
      username: "farmer_somchai",
      full_name: "สมชาย เกษตรกร"
    }
  },
  {
    id: 15,
    name: "ปุ๋ยควบคุมการปล่อย 6 เดือน",
    description: "ปุ๋ยควบคุมการปล่อยช้า ใช้ได้นาน 6 เดือน ประหยัดแรงงาน",
    price: "320.00",
    category: "Fertilizers",
    unit: "ถุง 5 กก.",
    quantity: 35,
    imageUrl: null,
    status: "available",
    sellerId: 2,
    createdAt: "2024-01-29T09:45:00Z",
    updatedAt: "2024-01-29T09:45:00Z",
    seller: {
      id: 2,
      username: "organic_farm",
      full_name: "ฟาร์มออร์แกนิค จำกัด"
    }
  },
  // เพิ่มสินค้าที่หมด
  {
    id: 16,
    name: "เมล็ดพันธุ์มะเขือยาว",
    description: "เมล็ดพันธุ์มะเขือยาวสีม่วง ผลยาว เนื้อนุ่ม รสชาติดี",
    price: "22.00",
    category: "Seeds",
    unit: "ซอง",
    quantity: 0,
    imageUrl: null,
    status: "out_of_stock",
    sellerId: 3,
    createdAt: "2024-01-30T10:00:00Z",
    updatedAt: "2024-01-30T10:00:00Z",
    seller: {
      id: 3,
      username: "seeds_center",
      full_name: "ศูนย์เมล็ดพันธุ์ภูเก็ต"
    }
  },
  {
    id: 17,
    name: "กรรไกรตัดกิ่งไม้",
    description: "กรรไกรตัดกิ่งไม้ เบอร์ 8 คมตัดดี ด้ามจับถนัดมือ",
    price: "650.00",
    category: "Tools",
    unit: "อัน",
    quantity: 12,
    imageUrl: null,
    status: "available",
    sellerId: 4,
    createdAt: "2024-01-31T11:15:00Z",
    updatedAt: "2024-01-31T11:15:00Z",
    seller: {
      id: 4,
      username: "tool_shop",
      full_name: "ร้านเครื่องมือการเกษตร"
    }
  },
  {
    id: 18,
    name: "เมล็ดพันธุ์แครอท",
    description: "เมล็ดพันธุ์แครอทส้ม หวานกรอบ รากยาวตรง เหมาะปลูกในไทย",
    price: "28.00",
    category: "Seeds",
    unit: "ซอง",
    quantity: 95,
    imageUrl: null,
    status: "available",
    sellerId: 1,
    createdAt: "2024-02-01T12:30:00Z",
    updatedAt: "2024-02-01T12:30:00Z",
    seller: {
      id: 1,
      username: "farmer_somchai",
      full_name: "สมชาย เกษตรกร"
    }
  },
  {
    id: 19,
    name: "ปูนขาวสำหรับปรับ pH ดิน",
    description: "ปูนขาวสำหรับปรับ pH ดิน ลดความเป็นกด เพิ่มความอุดมสมบูรณ์",
    price: "85.00",
    category: "Fertilizers",
    unit: "ถุง 10 กก.",
    quantity: 45,
    imageUrl: null,
    status: "available",
    sellerId: 5,
    createdAt: "2024-02-02T13:45:00Z",
    updatedAt: "2024-02-02T13:45:00Z",
    seller: {
      id: 5,
      username: "poultry_farm",
      full_name: "ฟาร์มไก่เพื่อปุ๋ย"
    }
  },
  {
    id: 20,
    name: "ตะแกรงเก็บผลไม้",
    description: "ตะแกรงเก็บผลไม้ ขนาดใหญ่ 40x60 ซม. พลาสติกคุณภาพดี",
    price: "180.00",
    category: "Tools",
    unit: "ใบ",
    quantity: 25,
    imageUrl: null,
    status: "available",
    sellerId: 4,
    createdAt: "2024-02-03T14:00:00Z",
    updatedAt: "2024-02-03T14:00:00Z",
    seller: {
      id: 4,
      username: "tool_shop",
      full_name: "ร้านเครื่องมือการเกษตร"
    }
  }
];

// Mock functions for filtering
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'All Products') {
    return mockProducts;
  }
  return mockProducts.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) {
    return mockProducts;
  }
  
  const searchTerm = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.seller.full_name.toLowerCase().includes(searchTerm)
  );
};

export const getProductById = (id: number): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getAvailableProducts = (): Product[] => {
  return mockProducts.filter(product => product.status === 'available');
};