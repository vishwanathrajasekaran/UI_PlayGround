const PATHS = {
  arrow: 'M5 12h13m-6-6 6 6-6 6',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z M4 20.5A2.5 2.5 0 0 1 6.5 18H20',
  check: 'm5 12 4 4L19 6',
  chevron: 'm6 9 6 6 6-6',
  close: 'M6 6l12 12M18 6 6 18',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  moon: 'M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z',
  plus: 'M12 5v14M5 12h14',
  search: 'm21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z',
  spark: 'm12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z',
  sun: 'M12 3V1m0 22v-2M4.22 4.22 2.8 2.8m18.4 18.4-1.42-1.42M3 12H1m22 0h-2M4.22 19.78 2.8 21.2M21.2 2.8l-1.42 1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  const path = PATHS[name];

  if (!path) return null;

  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}
