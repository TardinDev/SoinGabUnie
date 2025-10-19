# 🏥 SoinGabUnie

<div align="center">

**Plateforme mobile de réservation de services de santé au Gabon**

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.2-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)

</div>

---

## 📱 À propos

**SoinGabUnie** est une plateforme mobile qui permet aux utilisateurs de **trouver et réserver** facilement des services de santé au Gabon :

- 💊 **Pharmacies** - Trouvez des pharmacies proches avec livraison à domicile
- 👨‍⚕️ **Médecins** - Prenez rendez-vous avec des médecins qualifiés
- 🏥 **Cliniques & Hôpitaux** - Réservez dans les établissements de santé
- 🌿 **Tradipraticiens** - Accédez aux soins traditionnels par les plantes

### 🎯 Public cible

- Jeunes adultes et familles au Gabon
- Diaspora gabonaise souhaitant organiser des soins pour leurs proches

---

## ✨ Fonctionnalités

### MVP (Phase actuelle - Frontend uniquement)

- ✅ **Splash Screen animé** avec Lottie
- ✅ **Onboarding** - 3 slides de présentation
- ✅ **Écran d'accueil** avec recherche et filtres
- ✅ **Grille de services** (5 catégories)
- ✅ **Listes de prestataires** par catégorie
- ✅ **Pages détails** des prestataires
- ✅ **Formulaire de réservation** (mock data)
- ✅ **Système de favoris**
- ✅ **Section produits traditionnels**
- ✅ **Section événements santé**
- ✅ **Navigation par onglets** avec animations fluides
- ✅ **Dark theme** par défaut
- ✅ **Micro-animations** et retours haptiques

### 🚧 Prochaines étapes (À venir)

- 🔐 **Authentification** (Clerk)
- 🗄️ **Backend & API** (Supabase)
- 💳 **Paiements en ligne**
- 📍 **Géolocalisation réelle**
- 💬 **Messagerie temps réel**
- 📊 **Tableau de bord utilisateur**

---

## 🛠️ Stack Technique

### Core

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React Native** | 0.81.4 | Framework mobile |
| **Expo** | SDK 54 | Toolchain & build |
| **TypeScript** | 5.9.2 | Langage (mode strict) |
| **Expo Router** | 6.0.5 | Navigation file-based |

### UI & Styling

| Technologie | Version | Usage |
|-------------|---------|-------|
| **NativeWind** | 4.2.0 | Tailwind CSS pour RN |
| **Reanimated** | 4.1.0 | Animations performantes |
| **Lottie** | 7.3.1 | Animations vectorielles |
| **Expo Linear Gradient** | 15.0.7 | Dégradés |
| **Expo Blur** | 15.0.7 | Effets de flou (glassmorphism) |

### State Management & Data

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Zustand** | 5.0.8 | State management léger |
| **TanStack Query** | 5.87.4 | Data fetching & cache |
| **Zod** | 4.1.8 | Validation de schémas |

### Developer Experience

| Technologie | Usage |
|-------------|-------|
| **ESLint** | Linting |
| **Prettier** | Formatage de code |
| **Prettier Tailwind Plugin** | Tri des classes Tailwind |

---

## 🎨 Design System

### Palette (Dark Theme - Contraste AA+)

```typescript
{
  background: '#0B0C10',        // Fond principal
  surface: '#121319',           // Cartes/modals
  surfaceAlt: '#161821',        // Surfaces alternatives
  textPrimary: '#E8EAF0',       // Texte principal
  textSecondary: '#B4B8C5',     // Texte secondaire
  accent: '#8A5CF6',            // Accent primaire (violet)
  accentSecondary: '#22C55E',   // Validation (vert)
  alert: '#EF4444',             // Alertes (rouge)
  border: '#232634'             // Bordures/dividers
}
```

### Principes

- 🎭 **Dark-first** - Thème sombre par défaut
- ♿ **Accessible** - Contrastes AA+, labels ARIA, Dynamic Type
- 📐 **Rayons arrondis** - `rounded-2xl` (16px)
- 👆 **Touch targets** - Minimum 44×44px
- ✨ **Micro-interactions** - Scale, opacity, translate
- 📳 **Haptiques** - Retours tactiles légers

---

## 🚀 Installation & Lancement

### Prérequis

- **Node.js** ≥ 18.x
- **npm** ou **yarn**
- **Expo CLI** (installé automatiquement)
- **Expo Go** sur votre appareil mobile (iOS/Android)

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/SoinGabUnie.git
cd SoinGabUnie

# Installer les dépendances
npm install

