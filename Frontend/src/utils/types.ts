export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: string;
  category?: MenuCategory;
}

export interface Reservation {
  id: string;
  partySize: number;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  guestName: string | null;
  guestEmail: string | null;
  userId: string | null;
  user?: User | null;
  createdAt: string;
}

export interface DashboardStats {
  reservations: { today: number; pending: number; confirmed: number };
  menu: { total: number; available: number };
  users: { total: number };
  upcomingReservations: Reservation[];
}
