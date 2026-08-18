# Fixtures synthétiques

**Ce ne sont pas de vraies réponses Open Food Facts.** Construites à la
main, faute d'avoir encore reçu de vraie fixture pour ces trois cas : un
produit NOVA 4, un produit avec huile de palme, un produit non-bio. Basées
sur des structures OFF réalistes (mêmes champs, mêmes conventions de tags
que les fixtures réelles de `src/fixtures/off/products`), mais les valeurs
elles-mêmes sont inventées.

**Registre séparé, volontairement.** `offSyntheticFixtures` /
`offSyntheticFixtureList` (`./index.ts`) ne sont **jamais** fusionnés avec
`offFixtures` / `offFixtureList` du registre réel :

- Le mode mock de l'app (`src/api/off.ts`) ne lit que le registre réel —
  un scan ne doit jamais tomber par accident sur un produit inventé.
- La mesure du taux d'incertitude arômes (`scripts/measure-arome-uncertainty.ts`)
  ne doit compter que de vraies données.
- Les tests qui s'appuient sur ces fixtures le disent explicitement dans
  leur description ("sur fixture synthétique").

**À remplacer, pas à conserver indéfiniment.** Quand une vraie fixture
équivalente arrive, comparer ses valeurs à la fixture synthétique
correspondante avant de la remplacer : un écart important entre ce qui a
été supposé ici et la réalité est une information sur ce que le moteur
présumait à tort.

Codes-barres fictifs (`999999999999x`), choisis pour ne jamais coïncider
avec un vrai EAN ni avec les codes réservés « produit absent »
(`OFF_FIXTURE_NOT_FOUND_BARCODES` dans `../index.ts`).

| Fichier | Cas couvert | Points notables |
|---|---|---|
| `9999999999991.json` | NOVA 4 | Barre céréalière bio ultra-transformée. Additif texturant par tag (E410) et par texte (maltodextrine) en bonus. Sodium, potassium, phosphore et un additif phosphaté (E451) volontairement élevés, ainsi que les sucres (32 g/100g), pour couvrir aussi les règles de profil rénal/diabète — aucune fixture réelle actuelle n'a de valeur potassium/phosphore du tout. |
| `9999999999992.json` | Huile de palme | Sablés bio, NOVA 3 (distinct du cas NOVA 4 ci-dessus). |
| `9999999999993.json` | Non-bio | Aucun label bio. Sert de produit de contrôle pour vérifier que le moteur ne suppose pas un contexte bio implicite — voir aussi `__tests__/engine/produitNonBio.test.ts`, qui utilise un objet minimal distinct de cette fixture. |
