import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate, getErrorMessage } from '../../utils/helper';
import { ROUTES } from '../../constants';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Reservation {
  id: string;
  partySize: number;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  guestName: string | null;
  guestEmail: string | null;
  user: { name: string; email: string } | null;
  createdAt: string;
}

const statusBadge = (status: string) => {
  if (status === 'confirmed') return <Badge label="Confirmed" variant="green" />;
  if (status === 'cancelled') return <Badge label="Cancelled" variant="red" />;
  return <Badge label="Pending" variant="yellow" />;
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filterDate) params.set('date', filterDate);
    if (filterStatus) params.set('status', filterStatus);
    api.get<Reservation[]>(`/reservations?${params}`)
      .then(({ data }) => setReservations(data))
      .catch(() => setError('Failed to load reservations'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [filterDate, filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const deleteRes = async (id: string) => {
    if (!confirm('Delete this reservation?')) return;
    try { await api.delete(`/reservations/${id}`); load(); }
    catch (err) { setError(getErrorMessage(err)); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link to={ROUTES.DASHBOARD} className="hover:text-orange-500">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-900">Reservations</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {(filterDate || filterStatus) && (
          <Button variant="ghost" size="sm" onClick={() => { setFilterDate(''); setFilterStatus(''); }}>
            Clear filters
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No reservations found.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Guest</th>
                  <th className="px-6 py-3 text-left">Date & Time</th>
                  <th className="px-6 py-3 text-left">Party</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Notes</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{res.user?.name ?? res.guestName ?? 'Guest'}</div>
                      <div className="text-xs text-gray-400">{res.user?.email ?? res.guestEmail ?? ''}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(res.date)}<br />
                      <span className="text-gray-400 text-xs">{res.timeSlot}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{res.partySize}</td>
                    <td className="px-6 py-4">{statusBadge(res.status)}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{res.notes ?? '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {res.status !== 'confirmed' && (
                          <Button variant="secondary" size="sm" onClick={() => updateStatus(res.id, 'confirmed')}>Confirm</Button>
                        )}
                        {res.status !== 'cancelled' && (
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(res.id, 'cancelled')}>Cancel</Button>
                        )}
                        <Button variant="danger" size="sm" onClick={() => deleteRes(res.id)}>Del</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
