-- ==========================================
-- SCRIPT D'INSERTION DES DONNÉES DE TEST
-- A exécuter dans l'éditeur SQL de Supabase
-- ==========================================

-- 1. Insertion des Catégories
INSERT INTO public.categories (id, name, icon_name, display_order) VALUES
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Pose Gel', 'brush', 1),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de2', 'Nail Art', 'palette', 2),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de3', 'Manucure', 'spa', 3),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de4', 'Pédicure', 'self-improvement', 4),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de5', 'Soins', 'healing', 5),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de6', 'Extensions', 'auto-awesome', 6)
ON CONFLICT (id) DO NOTHING;

-- 2. Insertion des Services
-- Pose Gel Complète
INSERT INTO public.services (category_id, name, description, price, duration_minutes, image_url, is_featured) VALUES
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Pose Gel Complète', 'Pose complète de gel sur ongles naturels avec limage, préparation de l''ongle et application de gel de construction. Résultat naturel et brillant qui dure 3 à 4 semaines.', 15000, 90, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop', true),
-- Remplissage Gel
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Remplissage Gel', 'Remplissage pour entretien de votre pose gel existante. Inclut le limage et la repose de gel à la base.', 10000, 60, 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=400&fit=crop', true),
-- Nail Art Simple
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de2', 'Nail Art Simple', 'Décoration artistique simple sur vos ongles : motifs géométriques, pois, lignes fines. 2 ongles décorés.', 5000, 30, 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=400&fit=crop', true),
-- Manucure Classique
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de3', 'Manucure Classique', 'Manucure traditionnelle complète : bain, coupe, limage, repoussage des cuticules et pose de vernis.', 5000, 30, 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=400&fit=crop', true),
-- Pédicure Classique
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de4', 'Pédicure Classique', 'Pédicure complète avec bain de pieds, soin des callosités, coupe et limage des ongles, vernis.', 8000, 45, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=400&fit=crop', true),
-- Extensions Ongles
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de6', 'Extensions Ongles', 'Pose d''extensions pour allonger vos ongles. Capsules ou chablons selon la forme souhaitée.', 20000, 120, 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=400&fit=crop', true);

-- 3. Insertion des Produits
INSERT INTO public.products (name, brand, category, price, stock_quantity, description, image_url, is_featured) VALUES
('Vernis OPI Rouge Passion', 'OPI', 'Vernis', 3500, 25, 'Vernis à ongles longue tenue couleur rouge passion intense. Formule enrichie en kératine pour des ongles forts et brillants.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop', true),
('Huile Cuticules Lavande', 'Gilbert Pro', 'Soins', 4000, 15, 'Huile nourrissante à la lavande pour cuticules sèches. Hydrate et assouplit le contour de l''ongle.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', true),
('Kit Manucure Complet', 'Pro Nails', 'Outils', 12000, 8, 'Kit professionnel 8 pièces : coupe-ongles, lime, poussoir, pince à cuticules, polissoir et plus.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop', true);

-- 4. Insertion de la Galerie
INSERT INTO public.gallery_items (title, description, category, image_url, is_featured) VALUES
('French Élégante', 'French manucure classique avec pointes blanches parfaites', 'Pose Gel', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop', true),
('Nail Art Floral', 'Motifs floraux délicats peints à la main', 'Nail Art', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop', true),
('Gel Rose Quartz', 'Pose gel effet pierre rose quartz translucide', 'Pose Gel', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=400&fit=crop', true);

-- 5. Insertion des Bannières
INSERT INTO public.banners (title, subtitle, image_url, cta_label) VALUES
('Gilbert Pro', 'Votre salon d''onglerie à Abidjan', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop', 'Réserver maintenant'),
('-20% Nail Art', 'Sur toutes les prestations nail art ce mois', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop', 'Voir les offres');
