# RULES.md — Règles du moteur

Ce document liste, pour chaque règle prévue du moteur (`src/engine/rules/`) :
son déclencheur, sa source, et le texte type affiché à l'utilisatrice.

**Statut d'implémentation** : arômes (§1), ultra-transformation (§2), huile
de palme (§4), certification (§5) et origine (§6) sont implémentées.
Sucres déguisés (§3), longueur de liste (§7) et les règles de profil
(§8-12) restent des stubs dans `src/engine/rules/` qui renvoient `[]`. Sur
les 5 règles implémentées, seules arômes, certification et origine ont une
couverture de test **positive** par fixture réelle — ultra-transformation
et huile de palme n'ont, pour l'instant, que 4 fixtures qui ne les
déclenchent jamais (aucune n'est NOVA 4, aucune ne contient d'huile de
palme) : leurs tests de détection positive sont explicitement marqués
`.todo` plutôt que de passer par absence de cas, voir chaque section.

## Avertissement sur les sources citées ici

Je n'ai pas accès à un service de vérification juridique en temps réel
depuis cet environnement, et je n'ai pas vérifié les numéros d'article cités
ci-dessous contre le texte consolidé en vigueur sur EUR-Lex. Quand je suis
raisonnablement confiant sur un numéro de règlement, je le cite. Quand je ne
le suis pas au niveau de l'article ou de l'annexe précis, je le marque
explicitement **⚠️ à vérifier** plutôt que d'inventer un numéro. **Aucune
citation marquée ⚠️ ne doit être affichée dans l'application avant
vérification par vous ou un juriste**, contre le texte en vigueur au moment
de la mise en production — les règlements européens sont modifiés par actes
délégués et il faut vérifier la version consolidée, pas une version
historique.

Je distingue aussi quatre natures de source, pas toutes de même poids :

- **Réglementaire** : texte de loi européen, opposable.
- **Méthodologique** : classification scientifique publiée (NOVA), reprise
  telle quelle par Open Food Facts — pas un texte de loi.
- **Recommandation sanitaire** : avis d'une autorité de santé (ANSES, Santé
  publique France) — une recommandation, pas une obligation légale pour un
  produit alimentaire générique.
- **Heuristique éditoriale** : choix de conception propre à Verso, sans
  source externe — à présenter comme tel dans l'app, jamais comme une norme.

---

## 1. Arômes

**Catégorie** : `arome`
**Déclencheur** : `ingredients_text_fr` contient un arôme dont la mention ne
nomme pas sa source à 95 % — « arôme naturel » seul, ou « arôme naturel goût
X » — par opposition à « arôme naturel de X ».

**Source** :
- Règlement (UE) 2018/848 (production biologique) : restreint les arômes
  utilisables en bio aux arômes naturels au sens du règlement (CE)
  n° 1334/2008.
- Règlement (CE) n° 1334/2008 relatif aux arômes : c'est ce texte, et non le
  2018/848, qui définit la règle du seuil de 95 % pour l'appellation
  « arôme naturel de X » (article 16, de mémoire).

⚠️ **À vérifier** : le paragraphe exact de l'article 16 (16.2 vs 16.4), et
l'annexe du règlement 2018/848 qui renvoie précisément à cette définition
dans le texte consolidé actuel. Le brief initial du projet ne citait que le
2018/848 pour cette règle ; je pense que la référence pertinente pour le
seuil des 95 % est en réalité le 1334/2008, mais cela reste à confirmer
avant affichage.

**Sévérité** : `attention`.

**Texte type** : « Cet ingrédient est étiqueté « arôme naturel [goût X / sans
source nommée] ». La mention « arôme naturel de [ingrédient] » impliquerait
qu'au moins 95 % de l'arôme provient de cette source nommée. »

### Implémentation : le doute reste silencieux

C'est la règle la plus délicate du moteur : elle repose sur du parsing de
langue naturelle dans un champ libre (`ingredients_text_fr`), pas sur des
tags structurés — fautes de frappe, casse aléatoire, mentions multiples dans
une même liste (« arôme naturel de citron et autres arômes naturels »).

