// Single source of truth for the category catalog.
// `path: null` means "planned but not built yet" — it still renders in the
// sidebar/home grid (greyed out) so the full map of the app is always visible.
export const catalog = [
  {
    code: 'EL',
    name: 'Basic Elements',
    path: '/basic-elements',
    description: 'Textboxes, buttons, links, labels — the atoms of every locator strategy.',
  },
  { code: 'FM', name: 'Forms', path: '/forms', description: 'Login validation, dependent fields, reset behavior.' },
  { code: 'SC', name: 'Selection Controls', path: '/selection-controls', description: 'Checkboxes, radios, dropdowns, multi-select, toggle, autocomplete.' },
  { code: 'AC', name: 'Advanced Controls', path: '/advanced-controls', description: 'Date/time pickers, sliders, color picker, file upload & download.' },
  { code: 'TB', name: 'Tables', path: '/tables', description: 'Static, dynamic, sortable, filterable, paginated.' },
  { code: 'NV', name: 'Navigation', path: '/navigation', description: 'Navbars, tabs, accordions, breadcrumbs, menus.' },
  { code: 'PO', name: 'Popups & Overlays', path: '/popups', description: 'Alert, confirm, modal, tooltip, toast, popover.' },
  { code: 'MK', name: 'Mouse & Keyboard', path: '/mouse-keyboard', description: 'Hover, drag & drop, right-click, key combos.' },
  { code: 'WN', name: 'Windows & iFrames', path: '/windows-iframes', description: 'New tabs, new windows, nested iframes.' },
  { code: 'DB', name: 'Dynamic Behavior', path: '/dynamic-behavior', description: 'AJAX, delayed elements, dynamic IDs, hidden elements.' },
  { code: 'AN', name: 'API / Network', path: '/api-network', description: 'Trigger requests, inspect responses, simulate failure.' },
  { code: 'AU', name: 'Authentication', path: '/authentication', description: 'Login/logout, session timeout, role-based access.' },
  { code: 'EC', name: 'E-Commerce', path: '/ecommerce', description: 'Full search → cart → checkout → order-confirmation flow.' },
  { code: 'AD', name: 'Admin Portal', path: '/admin', description: 'Dashboard, users CRUD, bulk actions, confirmed settings toggle.' },
  { code: 'LL', name: 'Locator Lab', path: '/locator-lab', description: 'Test CSS/XPath selectors live against a sandbox DOM.' },
  { code: 'TD', name: 'Test Data Lab', path: '/test-data-lab', description: 'Generate names, emails, UUIDs, and random strings.' },
  { code: 'WS', name: 'Wait Strategies Lab', path: '/wait-strategies', description: 'Immediate vs. delayed vs. animated vs. polling elements.' },
  { code: 'CH', name: 'Automation Challenges', path: '/challenges', description: 'Beginner through expert graded checklist, linked to every sheet.' },
  { code: 'SP', name: 'Special Challenges', path: '/special-challenges', description: 'Shadow DOM, infinite scroll, virtualized list, stale elements, races.' },
]
