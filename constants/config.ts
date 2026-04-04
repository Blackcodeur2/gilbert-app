export const config = {
  appName: 'Gilbert Pro',
  appTagline: 'Salon d\'Onglerie',
  appDescription: 'Votre destination beauté pour des ongles sublimes',
  currency: 'FCFA',
  locale: 'fr-FR',
  phone: '+225 07 07 07 07 07',
  email: 'contact@gilbertpro.ci',
  address: 'Abidjan, Cocody Riviera Palmeraie',
  openingHours: 'Lun - Sam : 8h00 - 19h00',
  instagram: '@gilbertpro_ci',
  bookingSlotDuration: 30,
  maxCartItems: 20,
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('fr-FR')} FCFA`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
};

export const formatTime = (time: string): string => {
  return time.replace(':', 'h');
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé',
  };
  return labels[status] || status;
};
