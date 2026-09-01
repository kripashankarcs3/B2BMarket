export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  minOrder: number;
  images: string[];
  category: Category;
  categoryId: string;
  supplier: Supplier;
  supplierId: string;
  rating: number;
  reviewCount: number;
  specifications: Specification[];
  moq: number;
  tags: string[];
  featured: boolean;
  inStock: boolean;
  stockCount: number;
  createdAt: string;
  unit: string;
  certifications: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  icon: string;
}

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  description: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  yearEstablished: number;
  employees: string;
  certifications: string[];
  verified: boolean;
  premium: boolean;
  responseTime: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  supplierName: string;
  supplierId: string;
  tracking?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}

export interface Chat {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: 'buyer' | 'supplier';
  }[];
  messages: Message[];
  lastMessage: Message;
  unread: number;
  productId?: string;
  productName?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'buyer' | 'supplier';
  company?: string;
  phone?: string;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  suppliers: string[];
  certifications: string[];
  minRating: number;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  search: string;
}
