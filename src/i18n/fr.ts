/**
 * Toutes les chaînes de l'application passent par ce fichier, même en
 * version française unique, pour ne pas avoir à les traquer dans le code
 * le jour d'une traduction.
 */
export const fr = {
  common: {
    comingSoon: 'Bientôt disponible',
  },
  tabs: {
    scan: 'Scanner',
    historique: 'Historique',
    profil: 'Profil',
  },
  onboarding: {
    title: 'Votre profil santé',
    intro:
      "Quelques questions pour adapter les lectures à votre situation. Rien n'est envoyé sur un serveur : tout reste sur votre téléphone.",
    skip: 'Passer',
    next: 'Suivant',
    steps: {
      age: 'Tranche d’âge',
      grossesse: 'Grossesse ou allaitement',
      allergies: 'Allergies et intolérances',
      vigilances: 'Vigilances déclarées',
      regime: 'Régime alimentaire',
      enfant: 'Enfant de moins de trois ans au foyer',
    },
  },
  scan: {
    title: 'Scanner un produit',
    placeholder: 'La caméra s’ouvrira ici.',
  },
  historique: {
    title: 'Historique',
    empty: 'Les produits que vous scannez apparaîtront ici.',
  },
  profil: {
    title: 'Profil',
    about: 'À propos',
  },
  produit: {
    introuvable: {
      title: 'Produit introuvable',
      description:
        'Ce produit n’est pas encore répertorié dans Open Food Facts.',
      contribute: 'Contribuer sur Open Food Facts',
    },
    avis: {
      title: 'Avis',
      similarProfiles: 'Avis de profils proches',
      widenedNotice:
        'Peu d’avis de profils proches pour ce produit : affichage élargi à tous les avis.',
      seeAll: 'Voir tous les avis',
    },
  },
  apropos: {
    title: 'À propos',
    attribution:
      'Données produits fournies par Open Food Facts, sous licence Open Database License (ODbL).',
  },
} as const;
