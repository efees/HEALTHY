import { describe, it } from 'vitest';

/**
 * En attente des fixtures réelles et de la logique des règles de profil
 * (RULES.md#8-profil-grossesse à #12-profil-enfant-en-bas-âge). Cas à couvrir :
 */
describe('règles déclenchées par le profil', () => {
  describe('grossesse', () => {
    it.todo('signale alcool, foie/abats, fromages au lait cru, soja, caféine');
    it.todo('ne se déclenche que si grossesseOuAllaitement === true');
  });

  describe('fonction rénale', () => {
    it.todo('signale sodium, potassium, phosphore élevés');
    it.todo('signale les additifs phosphatés');
    it.todo('ne se déclenche que si "renale" fait partie des vigilances');
  });

  describe('diabète', () => {
    it.todo('signale les sucres élevés pour 100g');
    it.todo('ne se déclenche que si "glycemique" fait partie des vigilances');
  });

  describe('allergies', () => {
    it.todo('croise allergens_tags avec les allergies déclarées');
    it.todo('croise traces_tags avec les allergies déclarées');
    it.todo('ne signale rien pour une allergie non déclarée dans le profil');
  });

  describe('enfant de moins de trois ans', () => {
    it.todo('signale sel, sucres ajoutés, additifs déconseillés avant trois ans');
    it.todo('ne se déclenche que si enfantMoinsDeTroisAns === true');
  });
});
