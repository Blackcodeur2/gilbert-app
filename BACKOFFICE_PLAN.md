# 💅 Projet : Gilbert Pro - Back-Office de Gestion

## 1. État des Lieux (Audit Fullstack)
Suite à l'étude du code source et de la base de données :
*   **Backend** : Supabase (PostgreSQL). Tables existantes : `profiles`, `categories`, `services`, `products`, `gallery_items`, `bookings`, `payments`.
*   **Auth** : Géré par Supabase Auth avec un trigger pour créer les profils.
*   **Stockage** : Supabase Storage (Buckets pour images).
*   **Techno Mobile** : React Native (Expo) avec Expo Router.
*   **Métier** : Salon d'onglerie et boutique de cosmétiques.

## 2. Architecture du Back-Office
Je propose d'utiliser une stack moderne et performante :
*   **Framework** : React + Vite (plus rapide et léger qu'un Next.js pour un dashboard admin pur).
*   **Styling** : Vanilla CSS avec un design **"Luxury & Premium"** (Dark mode, accents Or/Rose, animations fluides).
*   **Gestion d'état/Données** : React Query (TanStack Query) pour synchroniser avec Supabase en temps réel.
*   **Icônes** : Lucide React (pour un look moderne).

## 3. Plan d'implémentation (Dashboard Administrateur)

### Phase 1 : Fondations
*   Initialisation de l'application Vite dans un sous-dossier `/admin` ou à la racine.
*   Configuration de l'authentification Admin (vérification du statut `is_admin` dans `profiles`).
*   Mise en place du Layout (Sidebar escamotable, Topbar, Zones de contenu).

### Phase 2 : Gestion Métier (CRUD)
*   **Module Réservations** : Planning, validation des RDV (pending, confirmed, completed), assignation aux experts.
*   **Module Services** : Gestion des tarifs, descriptions et images des prestations.
*   **Module Boutique** : Inventaire des produits, gestion des stocks, ajout de nouveaux articles.
*   **Module Galerie** : Upload et organisation des photos de réalisations.

### Phase 3 : Analytics & CRM
*   **Dashboard** : Graphiques CA (Chiffre d'Affaires), top services, nouveaux clients.
*   **Module Clients** : Liste des clients, points de fidélité, historique des réservations.

## 4. Design & Esthétique
Le back-office ne sera pas qu'un simple tableau. Il aura un design **Premium** :
*   Effets de verre (Glassmorphism).
*   Transitions de page fluides.
*   Tableaux de données interactifs avec filtres avancés.

---
**Souhaitez-vous que je commence l'initialisation du projet `/admin` ou préférez-vous que j'intègre cela différemment ?** J'attends votre validation sur ce plan pour passer à l'action.