Elle est donc isolée en module dédié, avec sa propre batterie de tests,
séparé de la règle qui en consomme le résultat :

- `src/engine/rules/aromes/parser.ts` — classe chaque mention détectée en
  `conforme` / `non-conforme` / `incertain`. Testé isolément dans
  `__tests__/engine/aromes.parser.test.ts` (22 cas : accents/casse, pluriel,
  contraction « d' », mentions multiples, sources coordonnées, structures
  non reconnues).
- `src/engine/rules/aromes/index.ts` — la règle elle-même : n'émet un
  insight que pour les mentions `non-conforme`, **et seulement si aucune
  mention du produit n'est `incertaine`** — une seule ambiguïté suffit à
  faire taire toute la règle pour ce produit, pas seulement la mention
  concernée : un signalement partiel donnerait une impression de certitude
  que le moteur n'a pas. Testée dans `__tests__/engine/aromes.test.ts`.

Un faux positif sur cette règle est une accusation de non-conformité contre
une marque nommée — plus grave qu'un faux négatif. Quand le parser ne peut
pas classer une clause avec confiance, il retourne `incertain`, et la règle
ne dit rien : le silence est toujours préférable au doute affiché.

Sources coordonnées sous un seul « de » (« arôme naturel de citron et de
gingembre », « de citron, mandarine et bergamote ») sont des formulations
conformes et fréquentes — le parser les classe `incertain` plutôt que de ne
vérifier que la première source et affirmer à tort la conformité de
l'ensemble. Limites connues, assumées (voir les commentaires du fichier) :
il tolère l'absence d'accent circonflexe mais pas les autres fautes de
frappe, et une virgule ordinaire suivie d'un mot sans rapport contenant
fortuitement un « et » (« arôme naturel de citron, poivre et sel ») peut
aussi déclencher `incertain` à tort — un excès de silence, jamais un excès
d'accusation.

### Mesurer le taux de silence

Le compromis « on préfère se taire » n'a de sens que si le silence reste
rare. `src/engine/rules/aromes/instrumentation.ts` fournit un compteur
désactivé par défaut (aucun coût, aucun effet en production) :
`enableAromeParserInstrumentation()`, puis `getAromeParserStats()` (par
verdict, et par raison pour les `incertain`) et
`getAromeUncertaintyRate()` — la part des produits *ayant au moins une
mention d'arôme* où la règle s'est tue à cause du doute, hors produits sans
arôme du tout. À activer dans un script tournant sur les fixtures réelles,
puis sur de vrais scans, une fois disponibles : si ce taux est élevé (60 %
a été cité comme alarmant), le parser doit être repris, pas juste surveillé. Testé dans `__tests__/engine/aromes.instrumentation.test.ts`.

---

## 2. Ultra-transformation

**Catégorie** : `transformation`
**Déclencheur** : `nova_group === 4`, ou présence dans `ingredients_text_fr`
d'un marqueur de texture : gomme xanthane (E415), guar (E412), caroube
(E410), pectine (E440), inuline, fibre d'acacia, maltodextrine.

**Source** :
- NOVA n'est **pas un texte réglementaire, pas une norme officielle** :
  c'est une classification scientifique développée par l'équipe du
  professeur Carlos Monteiro, Université de São Paulo (Brésil), reprise par
  Open Food Facts. Le nommer explicitement dans le texte affiché évite de
  laisser croire à une autorité réglementaire qu'elle n'a pas.
- Le statut des additifs texturants relève du règlement (CE) n° 1333/2008
  sur les additifs alimentaires.

**Texte type** : « Classé NOVA 4 (aliment ultra-transformé) selon la
classification NOVA, développée par l'Université de São Paulo (équipe
Monteiro) et reprise par Open Food Facts — ce n'est pas une norme
officielle. Contient [additif texturant, ex. gomme xanthane (E415)], un
additif autorisé en bio. Source : classification NOVA (Monteiro et al.,
Université de São Paulo) ; règlement (CE) n° 1333/2008 pour le statut de
l'additif. »

**Sévérité** : `attention`.

### Implémentation

