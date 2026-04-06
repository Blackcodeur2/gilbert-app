/**
 * @file types.ts
 * @description Centralisation des interfaces de données pour Gilbet Pro.
 * Toutes les données proviennent de Supabase, plus de mock data.
 */

export interface Category {
  id: string;
  name: string;
  iconName: string;
  displayOrder: number;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  isFeatured: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  category: string;
  brand: string;
  isFeatured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  avatarUrl?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: string;
  paymentMethod?: 'cash' | 'orange_money' | 'mtn_money' | 'card';
  paymentStatus?: 'unpaid' | 'pending' | 'paid' | 'refunded';
  professional?: string;
  notes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
