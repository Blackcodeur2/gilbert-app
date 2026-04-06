-- ==========================================
-- SCRIPT D'INSERTION DES DONNÉES FINALES (CORRIGÉ)
-- Prestations et Produits réels Gilbert Pro
-- ==========================================

-- 1. Nettoyage (Optionnel)
-- TRUNCATE public.services, public.categories, public.products CASCADE;

-- 2. Création des Catégories avec des UUIDs valides
INSERT INTO public.categories (id, name, icon_name, display_order) VALUES
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Sourcils', 'face', 1),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de6', 'Extensions', 'remove-red-eye', 2),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de2', 'Maquillage', 'brush', 3),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de7', 'Pose Gel', 'fingerprint', 4),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de3', 'Manucure', 'back-hand', 5),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de4', 'Pédicure', 'airline-seat-recline-extra', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Insertion des Prestations (Services)
INSERT INTO public.services (category_id, name, description, price, duration_minutes, image_url) VALUES
-- Sourcils (b31f0cf2-75d3-41a4-92d3-1c322b7a9de1)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Epilation des sourcils', 'Nettoyage et forme des sourcils.', 200, 15, 'vernis.jpeg'),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Traçages des sourcils', 'Dessin et définition des sourcils.', 500, 20, 'vernis.jpeg'),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Micros Blandine', 'Technique spéciale de micro-pigmentation.', 10000, 120, 'vernis.jpeg'),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de1', 'Micros Shading', 'Effet poudré pour des sourcils naturels.', 5000, 90, 'vernis.jpeg'),

-- Extensions & Cils (b31f0cf2-75d3-41a4-92d3-1c322b7a9de6)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de6', 'Pose des cils', 'Pose classique (de 1000f à 2500f selon volume).', 1000, 45, 'cils.jpeg'),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de6', 'Extensions des cils', 'Extensions longue durée (de 2500f à 10000f).', 2500, 90, 'cils2.jpeg'),

-- Maquillage (b31f0cf2-75d3-41a4-92d3-1c322b7a9de2)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de2', 'Make-up Simple', 'Maquillage pour journée ou soirée légère.', 5000, 45, 'vernis-rouge.jpeg'),

-- Pose Gel (b31f0cf2-75d3-41a4-92d3-1c322b7a9de7)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de7', 'Vernis permanent (Gel)', 'Tenue longue durée sans écaillement.', 1000, 30, 'vernis-rose.jpeg'),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de7', 'Pose capsule avec vernis gel', 'Rallongement capsules avec finition gel.', 2000, 75, 'vernis-blanc.jpeg'),

-- Soins (Pédicure: b31f0cf2-75d3-41a4-92d3-1c322b7a9de4, Manucure: b31f0cf2-75d3-41a4-92d3-1c322b7a9de3)
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de4', 'Soin des pieds', 'Pédicure complète pour des pieds doux.', 3000, 45, 'vernis-blanc-transparent.jpeg'),
('b31f0cf2-75d3-41a4-92d3-1c322b7a9de3', 'Soin des mains', 'Manucure relaxante et nourrissante.', 2000, 30, 'vernis-blanc-transparent.jpeg');

-- 4. Insertion des Produits (Boutique)
INSERT INTO public.products (name, description, price, stock_quantity, image_url, category, brand) VALUES
('Pack Make-up Personnel', 'Pack complet pour se maquiller au quotidien.', 10000, 10, 'app_logo.jpeg', 'Maquillage', 'Gilbert Pro'),
('Pack Maquillage Professionnel', 'Kit haute performance pour les pros.', 60000, 5, 'app_logo.jpeg', 'Maquillage', 'Gilbert Pro'),
('Savon Bio Artisanal', 'Savon naturel pour une peau saine.', 1500, 50, 'vernis-rose.jpeg', 'Hygiène', 'Gilbert Pro'),
('Glycérine Bio', 'Hydratation intense du corps.', 3000, 20, 'vernis-rose.jpeg', 'Hygiène', 'Gilbert Pro'),
('Lotion Anti-boutons', 'Soin ciblé pour les imperfections.', 2500, 15, 'vernis-rose.jpeg', 'Soin', 'Gilbert Pro'),
('Gel Douche Parfumé', 'Nettoyage doux et rafraîchissant.', 3500, 30, 'vernis-rose.jpeg', 'Hygiène', 'Gilbert Pro'),
('Bracelet Bijou', 'Bijou fantaisie élégant.', 5000, 12, 'hero-banner.jpg', 'Accessoires', 'Exclusivité'),
('Gloss Brillant', 'Pour des lèvres pulpeuses et brillantes.', 1000, 40, 'vernis.jpeg', 'Maquillage', 'Gilbert Pro');
