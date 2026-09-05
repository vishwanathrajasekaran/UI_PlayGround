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
  { code: 'FM', name: 'Forms', path: null, description: 'Login, registration, checkout, validation states.' },
  { code: 'SC', name: 'Selection Controls', path: null, description: 'Checkboxes, radios, dropdowns, multi-select.' },
  { code: 'AC', name: 'Advanced Controls', path: null, description: 'Date/time pickers, sliders, file upload & download.' },
  { code: 'TB', name: 'Tables', path: null, description: 'Static, dynamic, sortable, filterable, paginated.' },
  { code: 'NV', name: 'Navigation', path: null, description: 'Navbars, tabs, accordions, breadcrumbs, menus.' },
  { code: 'PO', name: 'Popups & Overlays', path: null, description: 'Alert, confirm, modal, tooltip, toast, popover.' },
  { code: 'MK', name: 'Mouse & Keyboard', path: null, description: 'Hover, drag & drop, right-click, key combos.' },
  { code: 'WN', name: 'Windows & iFrames', path: null, description: 'New tabs, new windows, nested iframes.' },
  { code: 'DB', name: 'Dynamic Behavior', path: null, description: 'AJAX, delayed elements, dynamic IDs, hidden elements.' },
  { code: 'AN', name: 'API / Network', path: null, description: 'Trigger requests, inspect responses, simulate failure.' },
  { code: 'AU', name: 'Authentication', path: null, description: 'Login/logout, session timeout, role-based access.' },
  { code: 'EC', name: 'E-Commerce', path: null, description: 'Full search → cart → checkout → order-history flow.' },
  { code: 'AD', name: 'Admin Portal', path: null, description: 'CRUD tables, exports, charts, role-gated screens.' },
  { code: 'LL', name: 'Locator Lab', path: null, description: 'Test CSS/XPath selectors live against the page.' },
  { code: 'TD', name: 'Test Data Lab', path: null, description: 'Generate names, emails, UUIDs, and random strings.' },
  { code: 'WS', name: 'Wait Strategies Lab', path: null, description: 'Immediate vs. delayed vs. animated elements.' },
  { code: 'CH', name: 'Automation Challenges', path: null, description: 'Beginner through expert graded exercises.' },
  { code: 'SP', name: 'Special Challenges', path: null, description: 'Shadow DOM, infinite scroll, flaky elements, races.' },
]
