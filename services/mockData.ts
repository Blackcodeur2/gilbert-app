// ─── Types ────────────────────────────────────────────
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

export interface CartItem {
  product: Product;
  quantity: number;
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
}

export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
}

// ─── Image URLs ──────────────────────────────────────
const IMG = {
  nails1: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop',
  nails2: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=400&fit=crop',
  manicure: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=400&fit=crop',
  salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
  polish: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
  beauty1: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
  beauty2: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=400&fit=crop',
  hands: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=600&h=400&fit=crop',
  nailsSq1: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
  nailsSq2: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop',
  manicureSq: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=400&fit=crop',
  salonSq: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
  polishSq: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
  beauty1Sq: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  beauty2Sq: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
  handsSq: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop',
};

// ─── Categories ──────────────────────────────────────
export const categories: Category[] = [
  { id: 'cat-1', name: 'Pose Gel', iconName: 'brush', displayOrder: 1 },
  { id: 'cat-2', name: 'Nail Art', iconName: 'palette', displayOrder: 2 },
  { id: 'cat-3', name: 'Manucure', iconName: 'spa', displayOrder: 3 },
  { id: 'cat-4', name: 'Pédicure', iconName: 'self-improvement', displayOrder: 4 },
  { id: 'cat-5', name: 'Soins', iconName: 'healing', displayOrder: 5 },
  { id: 'cat-6', name: 'Extensions', iconName: 'auto-awesome', displayOrder: 6 },
];

