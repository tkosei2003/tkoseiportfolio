export type AboutEntryDirection = 'from-top' | 'from-bottom';

const ABOUT_ENTRY_DIRECTION_KEY = 'about-entry-direction';

export function setAboutEntryDirection(direction: AboutEntryDirection) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(ABOUT_ENTRY_DIRECTION_KEY, direction);
}

export function consumeAboutEntryDirection(): AboutEntryDirection {
  if (typeof window === 'undefined') return 'from-bottom';

  const storedDirection = window.sessionStorage.getItem(ABOUT_ENTRY_DIRECTION_KEY);
  window.sessionStorage.removeItem(ABOUT_ENTRY_DIRECTION_KEY);

  return storedDirection === 'from-top' ? 'from-top' : 'from-bottom';
}
