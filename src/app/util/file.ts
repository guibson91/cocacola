/**
 * Retorno em MB de um base64
 */
export const base64Size = (base64String: string): number => {
  const padding = (base64String.match(/(=*$)/) || [""])[0].length; // Captura o padding, que são os caracteres '=' no final
  const totalSize = (base64String.length * 3) / 4; // Cada 4 caracteres representam 3 bytes
  return Math.round(((totalSize - padding) / 1000) * 10) / 10;
};
