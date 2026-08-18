# Fixtures Open Food Facts

Réponses JSON réelles de `GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json`,
enregistrées telles quelles (l'enveloppe complète `{ code, status, status_verbose, product }`,
pas seulement `product`).

Cette couche sert deux usages avec les mêmes fichiers :

1. **Mode mock de l'app** (`src/api/off.ts`), actif quand `EXPO_PUBLIC_USE_FIXTURES=true` —
   utile quand l'API réelle n'est pas joignable (réseau restreint, développement hors ligne).
2. **Fixtures des tests du moteur de règles** (étape 3, `__tests__/engine`), qui importent
   directement `offFixtureList` pour tourner sur des produits réels plutôt que des objets
   inventés à la main.

## Ajouter une fixture

1. Enregistrer le JSON dans `src/fixtures/off/products/<barcode>.json`.
2. Dans `index.ts`, ajouter l'import et l'entrée correspondante dans `offFixtures`
   (Metro ne supporte pas les `require` dynamiques, la liste est donc statique et
   maintenue à la main — voir le commentaire en tête du fichier).

## Composition recherchée (≈5 à 10 produits)

Un jeu volontairement varié, choisi pour faire réagir des règles différentes du
moteur à l'étape 3 : un produit ultra-transformé (NOVA 4), un produit simple à
liste d'ingrédients courte, un produit avec arôme (« arôme naturel de X » vs
« arôme naturel » seul), un produit sans origine déclarée, et si possible un
produit avec huile de palme ou sucres déguisés (sirop de glucose, jus concentré…).
