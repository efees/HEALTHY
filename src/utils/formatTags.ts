/**
 * Les tags Open Food Facts portent un préfixe de langue (`en:organic`,
 * `fr:france`). Formatage minimal pour la fiche produit brute — pas de
 * traduction, juste un affichage lisible.
 */
export function formatTagLabel(tag: string): string {
  const withoutPrefix = tag.includes(':') ? tag.split(':').slice(1).join(':') : tag;
  const spaced = withoutPrefix.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
