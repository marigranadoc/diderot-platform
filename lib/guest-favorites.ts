export const GUEST_FAVORITES_KEY = 'diderot:guest-favorites:v1';
export const GUEST_FAVORITES_CHANGED = 'diderot:guest-favorites-changed';

// This device's guest selection is independent of every authenticated account.
// Version the payload so a future format is never silently interpreted as this one.
export function readGuestFavorites(): {slugs: string[]; damaged: boolean} {
  const raw = window.localStorage.getItem(GUEST_FAVORITES_KEY);
  if (raw === null) return {slugs: [], damaged: false};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1 ||
        !('slugs' in value) || !Array.isArray(value.slugs) || value.slugs.length > 500 ||
        !value.slugs.every((slug: unknown) => typeof slug === 'string' && slug.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
      return {slugs: [], damaged: true};
    }
    return {slugs: [...new Set(value.slugs as string[])], damaged: false};
  } catch {
    return {slugs: [], damaged: true};
  }
}

export function toggleGuestFavorite(slug: string): string[] {
  // Read immediately before the write, rather than replacing another tab's list
  // using this component's potentially stale render state.
  const {slugs} = readGuestFavorites();
  const next = slugs.includes(slug) ? slugs.filter(item => item !== slug) : [...slugs, slug];
  if (next.length > 500) throw new Error('Guest favorite limit exceeded');
  window.localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify({version: 1, slugs: next}));
  window.dispatchEvent(new Event(GUEST_FAVORITES_CHANGED));
  return next;
}
