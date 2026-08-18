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
dépendance React, entièrement testable en isolation. Sa structure et son
harnais de test sont en place (`__tests__/engine`). La règle arômes est
implémentée (voir `RULES.md#1-arômes`) ; les autres restent des stubs qui
renvoient `[]`, avec des tests `.todo` en attente. Fixtures Open Food Facts
réelles dans `src/fixtures/off/products` (voir son README) — 4 reçues pour
l'instant sur les 7 prévues, aucune ne contient d'arôme.

```bash
npm run measure:aromes   # taux de silence de la règle arômes sur les fixtures
```

## État d'avancement

Le projet avance par paliers (voir historique de commits) :

- [x] 1. Projet Expo, navigation, écrans vides, thème
- [x] 2. Scan de code-barres et appel Open Food Facts
- [ ] 3. Moteur de règles et ses tests (structure et harnais en place,
      logique en attente des fixtures réelles — voir `RULES.md`)
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
