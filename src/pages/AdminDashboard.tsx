import { useState, useEffect } from 'react';
import { Button, Input, Modal } from '../components/ui';
import { Loader } from '../components/ui/Loader';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Room {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
}

export default function AdminDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Form state
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    price: 0,
    description: '',
    image_url: '',
    is_available: true
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchRooms = () => {
    setIsLoading(true);
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch rooms:", err);
        toast.error("Failed to fetch homestays");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      price: 0,
      description: '',
      image_url: '',
      is_available: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setModalMode('edit');
    setEditingId(room.id);
    setFormData({
      name: room.name,
      price: room.price,
      description: room.description || '',
      image_url: room.image_url || '',
      is_available: room.is_available
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this homestay? This action cannot be undone.")) {
      fetch(`/api/rooms/${id}`, {
        method: 'DELETE',
      })
      .then((res) => {
        if (res.ok) {
          toast.success("Homestay deleted successfully");
          fetchRooms();
        } else {
          toast.error("Failed to delete homestay");
        }
      })
      .catch((err) => console.error(err));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      .then(res => res.json())
      .then(() => {
        toast.success("Homestay created successfully");
        setIsModalOpen(false);
        fetchRooms();
      })
      .catch(err => console.error(err));
    } else {
      fetch(`/api/rooms/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      .then(res => res.json())
      .then(() => {
        toast.success("Homestay updated successfully");
        setIsModalOpen(false);
        fetchRooms();
      })
      .catch(err => console.error(err));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseInt(value) || 0 : value
    }));
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] py-32 px-6 max-w-[500px] mx-auto flex flex-col items-center justify-center animate-in fade-in duration-700">
        <h1 className="text-3xl font-bold font-serif text-primary-hover dark:text-primary-light mb-6">Admin Login</h1>
        <form 
          className="w-full flex flex-col gap-4 bg-surface dark:bg-gray-900 p-8 rounded-2xl border border-border dark:border-gray-800 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === 'admin.homestay.4321') {
              setIsAuthenticated(true);
              toast.success('Access granted');
            } else {
              toast.error('Incorrect password');
            }
          }}
        >
          <p className="text-text-secondary text-sm text-center mb-2">Please enter the admin password to access the CRUD operations.</p>
          <Input 
            type="password" 
            placeholder="Enter admin password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Access Dashboard</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-16 px-6 max-w-[1200px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8 border-b border-border dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary-hover dark:text-primary-light">Admin Dashboard</h1>
          <p className="text-text-secondary mt-1">Manage homestay listings (CRUD Operations)</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus size={18} /> Add Homestay
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" className="text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border dark:border-gray-800 bg-surface dark:bg-gray-900 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-border dark:border-gray-800">
                <th className="p-4 font-semibold text-text-primary dark:text-gray-300">ID</th>
                <th className="p-4 font-semibold text-text-primary dark:text-gray-300">Image</th>
                <th className="p-4 font-semibold text-text-primary dark:text-gray-300">Name</th>
                <th className="p-4 font-semibold text-text-primary dark:text-gray-300">Price (₹)</th>
                <th className="p-4 font-semibold text-text-primary dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} className="border-b border-border dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 text-text-secondary">{room.id}</td>
                  <td className="p-4">
                    <img 
                      src={room.image_url || "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=100&q=80"} 
                      alt={room.name} 
                      className="w-16 h-12 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium text-text-primary dark:text-white">{room.name}</td>
                  <td className="p-4 text-text-secondary">₹{room.price}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(room)} className="flex items-center gap-1 h-8 px-3">
                        <Pencil size={14} /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(room.id)} className="flex items-center gap-1 h-8 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50">
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">No homestays found. Create one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Re-using the Modal component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? "Add New Homestay" : "Edit Homestay"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">Name</label>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="e.g. Mountain View Cottage" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">Price per night (₹)</label>
            <Input 
              name="price" 
              type="number"
              value={formData.price} 
              onChange={handleInputChange} 
              placeholder="e.g. 2500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Brief description of the property..." 
              className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-700 bg-background dark:bg-gray-800 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">Image URL</label>
            <Input 
              name="image_url" 
              value={formData.image_url} 
              onChange={handleInputChange} 
              placeholder="https://images.unsplash.com/photo-..." 
            />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border dark:border-gray-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{modalMode === 'create' ? 'Create Homestay' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
