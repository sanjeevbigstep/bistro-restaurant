import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage, formatDate } from '../../utils/helper';
import { TIME_SLOTS, ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function ReservationFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    partySize: '2',
    date: today,
    timeSlot: '',
    notes: '',
    guestName: user?.name ?? '',
    guestEmail: user?.email ?? '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.timeSlot) { setError('Please select a time slot'); return; }
    setError('');
    setIsLoading(true);
    try {
      await api.post('/reservations', {
        partySize: Number(form.partySize),
        date: form.date,
        timeSlot: form.timeSlot,
        notes: form.notes || undefined,
        guestName: user ? undefined : form.guestName,
        guestEmail: user ? undefined : form.guestEmail,
      });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Requested!</h2>
        <p className="text-gray-500 mb-2">
          We've received your reservation for{' '}
          <strong>{form.partySize} guests</strong> on{' '}
          <strong>{formatDate(form.date)}</strong> at <strong>{form.timeSlot}</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-8">Our team will confirm shortly.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => navigate(ROUTES.HOME)} variant="secondary">Go Home</Button>
          {user && <Button onClick={() => navigate(ROUTES.MY_RESERVATIONS)}>My Reservations</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reserve a Table</h1>
        <p className="text-sm text-gray-500 mb-8">Complete the form and we'll confirm your reservation.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={handleChange('date')}
              min={today}
              required
            />
            <Input
              label="Party size"
              type="number"
              value={form.partySize}
              onChange={handleChange('partySize')}
              min="1"
              max="20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time slot</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, timeSlot: slot }))}
                  className={`py-2 text-sm rounded-lg border transition-colors ${
                    form.timeSlot === slot
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-500'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {!user && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Your name" value={form.guestName} onChange={handleChange('guestName')} placeholder="Jane Smith" required />
              <Input label="Email" type="email" value={form.guestEmail} onChange={handleChange('guestEmail')} placeholder="jane@example.com" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special requests <span className="text-gray-400">(optional)</span></label>
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Dietary restrictions, celebrations, seating preferences..."
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Request Reservation
          </Button>
        </form>
      </div>
    </div>
  );
}
