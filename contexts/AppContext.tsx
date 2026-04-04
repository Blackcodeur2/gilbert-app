import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CartItem, Booking, UserProfile, Product,
  defaultProfile, sampleBookings,
} from '../services/mockData';

interface AppContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  cancelBooking: (bookingId: string) => void;

  favoriteServiceIds: string[];
  toggleFavoriteService: (serviceId: string) => void;

  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  cart: 'gilbertpro_cart',
  bookings: 'gilbertpro_bookings',
  favorites: 'gilbertpro_favorites',
  profile: 'gilbertpro_profile',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [favoriteServiceIds, setFavoriteServiceIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const [cartData, bookingsData, favData, profileData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.cart),
          AsyncStorage.getItem(STORAGE_KEYS.bookings),
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
          AsyncStorage.getItem(STORAGE_KEYS.profile),
        ]);
        if (cartData) setCartItems(JSON.parse(cartData));
        if (bookingsData) setBookings(JSON.parse(bookingsData));
        if (favData) setFavoriteServiceIds(JSON.parse(favData));
        if (profileData) setProfile(JSON.parse(profileData));
      } catch {}
    })();
  }, []);

  // Persist
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoriteServiceIds)); }, [favoriteServiceIds]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile)); }, [profile]);

  // Cart
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const cartItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Bookings
  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)
    );
  }, []);

  // Favorites
  const toggleFavoriteService = useCallback((serviceId: string) => {
    setFavoriteServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  // Profile
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const value = useMemo(() => ({
    cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartItemCount,
    bookings, addBooking, cancelBooking,
    favoriteServiceIds, toggleFavoriteService,
    profile, updateProfile,
  }), [cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartItemCount,
    bookings, addBooking, cancelBooking, favoriteServiceIds, toggleFavoriteService, profile, updateProfile]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