`src/engine/rules/ultraTransformation.ts`. Le NOVA se lit directement sur
`nova_group` (entier fourni par OFF, rien à interpréter). Les additifs
texturants avec code E (E415, E412, E410, E440) se lisent sur
`additives_tags` — donnée structurée, pas de texte libre à parser,
contrairement aux arômes. Inuline, fibre d'acacia et maltodextrine n'ont
pas de code E dans le vocabulaire OFF : recherche par mot isolé dans
`ingredients_text_fr` (`\binuline\b` etc.), un motif nettement plus simple
et moins risqué que la grammaire "de X" des arômes.

**Non testé en positif** : les 4 fixtures actuelles sont NOVA 3, 3, 3, 1 —
aucune n'est NOVA 4 — et aucune ne contient de marqueur de texture. Les cas
de détection positive sont marqués `.todo` dans
`__tests__/engine/ultraTransformation.test.ts` plutôt que validés par
absence ; seule l'absence de faux positif sur les fixtures actuelles est
testée pour de vrai.

---

## 3. Sucres déguisés

**Catégorie** : `sucre`
**Déclencheur** : présence dans `ingredients_text_fr` de sirop de glucose
(bio ou non), jus concentré de pomme ou de raisin, sirop d'agave, dextrose.

**Source** : **aucune** — constat nutritionnel, pas un texte réglementaire.
Ne pas citer de règlement pour cette règle. C'est un repère de lecture, pas
une règle de conformité : le texte affiché doit le refléter, pas laisser
croire à une infraction.

**Texte type** : « Repère de lecture — contient [sirop de glucose bio / jus
concentré de pomme…], une source de sucres ajoutés même en filière
biologique. La certification bio ne porte pas sur la teneur en sucre du
produit. »

---

## 4. Huile de palme

**Catégorie** : `transformation`
**Déclencheur** : `ingredients_analysis_tags` contient `en:palm-oil`.

**Source** : tag calculé automatiquement par Open Food Facts à partir de la
liste d'ingrédients — **pas un texte réglementaire**. Repère de lecture, pas
une règle de conformité.

**Texte type** : « Repère de lecture — contient de l'huile de palme,
identifiée par Open Food Facts dans la liste d'ingrédients. »

**Sévérité** : `attention`.

### Implémentation

`src/engine/rules/huileDePalme.ts`. Lecture directe du tag `en:palm-oil`
dans `ingredients_analysis_tags` — donnée structurée, pas de texte à
interpréter.

**Non testé en positif** : les 4 fixtures actuelles sont toutes
`palm-oil-free`. Le cas de détection positive est marqué `.todo` dans
`__tests__/engine/huileDePalme.test.ts` ; seule l'absence de faux positif
sur les fixtures actuelles est testée pour de vrai.

---

## 5. Certification

**Catégorie** : `certification`
**Déclencheur** : lecture de `labels_tags`.

**Source** :
- Eurofeuille / AB : règlement (UE) 2018/848 (production biologique
  européenne) — label officiel.
- Demeter, Nature et Progrès, Bio Cohérence : **cahiers des charges
  privés**, pas des textes réglementaires. Source à citer : le cahier des
  charges de l'organisme lui-même, jamais un règlement.

**Texte type (certification officielle)** : « Certifié agriculture
biologique (Eurofeuille), sous contrôle de l'organisme [code, ex.
FR-BIO-01]. Source : règlement (UE) 2018/848. »

**Texte type (label privé)** : « Porte le label [Demeter / Nature et Progrès
/ Bio Cohérence], un cahier des charges privé, distinct de la certification
bio officielle. Source : cahier des charges [organisme]. »

**Sévérité** : `info`.

### Implémentation