// ─── Services (21 items) ─────────────────────────────
export const services: Service[] = [
  {
    id: 'svc-1', categoryId: 'cat-1', name: 'Pose Gel Complète',
    description: 'Pose complète de gel sur ongles naturels avec limage, préparation de l\'ongle et application de gel de construction. Résultat naturel et brillant qui dure 3 à 4 semaines.',
    price: 15000, durationMinutes: 90, imageUrl: IMG.nails1, isFeatured: true,
  },
  {
    id: 'svc-2', categoryId: 'cat-1', name: 'Remplissage Gel',
    description: 'Remplissage pour entretien de votre pose gel existante. Inclut le limage et la repose de gel à la base.',
    price: 10000, durationMinutes: 60, imageUrl: IMG.manicure, isFeatured: true,
  },
  {
    id: 'svc-3', categoryId: 'cat-1', name: 'Pose Gel French',
    description: 'Pose gel avec finition french manucure élégante. Pointes blanches parfaites pour un look classique et sophistiqué.',
    price: 18000, durationMinutes: 120, imageUrl: IMG.hands, isFeatured: false,
  },
  {
    id: 'svc-4', categoryId: 'cat-1', name: 'Dépose Gel',
    description: 'Retrait en douceur du gel existant avec traitement de l\'ongle naturel. Sans abîmer la plaque de l\'ongle.',
    price: 5000, durationMinutes: 30, imageUrl: IMG.salon, isFeatured: false,
  },
  {
    id: 'svc-5', categoryId: 'cat-2', name: 'Nail Art Simple',
    description: 'Décoration artistique simple sur vos ongles : motifs géométriques, pois, lignes fines. 2 ongles décorés.',
    price: 5000, durationMinutes: 30, imageUrl: IMG.nails2, isFeatured: true,
  },
  {
    id: 'svc-6', categoryId: 'cat-2', name: 'Nail Art Complexe',
    description: 'Création artistique détaillée sur tous les ongles. Motifs floraux, abstraits ou personnalisés selon vos envies.',
    price: 12000, durationMinutes: 60, imageUrl: IMG.nails1, isFeatured: true,
  },
  {
    id: 'svc-7', categoryId: 'cat-2', name: 'Nail Art 3D',
    description: 'Décorations en relief avec effets 3D : fleurs, nœuds, bijoux sculptés. Art miniature sur vos ongles.',
    price: 15000, durationMinutes: 90, imageUrl: IMG.beauty1, isFeatured: false,
  },
  {
    id: 'svc-8', categoryId: 'cat-2', name: 'Strass et Bijoux',
    description: 'Application de strass, pierres et bijoux décoratifs sur vos ongles pour un effet glamour.',
    price: 8000, durationMinutes: 45, imageUrl: IMG.polish, isFeatured: false,
  },
  {
    id: 'svc-9', categoryId: 'cat-3', name: 'Manucure Classique',
    description: 'Manucure traditionnelle complète : bain, coupe, limage, repoussage des cuticules et pose de vernis.',
    price: 5000, durationMinutes: 30, imageUrl: IMG.manicure, isFeatured: true,
  },
  {
    id: 'svc-10', categoryId: 'cat-3', name: 'Manucure Semi-Permanente',
    description: 'Manucure avec vernis semi-permanent longue tenue. Couleur intense et brillante pendant 2 à 3 semaines.',
    price: 8000, durationMinutes: 45, imageUrl: IMG.nails2, isFeatured: true,
  },
  {
    id: 'svc-11', categoryId: 'cat-3', name: 'Manucure Brésilienne',
    description: 'Soin manucure hydratant avec gants crème. Ongles nourris et peau douce en un seul geste.',
    price: 7000, durationMinutes: 40, imageUrl: IMG.hands, isFeatured: false,
  },
  {
    id: 'svc-12', categoryId: 'cat-3', name: 'Pose Vernis Simple',
    description: 'Application professionnelle de vernis classique. Large choix de couleurs disponibles.',
    price: 3000, durationMinutes: 20, imageUrl: IMG.polish, isFeatured: false,
  },
  {
    id: 'svc-13', categoryId: 'cat-4', name: 'Pédicure Classique',
    description: 'Pédicure complète avec bain de pieds, soin des callosités, coupe et limage des ongles, vernis.',
    price: 8000, durationMinutes: 45, imageUrl: IMG.beauty2, isFeatured: true,
  },
  {
    id: 'svc-14', categoryId: 'cat-4', name: 'Pédicure Spa',
    description: 'Pédicure luxueuse avec bain aromatique, gommage, masque hydratant et massage des pieds.',
    price: 12000, durationMinutes: 60, imageUrl: IMG.salon, isFeatured: false,
  },
  {
    id: 'svc-15', categoryId: 'cat-4', name: 'Beauté des Pieds Complète',
    description: 'Soin complet des pieds incluant pédicure spa, traitement des callosités et pose vernis semi-permanent.',
    price: 15000, durationMinutes: 90, imageUrl: IMG.beauty1, isFeatured: false,
  },
  {
    id: 'svc-16', categoryId: 'cat-5', name: 'Soin Hydratant Mains',
    description: 'Traitement hydratant profond pour les mains sèches. Masque et massage avec huiles essentielles.',
    price: 6000, durationMinutes: 30, imageUrl: IMG.beauty2, isFeatured: false,
  },
  {
    id: 'svc-17', categoryId: 'cat-5', name: 'Soin Paraffine',
    description: 'Bain de paraffine chaude pour hydrater et adoucir les mains. Soin réparateur en profondeur.',
    price: 8000, durationMinutes: 45, imageUrl: IMG.hands, isFeatured: true,
  },
  {
    id: 'svc-18', categoryId: 'cat-5', name: 'Traitement Ongles Cassants',
    description: 'Soin fortifiant spécial pour ongles fragiles et cassants. Application de kératine et vitamines.',
    price: 7000, durationMinutes: 30, imageUrl: IMG.manicure, isFeatured: false,
  },
  {
    id: 'svc-19', categoryId: 'cat-5', name: 'Soin Cuticules',
    description: 'Traitement doux des cuticules avec huile nourrissante. Contour d\'ongles parfait.',
    price: 4000, durationMinutes: 20, imageUrl: IMG.nails1, isFeatured: false,
  },
  {
    id: 'svc-20', categoryId: 'cat-6', name: 'Extensions Ongles',
    description: 'Pose d\'extensions pour allonger vos ongles. Capsules ou chablons selon la forme souhaitée.',
    price: 20000, durationMinutes: 120, imageUrl: IMG.nails2, isFeatured: true,
  },
  {
    id: 'svc-21', categoryId: 'cat-6', name: 'Extensions avec Nail Art',
    description: 'Extensions personnalisées avec décoration nail art complète. Le summum du glamour pour vos ongles.',
    price: 25000, durationMinutes: 150, imageUrl: IMG.beauty1, isFeatured: false,
  },
];

// ─── Product Categories ──────────────────────────────
export const productCategories = [
  'Tous', 'Vernis', 'Soins', 'Outils', 'Gel', 'Semi-Permanent', 'Décoration', 'Équipement',
];

