import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, getPublicUrl } from '../services/supabase';

import { Product, CartItem, Booking, UserProfile } from '../services/types';

interface AppContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<void>;

  favoriteServiceIds: string[];
  toggleFavoriteService: (serviceId: string) => void;

  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  cart: 'gilbertpro_cart',
  favorites: 'gilbertpro_favorites',
};

const defaultProfile: UserProfile = {
  id: 'guest',
  fullName: 'Invité',
  email: '',
  phone: '',
  loyaltyPoints: 0,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoriteServiceIds, setFavoriteServiceIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Load local storage
  useEffect(() => {
    (async () => {
      try {
        const [cartData, favData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.cart),
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
        ]);
        if (cartData) setCartItems(JSON.parse(cartData));
        if (favData) setFavoriteServiceIds(JSON.parse(favData));
      } catch {}
    })();
  }, []);

  // Persist local storage constraints
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoriteServiceIds)); }, [favoriteServiceIds]);

  // Load Bookings & Profile from Supabase
  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      // Profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profileData) {
        setProfile({
          id: userId,
          fullName: profileData.full_name,
          email: '', // Not in profile table by default
          phone: profileData.phone || '',
          loyaltyPoints: profileData.loyalty_points || 0,
          avatarUrl: getPublicUrl('userprofilimage', profileData.avatar_url),
        });
      }
      
      // Bookings
      const { data: bookingsData } = await supabase.from('bookings').select('*, services(name)').eq('user_id', userId).order('created_at', { ascending: false });
      if (bookingsData) {
        setBookings(bookingsData.map((b: any) => ({
          id: b.id,
          serviceId: b.service_id,
          serviceName: b.services?.name || 'Prestation',
          date: b.booking_date,
          time: b.booking_time,
          status: b.status,
          paymentMethod: b.payment_method,
          paymentStatus: b.payment_status,
          professional: b.professional,
          notes: b.notes,
          totalPrice: b.total_price,
          createdAt: b.created_at,
        })));
      }
    };

    const initAuthData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setBookings([]);
        setProfile(defaultProfile);
      }
    };

    initAuthData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setBookings([]);
        setProfile(defaultProfile);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cart Logic
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

  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cartItems]);
  const cartItemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  // Bookings Logic
  const addBooking = useCallback(async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    // Optimistic UI
    const tempId = `temp-${Date.now()}`;
    const newBooking: Booking = { ...booking, id: tempId, createdAt: new Date().toISOString() };
    setBookings(prev => [newBooking, ...prev]);

    const { data, error } = await supabase.from('bookings').insert({
      user_id: session.user.id,
      service_id: booking.serviceId,
      booking_date: booking.date,
      booking_time: booking.time,
      payment_method: booking.paymentMethod || 'cash',
      payment_status: booking.paymentStatus || 'unpaid',
      professional: booking.professional,
      notes: booking.notes,
      total_price: booking.totalPrice,
      status: booking.status
    }).select().single();

    if (data) {
      setBookings(prev => prev.map(b => b.id === tempId ? { ...b, id: data.id, createdAt: data.created_at } : b));
    } else {
      // Revert if error
      setBookings(prev => prev.filter(b => b.id !== tempId));
      return false;
    }
    return true;
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
  }, []);

  // Favorites
  const toggleFavoriteService = useCallback((serviceId: string) => {
    setFavoriteServiceIds(prev => prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]);
  }, []);

  // Profile Update
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Mise à jour de l'état local immédiatement pour la fluidité (Optimistic)
    setProfile(prev => ({ ...prev, ...updates }));

    const profileUpdates: any = {};
    if (updates.fullName !== undefined) profileUpdates.full_name = updates.fullName;
    if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
    if (updates.avatarUrl !== undefined) profileUpdates.avatar_url = updates.avatarUrl;

    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating profile:', error);
      // Optionnel : Revert s'il y a un error important
    }
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