# Lancer le projet
npm start
```

### Commandes disponibles

```bash
npm start          # Démarre le serveur Expo
npm run android    # Lance sur émulateur Android
npm run ios        # Lance sur simulateur iOS (macOS uniquement)
npm run web        # Lance version web (preview)
```

### Scanner le QR Code

1. Lancez `npm start`
2. Ouvrez **Expo Go** sur votre téléphone
3. Scannez le QR code affiché dans le terminal
4. L'application se charge automatiquement

---

## 📁 Structure du Projet

```
SoinGabUnie/
├── src/
│   ├── app/                    # Routes (expo-router)
│   │   ├── (tabs)/             # Navigation par onglets
│   │   │   ├── index.tsx       # 🏠 Accueil
│   │   │   ├── bookings.tsx    # 📅 Mes réservations
│   │   │   ├── favorites.tsx   # ❤️ Favoris
│   │   │   ├── messages.tsx    # 💬 Messages
│   │   │   └── _layout.tsx     # Layout des tabs
│   │   ├── booking/            # Flux de réservation
│   │   ├── category/           # Listes par catégorie
│   │   ├── provider/           # Détails prestataires
│   │   ├── splash.tsx          # 🌟 Splash screen
│   │   ├── onboarding.tsx      # 👋 Onboarding
│   │   └── _layout.tsx         # Root layout
│   │
│   ├── components/             # Composants réutilisables
│   │   ├── BookingForm.tsx
│   │   ├── DateTimePicker.tsx
│   │   ├── FilterChips.tsx
│   │   ├── Header.tsx
│   │   ├── LiquidCapsule.tsx   # Animation liquid tabs
│   │   ├── ProviderCard.tsx
│   │   ├── ScreenWrapper.tsx
│   │   ├── SearchAndSort.tsx
│   │   ├── ServiceGrid.tsx
│   │   └── ...
│   │
│   ├── stores/                 # État global Zustand
│   │   └── bookingStore.ts
│   │
│   ├── utils/                  # Utilitaires
│   │   ├── mockData.ts         # Données de mock
│   │   └── validation.ts       # Schémas Zod
│   │
│   ├── types/                  # Types TypeScript
│   │   └── index.ts
│   │
│   └── constants/              # Constantes
│       └── colors.ts
│
├── assets/                     # Images, fonts, Lottie
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── CLAUDE.md                   # Instructions IA
```

---

## 🧪 Développement

### Mode strict TypeScript

Le projet utilise TypeScript en mode strict (`"strict": true`). Aucun type `any` non justifié n'est autorisé.

### Validation avec Zod

Tous les formulaires et inputs/outputs sont validés avec Zod :

```typescript
import { z } from 'zod'

export const bookingSchema = z.object({
  name: z.string().min(2, 'Nom requis (2+ caractères)'),
  reason: z.string().min(5, 'Motif requis (5+ caractères)'),
  date: z.string().min(1, 'Date requise'),
  time: z.string().min(1, 'Heure requise')
})
```

### État global avec Zustand

```typescript
import { create } from 'zustand'

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, booking]
  }))
}))
```

### Animations avec Reanimated

Toutes les animations utilisent `react-native-reanimated` pour des performances natives :

```typescript
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated'

<Animated.View entering={FadeIn.duration(300)}>
  {/* contenu */}
</Animated.View>
```

---

## 🎯 Roadmap

### Phase 1 : MVP Frontend ✅ (Actuelle)

- [x] Design system dark theme
- [x] Navigation & routing
- [x] Écrans principaux (home, listes, détails)
- [x] Formulaire de réservation
- [x] Mock data & état local
- [x] Animations & micro-interactions

### Phase 2 : Authentification & Backend 🔜

- [ ] Intégration Clerk (auth)
- [ ] Configuration Supabase
- [ ] API endpoints (CRUD prestataires, réservations)
- [ ] Persistence des données
- [ ] Profil utilisateur

### Phase 3 : Features Avancées 🚀

- [ ] Paiements en ligne
- [ ] Géolocalisation & cartes
- [ ] Messagerie temps réel
- [ ] Notifications push
- [ ] Système de reviews
- [ ] Dashboard analytics

### Phase 4 : Production 📦

- [ ] Tests E2E
- [ ] Optimisations performances
- [ ] CI/CD
- [ ] Publication App Store & Play Store

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Forkez** le projet
2. Créez une **branche** : `git checkout -b feature/ma-feature`
3. **Committez** : `git commit -m 'Ajout de ma feature'`
4. **Pushez** : `git push origin feature/ma-feature`
5. Ouvrez une **Pull Request**

### Guidelines

- Suivre les conventions TypeScript strict
- Utiliser NativeWind pour le styling
- Valider les données avec Zod
- Ajouter des animations fluides (reanimated)
- Respecter le design system
- Écrire des commits clairs

---

## 📄 Licence

Ce projet est sous licence **MIT**.

---

## 👨‍💻 Auteur

**Davy Tardin**

---

## 📞 Contact & Support

Pour toute question ou suggestion :

- 📧 Email : [votre-email@exemple.com](mailto:votre-email@exemple.com)
- 🐛 Issues : [GitHub Issues](https://github.com/votre-username/SoinGabUnie/issues)

---

<div align="center">

**Fait avec ❤️ pour améliorer l'accès aux soins de santé au Gabon**

</div>
