import { useState, useEffect } from 'react';
import { api, formatDate } from '../../utils/helper';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import { ROUTES } from '../../constants';
import { Link } from 'react-router-dom';

interface Reservation {
  id: string;
  partySize: number;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
  createdAt: string;
}

const statusBadge = (status: string) => {
  if (status === 'confirmed') return <Badge label="Confirmed" variant="green" />;
  if (status === 'cancelled') return <Badge label="Cancelled" variant="red" />;
  return <Badge label="Pending" variant="yellow" />;
};

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Reservation[]>('/reservations/my')
      .then(({ data }) => setReservations(data))
      .catch(() => setError('Failed to load reservations'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading your reservations..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
        <Link to={ROUTES.RESERVATIONS}>
          <Button size="sm">+ New Reservation</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>
      )}

      {reservations.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 mb-4">You have no reservations yet.</p>
          <Link to={ROUTES.RESERVATIONS}><Button>Make a Reservation</Button></Link>
        </div>
      )}

      <div className="space-y-4">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {statusBadge(res.status)}
                </div>
                <h3 className="font-semibold text-gray-900">{formatDate(res.date)} at {res.timeSlot}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{res.partySize} {res.partySize === 1 ? 'guest' : 'guests'}</p>
                {res.notes && <p className="text-sm text-gray-400 mt-1 italic">"{res.notes}"</p>}
              </div>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                Booked {new Date(res.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
