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
  ADMIN_DASHBOARD: '/admin',
  DASHBOARD_ADMIN: '/admin',

  // Rutas de Partner (Negocios)
  PARTNER_DASHBOARD: '/business',
  DASHBOARD_PARTNER: '/business',
  BUSINESS_LOGIN: '/business/login',

  // Rutas de Gobierno
  GOV_DASHBOARD: '/gov',
  DASHBOARD_GOV: '/gov',
  GOV_LOGIN: '/gov/login',

  // Rutas de Usuario / Viber (La que fallaba)
  DASHBOARD_VIBER: '/perfil',  // 👈 AQUÍ ESTÁ LA SOLUCIÓN
  DASHBOARD_USER: '/perfil',   // Alias por si acaso
  VIBER_DASHBOARD: '/perfil',  // Alias por si acaso

  // Rutas Comunes
  MAP: '/mapa',
  VIBES: '/vibes',
  PROFILE: '/perfil',
};