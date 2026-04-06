export const localImages: Record<string, any> = {
  'photo_samira.jpeg': require('../assets/images/photo_samira.jpeg'),
  'photo_gilbert.jpeg': require('../assets/images/photo_gilbert.jpeg'),
  'photo_divine.jpeg': require('../assets/images/photo_divine.jpeg'),
  'cils.jpeg': require('../assets/images/cils.jpeg'),
  'cils2.jpeg': require('../assets/images/cils2.jpeg'),
  'ciles.jpeg': require('../assets/images/ciles.jpeg'),
  'vernis-noire.jpeg': require('../assets/images/vernis-noire.jpeg'),
  'vernis-rose.jpeg': require('../assets/images/vernis-rose.jpeg'),
  'vernis-rouge1.jpeg': require('../assets/images/vernis-rouge1.jpeg'),
  'vernis_rouge.jpeg': require('../assets/images/vernis_rouge.jpeg'),
  'vernis-blanc.jpeg': require('../assets/images/vernis-blanc.jpeg'),
  'vernis-blanc-po.jpeg': require('../assets/images/vernis-blanc-po.jpeg'),
  'vernis-blanc-rouge.jpeg': require('../assets/images/vernis-blanc-rouge.jpeg'),
  'vernis-blanc-transparent.jpeg': require('../assets/images/vernis-blanc-transparent.jpeg'),
  'vernis-trans-or.jpeg': require('../assets/images/vernis-trans-or.jpeg'),
  'vernis.jpeg': require('../assets/images/vernis.jpeg'),
  'hero-banner.jpg': require('../assets/images/hero-banner.jpg'),
  'auth-bg.jpg': require('../assets/images/auth-bg.jpg'),
  'app_logo.jpeg': require('../assets/images/app_logo.jpeg'),
};

export const getImageSource = (urlOrName: string | undefined | null) => {
  if (!urlOrName) return null;
  
  // Si c'est une URL distante
  if (urlOrName.startsWith('http')) {
    return { uri: urlOrName };
  }
  
  // Si c'est une image locale mappée
  if (localImages[urlOrName]) {
    return localImages[urlOrName];
  }
  
  // Par défaut, essayer de le traiter comme une URI
  return { uri: urlOrName };
};
