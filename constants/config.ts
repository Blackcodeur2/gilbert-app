export const config = {
  appName: 'Gilbert Pro',
  appTagline: 'Salon d\'Onglerie',
  appDescription: 'Votre destination beauté pour des ongles sublimes',
  currency: 'FCFA',
  locale: 'fr-FR',
  phone: '+237 658 35 92 19/ 6 78 21 67 15',
  email: 'contact@gilbertpro.ci',
  address: 'Dschang, Face ARICAM',
  openingHours: 'Lun - Sam : 8h00 - 19h00',
  instagram: '@gilbertpro_ci',
  bookingSlotDuration: 30,
  maxCartItems: 20,
};

export const timeSlots: string[] = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

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
