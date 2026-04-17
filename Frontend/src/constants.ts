export const API_BASE_URL = '/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MENU: '/menu',
  RESERVATIONS: '/reservations',
  MY_RESERVATIONS: '/my-reservations',
  DASHBOARD: '/dashboard',
  DASHBOARD_MENU: '/dashboard/menu',
  DASHBOARD_RESERVATIONS: '/dashboard/reservations',
  DASHBOARD_USERS: '/dashboard/users',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
} as const;

export const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];
