# Fixtures Open Food Facts

Réponses de `GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json`,
**limitées aux champs listés dans `OFF_REQUESTED_FIELDS`** (`src/types/openFoodFacts.ts`)
— les mêmes que ceux demandés en production via le paramètre `fields=`. L'enveloppe
`{ code, status, status_verbose, product }` est conservée, mais `product` est réduit
à ce sous-ensemble : la réponse brute complète d'Open Food Facts fait plusieurs
milliers de lignes par produit (scores par pays, historique d'éditeurs, tailles
d'image…), inutiles ici et coûteuses à garder en repo. Ce choix rend aussi la
fixture fidèle à ce que l'app reçoit réellement, puisque le client n'appelle
jamais l'API sans `fields=`.

Cette couche sert deux usages avec les mêmes fichiers :

1. **Mode mock de l'app** (`src/api/off.ts`), actif quand `EXPO_PUBLIC_USE_FIXTURES=true` —
   utile quand l'API réelle n'est pas joignable (réseau restreint, développement hors ligne).
2. **Fixtures des tests du moteur de règles** (étape 3, `__tests__/engine`), qui importent
   directement `offFixtureList` pour tourner sur des produits réels plutôt que des objets
   inventés à la main.

## Ajouter une fixture

1. Récupérer le JSON complet (navigateur ou `curl`).
2. Le réduire aux champs de `OFF_REQUESTED_FIELDS`, en conservant l'enveloppe
   `{ code, status, status_verbose, product }`, et l'enregistrer dans
   `src/fixtures/off/products/<barcode>.json`.
3. Dans `index.ts`, ajouter l'import et l'entrée correspondante dans `offFixtures`
   (Metro ne supporte pas les `require` dynamiques, la liste est donc statique et
   maintenue à la main — voir le commentaire en tête du fichier).

## Composition recherchée (≈5 à 10 produits)

Un jeu volontairement varié, choisi pour faire réagir des règles différentes du
moteur à l'étape 3. État au dernier lot reçu (4 produits) :

- [x] produit simple, liste d'ingrédients courte — `3760020507350` (beurre de
      cacahuète, NOVA 1, un seul ingrédient)
- [x] produit sans origine déclarée — `3175681272958` (`origins_tags` vide et
      `manufacturing_places` vide, seul le pays de vente est connu)
- [ ] produit ultra-transformé (NOVA 4) — aucun des 4 reçus n'est NOVA 4
      (3, 3, 3, 1)
- [ ] produit avec arôme (« arôme naturel de X » vs « arôme naturel » seul) —
      **aucun des 4 reçus ne contient la mention « arôme »** ; la règle arômes
      n'a encore jamais été exercée sur une vraie fixture
- [ ] produit avec huile de palme — les 4 reçus sont tous `palm-oil-free`
- [ ] produit avec beaucoup d'additifs texturants (crème végétale, dessert) —
      non couvert (2 additifs seulement sur le lot, des agents levants, pas
      des texturants)
- [ ] produit non bio, pour vérifier que le moteur se comporte correctement
      hors de son terrain — **les 4 reçus sont tous certifiés bio** ; aucun
      cas de contrôle "hors terrain" pour l'instant