`src/engine/rules/certification.ts`. Liste fermée de tags connus
(`en:eu-organic`, `fr:ab-agriculture-biologique` pour l'officiel) plutôt
qu'un balayage large de `labels_tags` — volontaire : un label sans rapport
avec le bio (nutriscore, vegan society, planet score, b-corp… tous observés
sur les fixtures actuelles) ne doit jamais être confondu avec une
certification. Le code de l'organisme certificateur est extrait par motif
(`xx-bio-nn` / `xx-öko-nn` / `xx-org-nn`), calibré sur quatre formats
réellement observés : FR-BIO-01, DE-ÖKO-001, GB-ORG-05, NL-BIO-01 — un
produit peut en cumuler plusieurs (le muesli Bjorg en porte deux, le beurre
de cacahuète aussi).

Bien testé en positif : les 4 fixtures actuelles couvrent le cas "aucun
code" (Gerblé), un code (Vrai), et deux codes (Bjorg, beurre de cacahuète).

**Non testé en positif** : les slugs `en:demeter`, `fr:nature-et-progres`,
`fr:bio-coherence` pour les labels privés sont une estimation, pas
vérifiés contre une vraie fixture — une des trois fixtures encore
attendues doit permettre de les confirmer. Une erreur de slug ici échoue en
silence (aucun insight), jamais par une fausse classification. Marqué
`.todo` dans `__tests__/engine/certification.test.ts`.

---

## 6. Origine

**Catégorie** : `origine`
**Déclencheur** : croisement de `origins_tags`, `manufacturing_places` et
`countries_tags` ; signale explicitement l'absence ou le flou de l'origine
des matières premières.

**Source** : le règlement (UE) 2018/848 impose une indication d'origine des
matières premières agricoles pour les produits bio (mentions « Agriculture
UE » / « Agriculture non UE » / pays).

⚠️ **À vérifier** : je n'ai pas le numéro d'article précis, dans le texte
consolidé actuel de 2018/848, pour cette obligation. Elle provenait
historiquement de l'article 24 du règlement (CE) n° 834/2007, remplacé par
2018/848 depuis janvier 2022 — le renvoi exact dans le nouveau texte reste à
confirmer avant affichage.

**Texte type** : « L'origine des matières premières n'est pas précisée pour
ce produit (seul le pays de vente, [pays], est renseigné). »

**Sévérité** : `attention` (origine absente), `info` (origine déclarée de
façon large).

### Implémentation

`src/engine/rules/origine.ts`. Distingue une origine précise (un pays réel
dans `origins_tags`) d'un agrégat réglementaire flou (`en:european-union`,
`en:non-european-union`, `en:european-union-and-non-european-union`,
`en:unknown`) — ce dernier n'est pas la même chose qu'une absence totale de
donnée, d'où deux textes différents plutôt qu'un seul.

Bien testé en positif : les 4 fixtures actuelles couvrent les trois cas —
absente (Gerblé, aucune donnée d'origine), floue (le muesli Bjorg, agrégat
UE/hors UE avec lieu de fabrication en Allemagne), précise donc silencieuse
(le yaourt Vrai, France). Le beurre de cacahuète est un bon exemple de
données réelles pas parfaitement cohérentes : origine déclarée "hors UE"
mais fabriqué aux Pays-Bas (UE) — la règle rapporte les deux faits tels
quels sans trancher la contradiction apparente, ce n'est pas son rôle.

---

## 7. Longueur de liste

**Catégorie** : `transformation`
**Déclencheur** : plus de huit ingrédients dans `ingredients_text_fr`, ou
présence d'un ingrédient jugé absent d'une cuisine domestique (liste de
référence à construire lors de l'implémentation).

**Source** : **aucune** — heuristique éditoriale interne à Verso. À
présenter dans l'app comme un choix de lecture, pas comme une norme
extérieure ni une règle de conformité.

**Texte type** : « Repère de lecture — ce produit compte [N] ingrédients.
Au-delà de huit, ou en présence d'ingrédients peu courants en cuisine
domestique, c'est un signe d'industrialisation du produit. »

---

## 8. Profil — Grossesse

**Catégorie** : `profil` · **Déclencheur profil** : `grossesseOuAllaitement === true`
**Déclencheur produit** : alcool, foie/abats, fromages au lait cru, soja
(phytoestrogènes), caféine dans les ingrédients.

**Source** : recommandation de santé publique (ANSES, Santé publique
France) — **pas un texte réglementaire contraignant** pour le produit
alimentaire lui-même.

⚠️ **À vérifier** : je n'ai pas de référence précise (numéro d'avis, année,
document) à citer avec certitude pour chacun de ces points. À sourcer avec
un document ANSES ou Santé publique France réel et daté avant affichage —
ne pas inventer de référence.

