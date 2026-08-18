# RULES.md — Règles du moteur

Ce document liste, pour chaque règle prévue du moteur (`src/engine/rules/`) :
son déclencheur, sa source, et le texte type affiché à l'utilisatrice.

**Statut d'implémentation** : 10 règles sur 12 sont implémentées — toutes
sauf sucres déguisés (§3) et longueur de liste (§7), encore des stubs dans
`src/engine/rules/` qui renvoient `[]`.

Couverture de test par fixture réelle, règle par règle : arômes,
certification, origine, diabète et allergies sont bien couvertes en
positif par les 4 fixtures reçues. Ultra-transformation, huile de palme,
fonction rénale et enfant en bas âge n'ont pas (encore) de cas positif réel
— trois fixtures **synthétiques**, construites à la main et clairement
séparées du registre réel (`src/fixtures/off/synthetic/`, jamais utilisées
par le mode mock de l'app ni par la mesure du taux d'incertitude arômes),
couvrent une partie de ce manque en attendant les vraies. Grossesse reste
sans aucun cas positif, réel ou synthétique. Chaque section précise
exactement ce qui est testé sur donnée réelle, sur fixture synthétique, ou
encore `.todo`.

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

## Principe général : données contradictoires

Open Food Facts est alimenté par des contributeurs bénévoles. Quand deux
champs d'un même produit se contredisent — une origine déclarée « hors
Union européenne » alors que le lieu de fabrication est aux Pays-Bas
(§6, exemple réel du beurre de cacahuète), un Nutri-Score affiché qui ne
correspond pas au Nutri-Score recalculé, une catégorie qui ne correspond
pas aux ingrédients — **le moteur affiche la contradiction, il ne la
résout pas**. Aucune règle ne doit choisir arbitrairement quel champ
« a raison » ni masquer l'un des deux au profit de l'autre.

Deux raisons à ça, pas une seule commodité technique :

1. **On n'a aucune autorité pour trancher.** Contrairement à un champ
   calculé par Open Food Facts lui-même (Nutri-Score, Eco-Score, NOVA),
   une contradiction entre deux champs saisis par des contributeurs
   différents n'a pas de source faisant foi que le moteur puisse consulter.
   Deviner laquelle des deux valeurs est correcte serait aussi mal fondé
   qu'une devinette sur un mot mal orthographié dans un arôme — la même
   logique qu'à la règle 1 : le silence ou la transparence plutôt que
   l'affirmation non vérifiée.
2. **La contradiction elle-même est une information.** Une utilisatrice
   qui voit "origine hors UE, fabriqué aux Pays-Bas" apprend quelque chose
   de réel sur la fiabilité de la fiche produit qu'elle consulte — un
   signal utile, pas un bug à cacher. Lisser la contradiction pour
   présenter une fiche "propre" serait plus rassurant, mais moins honnête.

En pratique, une règle qui croise plusieurs champs (origine, mais aussi
toute règle future qui ferait de même) doit citer les champs en conflit
tels quels dans son texte, jamais réduire à un seul en ignorant l'autre.

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

### Ce que chaque label garantit réellement

