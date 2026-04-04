import { useContext } from 'react';
import { ReviewContext } from '../contexts/ReviewContext';

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReviews must be used within ReviewProvider');
  return context;
}
