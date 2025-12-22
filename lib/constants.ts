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

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Rutas de Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',     // Opción 1
  DASHBOARD_ADMIN: '/admin',     // Opción 2 (La que pedía el error)

  // Rutas de Partner
  PARTNER_DASHBOARD: '/business', // Opción 1
  DASHBOARD_PARTNER: '/business', // Opción 2

  // Rutas de Gobierno
  GOV_DASHBOARD: '/gov',         // Opción 1
  DASHBOARD_GOV: '/gov',         // Opción 2

  // Rutas Comunes
  MAP: '/mapa',
  VIBES: '/vibes',
  PROFILE: '/perfil',
};