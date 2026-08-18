# Verso

Application mobile qui aide à choisir les produits alimentaires bio en croisant
leur composition avec un profil santé, et en donnant accès à des avis
d'utilisateurs au profil comparable. Ne remplace pas un avis médical ; l'étiquette
physique du produit fait foi.

## Stack

- Expo (workflow managé) + TypeScript strict
- expo-router (navigation par fichiers)
- Zustand (état global), TanStack Query (cache réseau)
- Supabase (auth anonyme + avis), expo-secure-store (profil santé, local uniquement)
- Vitest (tests du moteur de règles)
- Données produits : [Open Food Facts](https://world.openfoodfacts.org) (ODbL)

## Lancer le projet

```bash
npm install
npm run start      # ouvre Expo Dev Tools / QR code, Expo Go ou un simulateur
npm run ios        # simulateur iOS (macOS uniquement)
npm run android    # émulateur Android
npm run web        # aperçu navigateur
```

Nécessite Node 20+ et, pour les simulateurs natifs, Xcode ou Android Studio
installés localement (voir la [doc Expo](https://docs.expo.dev/get-started/set-up-your-environment/)).

## Tests

```bash
npm test          # exécute la suite une fois
npm run test:watch
```

Le moteur de règles (`src/engine`) est un module TypeScript pur, sans
dépendance React, entièrement testable en isolation. 10 règles sur 12 sont
implémentées — toutes sauf sucres déguisés et longueur de liste, encore des
stubs qui renvoient `[]` (voir `RULES.md`).

Fixtures Open Food Facts **réelles** dans `src/fixtures/off/products` (voir
son README) — 4 reçues pour l'instant sur les 7 prévues. Fixtures
**synthétiques**, construites à la main pour les cas encore manquants
(NOVA 4, huile de palme, non-bio), dans `src/fixtures/off/synthetic` — un
registre séparé, jamais lu par le mode mock de l'app ni par la mesure du
taux d'incertitude arômes, à comparer aux vraies fixtures équivalentes dès
qu'elles arriveront. `RULES.md` précise, règle par règle, ce qui est
couvert par donnée réelle, par fixture synthétique, ou encore `.todo` faute
des deux. `__tests__/engine/produitNonBio.test.ts` vérifie en plus, avec un
produit non-bio construit à la main, que le moteur se tait correctement en
dehors de son terrain.

```bash
npm run measure:aromes   # taux de silence de la règle arômes sur les fixtures
```

## État d'avancement

Le projet avance par paliers (voir historique de commits) :

- [x] 1. Projet Expo, navigation, écrans vides, thème
- [x] 2. Scan de code-barres et appel Open Food Facts
- [ ] 3. Moteur de règles et ses tests (10/12 règles implémentées ; sucres
      déguisés et longueur de liste restent des stubs — voir `RULES.md`)
- [ ] 4. Branchement du moteur sur la fiche produit
- [ ] 5. Onboarding et stockage local du profil
- [ ] 6. Filtrage des insights par profil
- [ ] 7. Supabase, authentification anonyme, table des avis
- [ ] 8. Avis segmentés
- [ ] 9. Historique, cache, mode hors ligne — **point d'attention découvert
      en récupérant les fixtures : Open Food Facts renvoie une page de
      blocage aux clients anonymes après quelques requêtes rapprochées.**
      Prévoir la gestion du 429, un cache local agressif, et un espacement
      des appels dans le client (`src/api/off.ts`) à cette étape.
- [ ] 10. Accessibilité, textes légaux, configuration EAS

Documentation complémentaire : [`RULES.md`](./RULES.md) (règles du moteur et
leurs sources), [`LEGAL.md`](./LEGAL.md) (attribution ODbL, RGPD, mentions
légales) — ajoutés au fil des paliers concernés.
