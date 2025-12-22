export const USER_ROLES = {
  ADMIN: 'admin',
  PARTNER: 'partner',
  GOV: 'gov',
  USER: 'user',
  VIBER: 'viber'
};

export const APP_CONFIG = {
  name: 'Nitvibes',
  description: 'Descubre el vibe de tu ciudad',
  url: 'https://nitvibes.com'
};

export const NAV_LINKS = [
  { name: 'Mapa', href: '/mapa' },
  { name: 'Vibes', href: '/vibes' },
  { name: 'Perfil', href: '/perfil' },
];

// 👇 ESTO ES LO QUE FALTABA
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  PARTNER_DASHBOARD: '/business',
  GOV_DASHBOARD: '/gov',
  MAP: '/mapa',
  VIBES: '/vibes',
  PROFILE: '/perfil',
};