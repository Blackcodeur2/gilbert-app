export const localImages: Record<string, any> = {
  'photo_samira.jpeg': require('../assets/images/photo_samira.jpeg'),
  'photo_gilbert.jpeg': require('../assets/images/photo_gilbert.jpeg'),
  'photo_divine.jpeg': require('../assets/images/photo_divine.jpeg'),
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