**Texte type** : « Contient de l'alcool. Les recommandations de santé
publique préconisent de l'éviter pendant la grossesse. Source : [ANSES /
Santé publique France — référence précise à compléter]. »

---

## 9. Profil — Fonction rénale

**Catégorie** : `profil` · **Déclencheur profil** : `vigilances` inclut `renale`
**Déclencheur produit** : sodium, potassium, phosphore élevés (`nutriments`),
ou additif phosphaté détecté.

**Source** : recommandation diététique générale pour le lien
sodium/potassium/phosphore et suivi rénal — **pas de texte réglementaire
spécifique**. Le statut de l'additif phosphaté relève du règlement (CE)
n° 1333/2008.

Note d'implémentation : le brief indique la plage « E338 à E452 » pour les
additifs phosphatés — cette plage n'est pas strictement composée que de
phosphates (elle contient aussi d'autres familles d'additifs). Il faudra une
liste précise des E-numbers phosphatés au moment de coder la règle, pas la
plage brute.

**Texte type** : « Teneur en sodium de [x] g/100g. Une vigilance
fréquemment recommandée en cas de suivi de la fonction rénale. »

---

## 10. Profil — Diabète

**Catégorie** : `profil` · **Déclencheur profil** : `vigilances` inclut `glycemique`
**Déclencheur produit** : sucres pour 100g élevés, index glycémique des
ingrédients dominants.

**Source** : recommandation nutritionnelle générale — **pas de texte
réglementaire**.

**Texte type** : « Teneur en sucres de [x] g/100g. »

---

## 11. Profil — Allergies

**Catégorie** : `profil` · **Déclencheur profil** : `allergies` non vide
**Déclencheur produit** : croisement de `allergens_tags` et `traces_tags`
avec les allergies déclarées.

**Source** : règlement (UE) n° 1169/2011 (information des consommateurs sur
les denrées alimentaires, dit « INCO »), annexe II, qui liste les quatorze
allergènes à déclaration obligatoire. Confiance raisonnable sur ce texte et
cette annexe — référence bien établie.

⚠️ **À vérifier** malgré tout : que l'annexe II n'a pas été renumérotée par
une modification ultérieure du règlement, dans le texte consolidé en
vigueur au moment de la mise en production.

**Texte type** : « Contient du/des [allergène]. Vous avez déclaré une
allergie à [allergène] dans votre profil. Source : règlement (UE)
n° 1169/2011, annexe II (liste des allergènes à déclaration obligatoire). »

---

## 12. Profil — Enfant en bas âge

**Catégorie** : `profil` · **Déclencheur profil** : `enfantMoinsDeTroisAns === true`
**Déclencheur produit** : sel, sucres ajoutés, additifs déconseillés avant
trois ans.

**Source** : recommandations de santé publique (PNNS, ANSES) pour
l'alimentation du jeune enfant — **pas un texte réglementaire contraignant**
pour un produit alimentaire générique (à distinguer du règlement (UE)
n° 609/2013, qui encadre spécifiquement les aliments pour nourrissons et
enfants en bas âge — un régime réglementaire différent, pas nécessairement
applicable à un produit « adulte » scanné dans l'app).

⚠️ **À vérifier** : référence précise (document, année) à compléter avant
affichage.

**Texte type** : « Teneur en sel de [x] g/100g. Les repères nutritionnels
pour les enfants de moins de trois ans recommandent de limiter les apports
en sel. Source : [PNNS / ANSES — référence précise à compléter]. »

---

## Rappel des interdits absolus (toutes règles)

- Jamais « dangereux », « mauvais », « toxique », « à éviter ».
- Jamais de note globale sur un produit nommé.
- Toujours un fait sourcé et opposable, jamais une opinion non attribuée.
- Un avertissement visible rappelle que l'app ne remplace pas un avis
  médical ou diététique, et que l'étiquette physique fait foi.
