export function capitalizeFirst(text) {
  if (typeof text !== 'string') return text;
  const trimmed = text.trimStart();
  if (!trimmed) return text;
  return trimmed.charAt(0).toLocaleUpperCase('pt-BR') + trimmed.slice(1);
}
