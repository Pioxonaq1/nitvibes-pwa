export const ROUTES = {
  HOME: '/',
  LOGIN: '/login', // Genérico (aunque ahora usamos específicos)
  REGISTER: '/register',
  MAPA: '/mapa',
  VIBES: '/vibes',
  PERFIL: '/perfil',
  
  // RUTAS DE ROLES (MODULARES)
  // Team (Antes Admin)
  TEAM_DASHBOARD: '/team/dashboard',
  TEAM_LOGIN: '/team/login',
  
  // Partner (Antes Business)
  PARTNER_DASHBOARD: '/partner/dashboard',
  PARTNER_LOGIN: '/partner/login',
  
  // Gov
  GOV_DASHBOARD: '/gov/dashboard',
  GOV_LOGIN: '/gov/login',
  
  // Viber (Usuario)
  VIBER_DASHBOARD: '/viber/dashboard',
  VIBER_LOGIN: '/viber/login',
};

// Mantenemos compatibilidad por si algún componente viejo busca las keys antiguas
export const DASHBOARD_ROUTES = {
  ADMIN: ROUTES.TEAM_DASHBOARD,
  PARTNER: ROUTES.PARTNER_DASHBOARD,
  GOV: ROUTES.GOV_DASHBOARD,
  VIBER: ROUTES.VIBER_DASHBOARD
};
