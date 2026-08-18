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

Vitest et les tests du moteur de règles (`src/engine`, fixtures dans
`__tests__/engine`) arrivent à l'étape 3 de la construction (voir plus bas).

## État d'avancement

Le projet avance par paliers (voir historique de commits) :

- [x] 1. Projet Expo, navigation, écrans vides, thème
- [ ] 2. Scan de code-barres et appel Open Food Facts
- [ ] 3. Moteur de règles et ses tests
- [ ] 4. Branchement du moteur sur la fiche produit
- [ ] 5. Onboarding et stockage local du profil
- [ ] 6. Filtrage des insights par profil
- [ ] 7. Supabase, authentification anonyme, table des avis
- [ ] 8. Avis segmentés
- [ ] 9. Historique, cache, mode hors ligne
- [ ] 10. Accessibilité, textes légaux, configuration EAS

Documentation complémentaire : [`RULES.md`](./RULES.md) (règles du moteur et
leurs sources), [`LEGAL.md`](./LEGAL.md) (attribution ODbL, RGPD, mentions
légales) — ajoutés au fil des paliers concernés.
