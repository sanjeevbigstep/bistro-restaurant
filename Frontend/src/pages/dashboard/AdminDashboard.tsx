import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../../utils/helper';
import { ROUTES } from '../../constants';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';

interface DashboardStats {
  reservations: { today: number; pending: number; confirmed: number };
  menu: { total: number; available: number };
  users: { total: number };
  upcomingReservations: {
    id: string;
    date: string;
    timeSlot: string;
    partySize: number;
    status: string;
    guestName: string | null;
    user: { name: string; email: string } | null;
  }[];
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<DashboardStats>('/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <Link to={ROUTES.DASHBOARD_RESERVATIONS}><Button variant="secondary" size="sm">All Reservations</Button></Link>
          <Link to={ROUTES.DASHBOARD_MENU}><Button variant="secondary" size="sm">Manage Menu</Button></Link>
          <Link to={ROUTES.DASHBOARD_USERS}><Button variant="secondary" size="sm">Users</Button></Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Reservations Today" value={stats.reservations.today} color="text-orange-500" />
            <StatCard label="Pending" value={stats.reservations.pending} sub="awaiting confirmation" color="text-yellow-500" />
            <StatCard label="Confirmed" value={stats.reservations.confirmed} sub="upcoming reservations" color="text-green-500" />
            <StatCard label="Menu Items" value={stats.menu.total} sub={`${stats.menu.available} available`} color="text-blue-500" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Upcoming Confirmed Reservations</h2>
              <Link to={ROUTES.DASHBOARD_RESERVATIONS} className="text-sm text-orange-500 hover:text-orange-600">View all →</Link>
            </div>
            {stats.upcomingReservations.length === 0 ? (
              <p className="px-6 py-8 text-sm text-center text-gray-400">No upcoming confirmed reservations.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Guest</th>
                      <th className="px-6 py-3 text-left">Date & Time</th>
                      <th className="px-6 py-3 text-left">Party</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.upcomingReservations.map((res) => (
                      <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {res.user?.name ?? res.guestName ?? 'Guest'}
                          {res.user?.email && <div className="text-xs text-gray-400 font-normal">{res.user.email}</div>}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(res.date)} <span className="text-gray-400">at</span> {res.timeSlot}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{res.partySize}</td>
                        <td className="px-6 py-4">
                          <Badge label="Confirmed" variant="green" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