// ─── Products (20 items) ─────────────────────────────
export const products: Product[] = [
  {
    id: 'prod-1', name: 'Vernis OPI Rouge Passion', brand: 'OPI', category: 'Vernis', price: 3500,
    description: 'Vernis à ongles longue tenue couleur rouge passion intense. Formule enrichie en kératine pour des ongles forts et brillants.', stockQuantity: 25, imageUrl: IMG.polishSq, isFeatured: true,
  },
  {
    id: 'prod-2', name: 'Vernis Essie Rose Poudré', brand: 'Essie', category: 'Vernis', price: 3000,
    description: 'Teinte rose poudré délicate et féminine. Parfait pour un look naturel et élégant au quotidien.', stockQuantity: 30, imageUrl: IMG.nailsSq2, isFeatured: true,
  },
  {
    id: 'prod-3', name: 'Base Coat Protecteur OPI', brand: 'OPI', category: 'Vernis', price: 2500,
    description: 'Base protectrice transparente qui protège l\'ongle naturel et améliore la tenue du vernis.', stockQuantity: 20, imageUrl: IMG.polishSq, isFeatured: false,
  },
  {
    id: 'prod-4', name: 'Top Coat Ultra Brillant', brand: 'OPI', category: 'Vernis', price: 2800,
    description: 'Finition brillante longue durée. Protège votre vernis et ajoute un éclat miroir spectaculaire.', stockQuantity: 22, imageUrl: IMG.nailsSq1, isFeatured: true,
  },
  {
    id: 'prod-5', name: 'Huile Cuticules Lavande', brand: 'Gilbert Pro', category: 'Soins', price: 4000,
    description: 'Huile nourrissante à la lavande pour cuticules sèches. Hydrate et assouplit le contour de l\'ongle.', stockQuantity: 15, imageUrl: IMG.beauty1Sq, isFeatured: true,
  },
  {
    id: 'prod-6', name: 'Crème Mains au Karité', brand: 'Gilbert Pro', category: 'Soins', price: 3500,
    description: 'Crème hydratante riche au beurre de karité. Nourrit et protège les mains toute la journée.', stockQuantity: 18, imageUrl: IMG.beauty2Sq, isFeatured: false,
  },
  {
    id: 'prod-7', name: 'Lime à Ongles 180/240', brand: 'Pro Nails', category: 'Outils', price: 1500,
    description: 'Lime professionnelle double face pour un limage précis. Grain 180 pour façonner, 240 pour polir.', stockQuantity: 50, imageUrl: IMG.manicureSq, isFeatured: false,
  },
  {
    id: 'prod-8', name: 'Kit Manucure Complet', brand: 'Pro Nails', category: 'Outils', price: 12000,
    description: 'Kit professionnel 8 pièces : coupe-ongles, lime, poussoir, pince à cuticules, polissoir et plus.', stockQuantity: 8, imageUrl: IMG.salonSq, isFeatured: true,
  },
  {
    id: 'prod-9', name: 'Gel UV Construction Rose', brand: 'IBD', category: 'Gel', price: 8000,
    description: 'Gel de construction rose translucide pour pose gel professionnelle. Auto-nivelant et facile à travailler.', stockQuantity: 12, imageUrl: IMG.nailsSq1, isFeatured: false,
  },
  {
    id: 'prod-10', name: 'Gel UV Finition', brand: 'IBD', category: 'Gel', price: 7500,
    description: 'Gel de finition ultra brillant sans résidu collant. Protection optimale et éclat longue durée.', stockQuantity: 14, imageUrl: IMG.nailsSq2, isFeatured: false,
  },
  {
    id: 'prod-11', name: 'Semi-Permanent Rose Nude', brand: 'Shellac', category: 'Semi-Permanent', price: 4500,
    description: 'Vernis semi-permanent rose nude naturel. Tenue 2-3 semaines avec finition parfaite.', stockQuantity: 20, imageUrl: IMG.polishSq, isFeatured: true,
  },
  {
    id: 'prod-12', name: 'Semi-Permanent Bordeaux', brand: 'Shellac', category: 'Semi-Permanent', price: 4500,
    description: 'Teinte bordeaux profonde et élégante. Idéale pour un look sophistiqué et intemporel.', stockQuantity: 18, imageUrl: IMG.nailsSq1, isFeatured: false,
  },
  {
    id: 'prod-13', name: 'Dissolvant Doux Sans Acétone', brand: 'Gilbert Pro', category: 'Soins', price: 2000,
    description: 'Dissolvant doux enrichi en vitamines. Retire le vernis sans assécher les ongles.', stockQuantity: 35, imageUrl: IMG.beauty1Sq, isFeatured: false,
  },
  {
    id: 'prod-14', name: 'Bâtonnets de Buis (x10)', brand: 'Pro Nails', category: 'Outils', price: 800,
    description: 'Bâtonnets en bois de buis pour repousser les cuticules en douceur. Lot de 10 pièces.', stockQuantity: 60, imageUrl: IMG.manicureSq, isFeatured: false,
  },
  {
    id: 'prod-15', name: 'Strass pour Ongles (x100)', brand: 'Deco Nails', category: 'Décoration', price: 3000,
    description: 'Assortiment de 100 strass multicolores pour nail art. Différentes tailles et couleurs.', stockQuantity: 25, imageUrl: IMG.nailsSq2, isFeatured: false,
  },
  {
    id: 'prod-16', name: 'Paillettes Holographiques', brand: 'Deco Nails', category: 'Décoration', price: 2500,
    description: 'Paillettes holographiques ultra fines pour effet arc-en-ciel sur vos ongles. Pot de 5g.', stockQuantity: 30, imageUrl: IMG.beauty2Sq, isFeatured: true,
  },
  {
    id: 'prod-17', name: 'Colle à Ongles Extra-Forte', brand: 'Pro Nails', category: 'Outils', price: 1200,
    description: 'Colle professionnelle séchage rapide pour capsules et réparations. Tenue longue durée.', stockQuantity: 40, imageUrl: IMG.salonSq, isFeatured: false,
  },
  {
    id: 'prod-18', name: 'Lampe UV/LED 48W', brand: 'Sun', category: 'Équipement', price: 25000,
    description: 'Lampe professionnelle UV/LED 48W avec capteur automatique. Catalyse tous types de gels en 30-60 secondes.', stockQuantity: 5, imageUrl: IMG.handsSq, isFeatured: true,
  },
  {
    id: 'prod-19', name: 'Vernis OPI Nude Classique', brand: 'OPI', category: 'Vernis', price: 3500,
    description: 'Teinte nude classique et intemporelle. Parfait pour le bureau et les occasions formelles.', stockQuantity: 28, imageUrl: IMG.polishSq, isFeatured: false,
  },
  {
    id: 'prod-20', name: 'Masque Mains Régénérant', brand: 'Gilbert Pro', category: 'Soins', price: 5000,
    description: 'Masque-gants hydratant intensif au collagène. Mains douces et rajeunies en 20 minutes.', stockQuantity: 12, imageUrl: IMG.beauty2Sq, isFeatured: false,
  },
];

