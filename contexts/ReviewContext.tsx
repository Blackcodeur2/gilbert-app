import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getReviewsForService: (serviceId: string) => Review[];
  getAverageRating: (serviceId: string) => number;
  getReviewCount: (serviceId: string) => number;
  getUserReviewForService: (serviceId: string, userId: string) => Review | undefined;
}

export const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const REVIEWS_KEY = 'gilbertpro_reviews';

// Sample reviews
const sampleReviews: Review[] = [
  { id: 'rv-1', serviceId: 'svc-1', userId: 'u1', userName: 'Aya Diallo', rating: 5, comment: 'Pose gel magnifique, je suis ravie ! Le résultat est vraiment professionnel.', createdAt: '2025-12-15T10:00:00Z' },
  { id: 'rv-2', serviceId: 'svc-1', userId: 'u2', userName: 'Fatou Koné', rating: 4, comment: 'Très beau travail, je recommande. Juste un peu long sur le temps de pose.', createdAt: '2025-12-20T14:30:00Z' },
  { id: 'rv-3', serviceId: 'svc-1', userId: 'u3', userName: 'Aminata Bamba', rating: 5, comment: 'Toujours au top chez Gilbert Pro ! Mes ongles sont parfaits.', createdAt: '2026-01-05T09:15:00Z' },
  { id: 'rv-4', serviceId: 'svc-2', userId: 'u1', userName: 'Aya Diallo', rating: 5, comment: 'Remplissage rapide et propre, super résultat.', createdAt: '2026-01-10T11:00:00Z' },
  { id: 'rv-5', serviceId: 'svc-5', userId: 'u4', userName: 'Clarisse Ouattara', rating: 4, comment: 'Nail art simple mais élégant, exactement ce que je voulais.', createdAt: '2026-01-12T16:00:00Z' },
  { id: 'rv-6', serviceId: 'svc-6', userId: 'u5', userName: 'Sandrine Aka', rating: 5, comment: 'Du vrai art sur mes ongles ! Tous mes amis ont adoré.', createdAt: '2026-01-18T10:30:00Z' },
  { id: 'rv-7', serviceId: 'svc-9', userId: 'u6', userName: 'Bintou Cissé', rating: 4, comment: 'Manucure classique bien faite, bon rapport qualité-prix.', createdAt: '2026-01-22T13:00:00Z' },
  { id: 'rv-8', serviceId: 'svc-10', userId: 'u2', userName: 'Fatou Koné', rating: 5, comment: 'Le semi-permanent tient super bien, 3 semaines sans éclat !', createdAt: '2026-02-01T15:45:00Z' },
  { id: 'rv-9', serviceId: 'svc-13', userId: 'u7', userName: 'Marie-Claire Yao', rating: 5, comment: 'Pédicure au top, mes pieds sont comme neufs. Merci Gilbert Pro !', createdAt: '2026-02-10T09:30:00Z' },
  { id: 'rv-10', serviceId: 'svc-17', userId: 'u3', userName: 'Aminata Bamba', rating: 4, comment: 'Le soin paraffine est un vrai moment de détente. Mains très douces après.', createdAt: '2026-02-15T11:15:00Z' },
  { id: 'rv-11', serviceId: 'svc-20', userId: 'u8', userName: 'Estelle Gnamba', rating: 5, comment: 'Extensions magnifiques et très naturelles. Je ne peux plus m\'en passer.', createdAt: '2026-03-01T14:00:00Z' },
  { id: 'rv-12', serviceId: 'svc-6', userId: 'u9', userName: 'Patricia Koua', rating: 4, comment: 'Beau nail art, les couleurs sont vibrantes et la tenue est bonne.', createdAt: '2026-03-10T10:00:00Z' },
];

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(REVIEWS_KEY);
        if (data) setReviews(JSON.parse(data));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = useCallback((review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: `rv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
  }, []);

  const getReviewsForService = useCallback((serviceId: string) => {
    return reviews.filter(r => r.serviceId === serviceId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reviews]);

  const getAverageRating = useCallback((serviceId: string) => {
    const svcReviews = reviews.filter(r => r.serviceId === serviceId);
    if (svcReviews.length === 0) return 0;
    return svcReviews.reduce((sum, r) => sum + r.rating, 0) / svcReviews.length;
  }, [reviews]);

  const getReviewCount = useCallback((serviceId: string) => {
    return reviews.filter(r => r.serviceId === serviceId).length;
  }, [reviews]);

  const getUserReviewForService = useCallback((serviceId: string, userId: string) => {
    return reviews.find(r => r.serviceId === serviceId && r.userId === userId);
  }, [reviews]);

  const value = useMemo(() => ({
    reviews,
    addReview,
    getReviewsForService,
    getAverageRating,
    getReviewCount,
    getUserReviewForService,
  }), [reviews, addReview, getReviewsForService, getAverageRating, getReviewCount, getUserReviewForService]);

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}