| Tag OFF | Nature | Ce qu'il garantit |
|---|---|---|
| `en:eu-organic` | Officiel, réglementaire | Le logo Eurofeuille : conformité au règlement (UE) 2018/848 — au moins 95 % des ingrédients agricoles issus de l'agriculture biologique, pas d'OGM, contrôle annuel par un organisme certificateur accrédité. Le seul tag qui déclenche l'insight "certification officielle". |
| `fr:ab-agriculture-biologique` | Officiel, réglementaire | Le label français "AB". ⚠️ Avant l'harmonisation européenne (~2010), l'AB portait un cahier des charges propre, parfois plus strict que le futur règlement UE ; depuis, il est aligné sur le règlement européen et n'ajoute pas d'exigence supplémentaire vérifiée — mais je n'ai pas confirmé ce point précis contre un texte à jour, à vérifier avant de l'affirmer dans l'app. Déclenche le même insight que `en:eu-organic` : les deux sont traités comme équivalents dans le code. |
| `en:{pays}-{bio\|oko\|org}-{numéro}` (ex. `en:fr-bio-01`) | Métadonnée du certificateur | N'est pas un label en soi : identifie *qui* a contrôlé la conformité au règlement bio (ex. FR-BIO-01 = Ecocert France). Affiché en complément de la certification officielle, jamais seul. |
| `en:demeter` | Privé | Cahier des charges Demeter International (biodynamie) : pratiques allant au-delà du règlement bio européen (calendrier biodynamique, préparations spécifiques, certification à l'échelle de la ferme). ⚠️ Slug non vérifié sur une vraie fixture — voir plus bas. |
| `fr:nature-et-progres` | Privé | Fédération française antérieure à la réglementation bio officielle ; charte interne sans les dérogations que permet le règlement UE. ⚠️ Slug non vérifié. |
| `fr:bio-coherence` | Privé | Label créé par des producteurs français jugeant le règlement UE 2018/848 insuffisant sur certains points (ex. 100 % bio visé plutôt que le seuil de 95 %, ancrage local). ⚠️ Slug non vérifié. |

Les trois labels privés ci-dessus sont des repères généraux sur ce que ces
cahiers des charges visent à garantir, pas une lecture juridique de leur
contenu exact — à confirmer avec la documentation propre de chaque
organisme avant affichage, au même titre que les citations réglementaires
marquées ⚠️ ailleurs dans ce document.

**Labels rencontrés sur les fixtures actuelles qui ne sont volontairement
signalés par aucun insight de cette règle**, pour montrer où s'arrête son
périmètre : `en:certified-by-ecocert` (identifie l'organisme, déjà couvert
par le code certificateur), `en:certified-b-corporation`, `en:1-for-the-planet`,
`en:planet-score`, `en:the-vegan-society`, `en:nutriscore*`, `en:vegan`,
`en:vegetarian`, `en:no-added-sugar`, `en:no-palm-oil`, `en:triman`,
`fr:céréales-complètes` — aucun n'est une certification bio, et la règle
ne les traite pas comme telle.

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

**Sévérité** : `vigilance` — les règles déclenchées par le profil utilisent
ce niveau par défaut dans tout le moteur : c'est le sens même du champ
`vigilances` du profil, le plus personnellement pertinent pour
l'utilisatrice.

### Implémentation

`src/engine/rules/profil/grossesse.ts`. Détection par motif simple (mot ou
expression isolée dans `ingredients_text_fr` : `alcool`, `foie`/`abats`,
`lait cru`, `soja`, `caféine`) — pas la grammaire "de X" des arômes, risque
de faux positif nettement plus faible.

**Non testé en positif** : aucune fixture, réelle ou synthétique, ne
contient un de ces marqueurs — je n'en ai pas construit pour ce lot,
n'ayant reçu la consigne que pour NOVA 4 / huile de palme / non-bio. Marqué
`.todo` dans `__tests__/engine/profil.test.ts`.

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

**Sévérité** : `vigilance`.

### Implémentation

`src/engine/rules/profil/renal.ts`. Liste phosphatée explicite plutôt que
la plage brute "E338 à E452" : E338-E341, E343 (acide phosphorique et
phosphates), E450-E452 (di-, tri- et polyphosphates).

⚠️ **Seuils non validés** : sodium ≥ 0,3 g/100g, potassium ≥ 0,6 g/100g,
phosphore ≥ 0,3 g/100g sont des seuils heuristiques que j'ai choisis pour
ce prototype, pas des seuils cliniques établis — à faire réviser par un
professionnel de santé avant affichage dans l'app, au même titre que les
citations réglementaires marquées ⚠️ ailleurs dans ce document. Le code le
rappelle en commentaire à côté des constantes.

**Non testé en positif sur données réelles** : aucune des 4 fixtures
actuelles n'a de valeur `potassium_100g`/`phosphorus_100g` renseignée, et
aucune ne dépasse le seuil de sodium retenu. Testé sur la fixture
synthétique NOVA 4 (voir `src/fixtures/off/synthetic/`), à revalider dès
qu'une vraie fixture le permettra.

---

## 10. Profil — Diabète

**Catégorie** : `profil` · **Déclencheur profil** : `vigilances` inclut `glycemique`
**Déclencheur produit** : sucres pour 100g élevés, index glycémique des
ingrédients dominants.

**Source** : recommandation nutritionnelle générale — **pas de texte
réglementaire**.

**Texte type** : « Teneur en sucres de [x] g/100g. »

**Sévérité** : `vigilance`.

### Implémentation

`src/engine/rules/profil/diabete.ts`. Seuil retenu : sucres ≥ 15 g/100g.

⚠️ **Seuil non validé cliniquement**, même réserve que pour la règle
rénale (§9).

**Index glycémique des ingrédients dominants, prévu par le brief : non
implémenté.** Il demanderait une base de référence des index glycémiques
par ingrédient que le moteur n'a pas construite — mieux vaut ne rien
afficher que deviner un index à partir du nom d'un ingrédient.

Bien testé en positif sur données réelles : le biscuit Gerblé (16 g de
sucres/100g) dépasse le seuil, le yaourt Vrai (4,3 g/100g) reste en
dessous — aucune fixture synthétique nécessaire pour cette règle.

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

**Sévérité** : `vigilance`.

### Implémentation

`src/engine/rules/profil/allergies.ts`. Correspondance directe entre les 14
allergènes réglementaires (type `RegulatedAllergen`) et les tags Open Food
Facts (`en:gluten`, `en:crustaceans`, `en:eggs`, `en:fish`, `en:peanuts`,
`en:soybeans`, `en:milk`, `en:nuts`, `en:celery`, `en:mustard`,
`en:sesame-seeds`, `en:sulphur-dioxide-and-sulphites`, `en:lupin`,
`en:molluscs`). Distingue `allergens_tags` (présence confirmée, texte "Contient…")
de `traces_tags` (contamination possible, texte "Traces possibles de…") —
deux niveaux de certitude différents, jamais confondus dans le texte
affiché.

Bien testé en positif sur données réelles, la règle la mieux couverte du
lot : gluten et lait en allergène direct (Gerblé, yaourt Vrai), arachides
(beurre de cacahuète), lupin et graines de sésame en trace uniquement
(Gerblé, beurre de cacahuète). Aucune fixture synthétique nécessaire.

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

**Sévérité** : `vigilance`.

### Implémentation

`src/engine/rules/profil/enfant.ts`. Seuils retenus : sel ≥ 0,5 g/100g,
sucres *ajoutés* ≥ 10 g/100g — spécifiquement `added-sugars_100g`, jamais
`sugars_100g` (sucres totaux, y compris naturellement présents) en repli :
mieux vaut ne rien afficher si cette donnée précise manque que de
conflater deux notions différentes.

⚠️ **Seuils non validés cliniquement**, même réserve que les règles rénale
et diabète.

**Additifs déconseillés avant trois ans, prévus par le brief : non
implémentés.** Je n'ai pas de liste de référence vérifiée pour cette
tranche d'âge spécifique — l'inventer serait exactement le genre
d'approximation que ce projet cherche à éviter.

Testé en positif : sucres ajoutés sur donnée réelle (Gerblé, 15,23 g/100g,
`added-sugars_100g` — un champ que les fixtures actuelles renseignent
naturellement) ; sel uniquement sur fixture synthétique, aucune fixture
réelle ne dépassant le seuil retenu.

---

## Rappel des interdits absolus (toutes règles)

- Jamais « dangereux », « mauvais », « toxique », « à éviter ».
- Jamais de note globale sur un produit nommé.
- Toujours un fait sourcé et opposable, jamais une opinion non attribuée.
- Un avertissement visible rappelle que l'app ne remplace pas un avis
  médical ou diététique, et que l'étiquette physique fait foi.