// ─── Gallery Items (16 items) ────────────────────────
export const galleryCategories = ['Tous', 'Nail Art', 'Pose Gel', 'Manucure', 'Décoration', 'Pédicure'];

export const galleryItems: GalleryItem[] = [
  { id: 'gal-1', title: 'French Élégante', description: 'French manucure classique avec pointes blanches parfaites', imageUrl: IMG.nailsSq1, category: 'Pose Gel', isFeatured: true },
  { id: 'gal-2', title: 'Nail Art Floral', description: 'Motifs floraux délicats peints à la main', imageUrl: IMG.nailsSq2, category: 'Nail Art', isFeatured: true },
  { id: 'gal-3', title: 'Gel Rose Quartz', description: 'Pose gel effet pierre rose quartz translucide', imageUrl: IMG.manicureSq, category: 'Pose Gel', isFeatured: true },
  { id: 'gal-4', title: 'Manucure Nude', description: 'Manucure nude parfaite pour le quotidien', imageUrl: IMG.beauty1Sq, category: 'Manucure', isFeatured: false },
  { id: 'gal-5', title: 'Art Géométrique', description: 'Motifs géométriques modernes en noir et or', imageUrl: IMG.polishSq, category: 'Nail Art', isFeatured: true },
  { id: 'gal-6', title: 'Ombré Pastel', description: 'Dégradé pastel rose vers lilas, effet nuageux', imageUrl: IMG.handsSq, category: 'Nail Art', isFeatured: false },
  { id: 'gal-7', title: 'Décoration Strass', description: 'Ongles ornés de strass Swarovski et fils dorés', imageUrl: IMG.beauty2Sq, category: 'Décoration', isFeatured: true },
  { id: 'gal-8', title: 'Pédicure Été', description: 'Pédicure colorée aux teintes estivales', imageUrl: IMG.salonSq, category: 'Pédicure', isFeatured: false },
  { id: 'gal-9', title: 'Babyboomer', description: 'Effet babyboomer doux et naturel sur gel', imageUrl: IMG.nailsSq1, category: 'Pose Gel', isFeatured: false },
  { id: 'gal-10', title: 'Chrome Miroir', description: 'Effet chrome miroir argenté spectaculaire', imageUrl: IMG.nailsSq2, category: 'Décoration', isFeatured: true },
  { id: 'gal-11', title: 'Manucure Rouge Passion', description: 'Rouge intense et brillant, classique indémodable', imageUrl: IMG.polishSq, category: 'Manucure', isFeatured: false },
  { id: 'gal-12', title: 'Art Abstrait', description: 'Création artistique unique avec couleurs vives', imageUrl: IMG.manicureSq, category: 'Nail Art', isFeatured: false },
  { id: 'gal-13', title: 'Extensions Glamour', description: 'Extensions stiletto avec nail art complet', imageUrl: IMG.beauty1Sq, category: 'Décoration', isFeatured: false },
  { id: 'gal-14', title: 'Pédicure Spa', description: 'Résultat d\'une séance pédicure spa complète', imageUrl: IMG.handsSq, category: 'Pédicure', isFeatured: false },
  { id: 'gal-15', title: 'Marble Effect', description: 'Effet marbre blanc et gris sur gel', imageUrl: IMG.salonSq, category: 'Nail Art', isFeatured: true },
  { id: 'gal-16', title: 'Gel Paillettes Or', description: 'Pose gel avec paillettes dorées pour les fêtes', imageUrl: IMG.beauty2Sq, category: 'Pose Gel', isFeatured: false },
];

