// Keyboard utilities for better navigation and accessibility

export type KeyboardAction = 'new-venture' | 'log-event' | 'modify' | 'search' | 'focus' | 'escape' | 'help' | 'export' | 'tasks';

export interface KeyBinding {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export const DEFAULT_KEY_BINDINGS: Record<KeyboardAction, KeyBinding> = {
  'new-venture': { key: 'n', ctrlKey: true },
  'log-event': { key: 'e', ctrlKey: true },
  'modify': { key: 'm', ctrlKey: true },
  'search': { key: 'k', ctrlKey: true },
  'focus': { key: 'f', ctrlKey: true },
  'escape': { key: 'Escape' },
  'help': { key: '?', shiftKey: true },
  'export': { key: 's', ctrlKey: true, shiftKey: true },
  'tasks': { key: 't', ctrlKey: true },
};

export const matchesKeyBinding = (event: KeyboardEvent, binding: KeyBinding): boolean => {
  return (
    event.key === binding.key &&
    event.ctrlKey === (binding.ctrlKey || false) &&
    event.shiftKey === (binding.shiftKey || false) &&
    event.altKey === (binding.altKey || false)
  );
};

export const isInputFocused = (): boolean => {
  const element = document.activeElement;
  if (!element) return false;

  const tag = element.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select';
};

export const trapFocus = (container: HTMLElement | null, event: KeyboardEvent) => {
  if (!container || event.key !== 'Tab') return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
};

export const focusFirstButton = (container: HTMLElement | null) => {
  const button = container?.querySelector('button') as HTMLButtonElement;
  button?.focus();
};

export const focusTrap = (element: HTMLElement) => {
  element.addEventListener('keydown', (e) => trapFocus(element, e as KeyboardEvent));
};
