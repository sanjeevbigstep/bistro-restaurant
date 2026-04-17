import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, formatCurrency, getErrorMessage } from '../../utils/helper';
import { ROUTES } from '../../constants';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
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

const emptyItemForm = { name: '', description: '', price: '', imageUrl: '', isAvailable: true, categoryId: '' };

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [catModal, setCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', displayOrder: '0' });
  const [editCat, setEditCat] = useState<MenuCategory | null>(null);
  const [catLoading, setCatLoading] = useState(false);

  const [itemModal, setItemModal] = useState(false);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [itemLoading, setItemLoading] = useState(false);

  const loadMenu = () => {
    setIsLoading(true);
    api.get<MenuCategory[]>('/menu/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => setError('Failed to load menu'))
      .finally(() => setIsLoading(false));
  };

  useEffect(loadMenu, []);

  const openAddCat = () => { setCatForm({ name: '', displayOrder: '0' }); setEditCat(null); setCatModal(true); };
  const openEditCat = (cat: MenuCategory) => { setCatForm({ name: cat.name, displayOrder: String(cat.displayOrder) }); setEditCat(cat); setCatModal(true); };
  const saveCat = async () => {
    setCatLoading(true);
    try {
      const payload = { name: catForm.name, displayOrder: Number(catForm.displayOrder) };
      if (editCat) await api.put(`/menu/categories/${editCat.id}`, payload);
      else await api.post('/menu/categories', payload);
      setCatModal(false);
      loadMenu();
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setCatLoading(false); }
  };
  const deleteCat = async (id: string) => {
    if (!confirm('Delete this category and all its items?')) return;
    try { await api.delete(`/menu/categories/${id}`); loadMenu(); }
    catch (err) { setError(getErrorMessage(err)); }
  };

  const openAddItem = (categoryId: string) => { setItemForm({ ...emptyItemForm, categoryId }); setEditItem(null); setItemModal(true); };
  const openEditItem = (item: MenuItem) => {
    setItemForm({ name: item.name, description: item.description ?? '', price: String(item.price), imageUrl: item.imageUrl ?? '', isAvailable: item.isAvailable, categoryId: item.categoryId });
    setEditItem(item);
    setItemModal(true);
  };
  const saveItem = async () => {
    setItemLoading(true);
    try {
      const payload = { ...itemForm, price: Number(itemForm.price), description: itemForm.description || undefined, imageUrl: itemForm.imageUrl || undefined };
      if (editItem) await api.put(`/menu/items/${editItem.id}`, payload);
      else await api.post('/menu/items', payload);
      setItemModal(false);
      loadMenu();
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setItemLoading(false); }
  };
  const deleteItem = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try { await api.delete(`/menu/items/${id}`); loadMenu(); }
    catch (err) { setError(getErrorMessage(err)); }
  };
  const toggleAvailability = async (item: MenuItem) => {
    try { await api.put(`/menu/items/${item.id}`, { isAvailable: !item.isAvailable }); loadMenu(); }
    catch (err) { setError(getErrorMessage(err)); }
  };

  if (isLoading) return <LoadingSpinner message="Loading menu..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link to={ROUTES.DASHBOARD} className="hover:text-orange-500">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-900">Menu Management</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        </div>
        <Button onClick={openAddCat}>+ Add Category</Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>
      )}

      {categories.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 mb-4">No menu categories yet</p>
          <Button onClick={openAddCat}>Create First Category</Button>
        </div>
      )}

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="font-semibold text-gray-900">{cat.name}</h2>
                <p className="text-xs text-gray-400">Order: {cat.displayOrder} · {cat.items.length} items</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => openAddItem(cat.id)}>+ Item</Button>
                <Button variant="ghost" size="sm" onClick={() => openEditCat(cat)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deleteCat(cat.id)}>Delete</Button>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {cat.items.length === 0 && (
                <p className="px-6 py-4 text-sm text-gray-400">No items in this category.</p>
              )}
              {cat.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 text-xl">🍴</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">{item.name}</span>
                      <Badge label={item.isAvailable ? 'Available' : 'Unavailable'} variant={item.isAvailable ? 'green' : 'gray'} />
                    </div>
                    {item.description && <p className="text-xs text-gray-500 truncate">{item.description}</p>}
                  </div>
                  <span className="font-bold text-orange-500 whitespace-nowrap">{formatCurrency(item.price)}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleAvailability(item)}>
                      {item.isAvailable ? 'Hide' : 'Show'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditItem(item)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteItem(item.id)}>Del</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={catModal}
        onClose={() => setCatModal(false)}
        title={editCat ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCatModal(false)}>Cancel</Button>
            <Button onClick={saveCat} isLoading={catLoading}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Category name" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required />
          <Input label="Display order" type="number" value={catForm.displayOrder} onChange={(e) => setCatForm({ ...catForm, displayOrder: e.target.value })} min="0" />
        </div>
      </Modal>

      <Modal
        isOpen={itemModal}
        onClose={() => setItemModal(false)}
        title={editItem ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setItemModal(false)}>Cancel</Button>
            <Button onClick={saveItem} isLoading={itemLoading}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Item name" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Optional description..."
            />
          </div>
          <Input label="Price ($)" type="number" step="0.01" min="0" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} required />
          <Input label="Image URL" type="url" value={itemForm.imageUrl} onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })} placeholder="https://..." />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={itemForm.isAvailable}
              onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">Available for ordering</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
