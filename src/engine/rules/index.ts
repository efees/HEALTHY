import type { Rule } from '../types';
import { aromeRule } from './aromes';
import { certificationRule } from './certification';
import { huileDePalmeRule } from './huileDePalme';
import { longueurListeRule } from './longueurListe';
import { origineRule } from './origine';
import { allergiesRule } from './profil/allergies';
import { diabeteRule } from './profil/diabete';
import { enfantRule } from './profil/enfant';
import { grossesseRule } from './profil/grossesse';
import { renalRule } from './profil/renal';
import { sucresDeguisesRule } from './sucresDeguises';
import { ultraTransformationRule } from './ultraTransformation';

/**
 * Registre unique composant toutes les règles. Ajouter une règle = créer son
 * fichier dans src/engine/rules (ou rules/profil), l'importer et l'ajouter
 * ici — rien d'autre à modifier pour qu'elle soit prise en compte par analyze().
 */
export const rules: Rule[] = [
  aromeRule,
  ultraTransformationRule,
  sucresDeguisesRule,
  huileDePalmeRule,
  certificationRule,
  origineRule,
  longueurListeRule,
  grossesseRule,
  renalRule,
  diabeteRule,
  allergiesRule,
  enfantRule,
];
