import { useState, useEffect } from 'react';
import { api, formatCurrency } from '../../utils/helper';
import LoadingSpinner from '../../components/LoadingSpinner';

interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: string;
}

export default function MenuListPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<MenuCategory[]>('/menu/categories')
      .then(({ data }) => {
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].id);
      })
      .catch(() => setError('Failed to load menu'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading menu..." />;

  const activeItems = categories.find((c) => c.id === activeCategory)?.items ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
        <p className="text-gray-500 mt-2">Fresh, seasonal ingredients prepared with care</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>
      )}

      {categories.length === 0 && !error && (
        <p className="text-center text-gray-500 py-12">Menu coming soon. Check back later!</p>
      )}

      {categories.length > 0 && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.filter((item) => item.isAvailable).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
                    <span className="text-4xl">🍴</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-orange-500 font-bold whitespace-nowrap">{formatCurrency(item.price)}</span>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
            {activeItems.filter((item) => item.isAvailable).length === 0 && (
              <p className="col-span-full text-center text-gray-400 py-10">No items available in this category right now.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
