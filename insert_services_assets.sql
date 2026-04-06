-- ==========================================
-- SCRIPT D'INSERTION DES PRESTATIONS RÉELLES
-- Avec les images locales du dossier /assets/images
-- ==========================================

-- Suppression des anciennes données pour repartir sur du propre (Optionnel)
-- TRUNCATE public.services CASCADE;

-- 1. Récupération des IDs de catégories (à adapter selon votre base)
-- On suppose que les catégories existent déjà via le script précédent

-- 2. Insertion des Services avec images locales
INSERT INTO public.services (category_id, name, description, price, duration_minutes, image_url, is_featured) VALUES
-- Pose Gel (Catégorie b31f0cf2-75d3-41a4-92d3-1c322b7a9de1)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Pose Gel Premium', 'Une pose de gel haute résistance avec une finition ultra-brillante.', 15000, 90, 'vernis.jpeg', true),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Remplissage Gel', 'Entretien de votre pose gel pour une tenue impeccable.', 10000, 60, 'vernis-rose.jpeg', false),

-- Nail Art (Catégorie b31f0cf2-75d3-41a4-92d3-1c322b7a9de2)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de2', 'Nail Art Floral', 'Dessins de fleurs délicats réalisés à la main levée.', 5000, 30, 'vernis-blanc-po.jpeg', true),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de2', 'French Manucure Moderne', 'La french classique revisitée avec des touches de couleurs.', 7000, 45, 'vernis-blanc.jpeg', true),

-- Manucure (Catégorie b31f0cf2-75d3-41a4-92d3-1c322b7a9de3)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de3', 'Manucure Express', 'Soin rapide des ongles et cuticules avec pose de vernis.', 5000, 20, 'vernis_rouge.jpeg', false),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de3', 'Soin des Mains Complet', 'Gommage, massage et soin complet pour des mains douces.', 12000, 50, 'vernis-blanc-transparent.jpeg', false),

-- Extensions (Catégorie b31f0cf2-75d3-41a4-92d3-1c322b7a9de6)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de6', 'Extension de Cils Mixte', 'Mélange de cil à cil et volume russe pour un regard envoûtant.', 25000, 120, 'cils.jpeg', true),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de6', 'Volume Russe Intense', 'Extensions volumineuses pour un effet glamour maximal.', 35000, 150, 'cils2.jpeg', true);

-- 3. Mise à jour des Produits de la boutique
UPDATE public.products SET image_url = 'vernis-noire.jpeg' WHERE name LIKE '%Vernis%';
UPDATE public.products SET image_url = 'vernis-rose.jpeg' WHERE name LIKE '%Huile%';
UPDATE public.products SET image_url = 'vernis.jpeg' WHERE name LIKE '%Kit%';

-- 4. Mise à jour de la Galerie
-- (On peut insérer de nouvelles lignes ou mettre à jour les existantes)
INSERT INTO public.gallery_items (title, description, category, image_url, is_featured) VALUES
('Pose Rouge Glamour', 'Un rouge classique indémodable.', 'Manucure', 'vernis-rouge1.jpeg', true),
('Cils de Biche', 'Regard intensifié par nos extensions.', 'Extensions', 'ciles.jpeg', true),
('Art Abstrait', 'Motifs géométriques noirs et blancs.', 'Nail Art', 'vernis-noire.jpeg', true);
