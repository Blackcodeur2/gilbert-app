import { useState, useEffect } from 'react';
import { supabase, getPublicUrl } from '../services/supabase';
import { Category, Service, Product, Banner, GalleryItem } from '../services/types';

export function usePublicData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [catRes, srvRes, prodRes, banRes, galRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('services').select('*'),
        supabase.from('products').select('*'),
        supabase.from('banners').select('*').eq('is_active', true),
        supabase.from('gallery_items').select('*'),
      ]);

      if (catRes.data) {
        setCategories(catRes.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          iconName: c.icon_name,
          displayOrder: c.display_order,
        })));
      }

      if (srvRes.data) {
        setServices(srvRes.data.map((s: any) => ({
          id: s.id,
          categoryId: s.category_id,
          name: s.name,
          description: s.description,
          price: s.price,
          durationMinutes: s.duration_minutes,
          imageUrl: getPublicUrl('servicesimages', s.image_url),
          isFeatured: s.is_featured,
        })));
      }

      if (prodRes.data) {
        setProducts(prodRes.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stockQuantity: p.stock_quantity,
          imageUrl: getPublicUrl('productimages', p.image_url),
          category: p.category,
          brand: p.brand,
          isFeatured: p.is_featured,
        })));
      }

      if (banRes.data) {
        setBanners(banRes.data.map((b: any) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          imageUrl: getPublicUrl('banners', b.image_url), // Assuming 'banners' bucket
          ctaLabel: b.cta_label,
        })));
      }

      if (galRes.data) {
        setGallery(galRes.data.map((g: any) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          imageUrl: getPublicUrl('galerie', g.image_url),
          category: g.category,
          isFeatured: g.is_featured,
        })));
      }

    } catch (error) {
      console.error('Error fetching generic Supabase data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    categories,
    services,
    products,
    banners,
    gallery,
    isLoading,
    refetch: fetchData
  };
}
