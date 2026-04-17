import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/helper';
import { ROUTES } from '../../constants';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  createdAt: string;
}

const roleBadge = (role: string) => {
  if (role === 'admin') return <Badge label="Admin" variant="red" />;
  if (role === 'staff') return <Badge label="Staff" variant="blue" />;
  return <Badge label="Customer" variant="gray" />;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<User[]>('/users')
      .then(({ data }) => setUsers(data))
      .catch(() => setError('Failed to load users'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link to={ROUTES.DASHBOARD} className="hover:text-orange-500">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900">Users</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>
      )}

      {users.length === 0 && !error && (
        <div className="text-center py-16 text-gray-400">No users found.</div>
      )}

      {users.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
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