// ─── Time Slots ──────────────────────────────────────
export const timeSlots: string[] = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

// ─── Banners ─────────────────────────────────────────
export const banners: Banner[] = [
  {
    id: 'ban-1',
    title: 'Gilbert Pro',
    subtitle: 'Votre salon d\'onglerie à Abidjan',
    imageUrl: '', // Will use generated hero image
    ctaLabel: 'Réserver maintenant',
  },
  {
    id: 'ban-2',
    title: '-20% Nail Art',
    subtitle: 'Sur toutes les prestations nail art ce mois',
    imageUrl: IMG.nails1,
    ctaLabel: 'Voir les offres',
  },
  {
    id: 'ban-3',
    title: 'Nouveau : Soins Paraffine',
    subtitle: 'Découvrez nos soins hydratants luxueux',
    imageUrl: IMG.beauty1,
    ctaLabel: 'Découvrir',
  },
];

// ─── Default Profile ─────────────────────────────────
export const defaultProfile: UserProfile = {
  fullName: 'Marie Kouassi',
  phone: '+225 07 12 34 56 78',
  email: 'marie.kouassi@email.com',
  loyaltyPoints: 250,
};

// ─── Sample Bookings ─────────────────────────────────
export const sampleBookings: Booking[] = [
  {
    id: 'bk-1', serviceId: 'svc-1', serviceName: 'Pose Gel Complète',
    date: '2025-01-20', time: '10:00', status: 'completed', totalPrice: 15000,
    createdAt: '2025-01-18T10:00:00Z',
  },
  {
    id: 'bk-2', serviceId: 'svc-6', serviceName: 'Nail Art Complexe',
    date: '2025-01-28', time: '14:30', status: 'confirmed', totalPrice: 12000,
    createdAt: '2025-01-25T08:30:00Z',
  },
];

// ─── Helpers ─────────────────────────────────────────
export const getServiceById = (id: string): Service | undefined =>
  services.find(s => s.id === id);

export const getProductById = (id: string): Product | undefined =>
  products.find(p => p.id === id);

export const getServicesByCategory = (categoryId: string): Service[] =>
  categoryId === 'all' ? services : services.filter(s => s.categoryId === categoryId);

export const getFeaturedServices = (): Service[] =>
  services.filter(s => s.isFeatured);

export const getFeaturedProducts = (): Product[] =>
  products.filter(p => p.isFeatured);

export const getFeaturedGallery = (): GalleryItem[] =>
  galleryItems.filter(g => g.isFeatured);

export const getCategoryName = (categoryId: string): string =>
  categories.find(c => c.id === categoryId)?.name || '';
