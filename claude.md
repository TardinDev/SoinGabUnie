Produit : SoinGabUnie
Pitch : Plateforme mobile qui permet aux utilisateurs de trouver et réserver des services de santé : Pharmacie, Médecins, Cliniques & Hôpitaux, Tradipraticiens (soins par les plantes).
Cible : Jeunes adultes et familles au Gabon / diaspora souhaitant organiser des soins pour proches.
Mission de l’IA : Générer un frontend React Native moderne, dark-first, accessible, performant et typié. Utiliser uniquement des libs récentes et stables. Après le frontend, attendre confirmation avant d’implémenter l’authentification (Clerk) et la partie backend (Supabase).

1) Stack & Contraintes

Framework : React Native (Expo recommandé).

Langage : TypeScript ("strict": true).

UI : Tailwind via NativeWind (obligatoire) – Dark theme par défaut.

Animations : react-native-reanimated (micro-interactions fluides).

Animations Lottie : LottieFiles pour Splash & illustrations.

État local : Zustand (stores minces, selectors).

Data fetching : TanStack Query (cache, mutations, retry).

Validation : Zod (toutes IO et formulaires).

Auth : Clerk (à ajouter après confirmation).

Backend : Supabase (à ajouter après confirmation).

Navigation : expo-router.

Qualité : ESLint + Prettier + tests unitaires sur utilitaires.

Toujours suivre la documentation officielle et utiliser les dernières versions stables. Pas de any non justifié, pas de secrets en client.

2) Design System (Dark Theme)

Palette (proposée, AA+)

Background principal: #0B0C10

Surfaces (cards/modals): #121319 / #161821

Texte primaire: #E8EAF0

Texte secondaire: #B4B8C5

Accent primaire (appel à l’action): #8A5CF6

Accent secondaire (validation): #22C55E

Alerte: #EF4444

Bordures/dividers: #232634

Guidelines

Rayons: rounded-2xl pour cards/boutons.

Ombres douces (plate, pas flashy).

Touch targets ≥ 44px.

Haptique léger sur actions clés.

Micro-animations reanimated (opacity/scale/translate).

Accessibilité: labels, roles, contrastes, Dynamic Type OK.

3) Fonctionnalités Frontend (MVP)

Splash Screen (Lottie)

Animation fluide (feuilles/plantes + croix médicale stylisée + pulsation douce).

Transition fade vers l’Onboarding/Home.

Onboarding (statique MVP)

2–3 slides: présentation services, sécurité, tradipraticiens.

CTA vers Accueil (sans auth au départ).

Accueil (hub)

Titre “SoinGabUnie”.

Grid de choix (5 cartes) : Pharmacie, Médecins, Cliniques & Hôpitaux, Tradipraticiens, Favoris (placeholder).

Barre de recherche (placeholder), chips de filtres rapides (ville, disponibilité).

Sections “Proches de vous” / “Populaires” (mock data).

Listes & Détails (mock)

Listes par catégorie (carte prestataire: nom, distance fictive, rating, tags).

Écran détails prestataire (description, horaires mock, services, CTA réserver — pas de backend pour l’instant).

Réservation (mock)

Formulaire validé par Zod (nom, motif, date/heure).

Confirmation visuelle (toast + carte “Réservation en attente” locale).

Important : Pas d’auth ni d’appels réels backend en MVP UI. Utiliser mock data + TanStack Query (queryFn mock) pour poser les patterns.

me demander de confirmer avant de commencer à developper le backend (Clerk + supabase)