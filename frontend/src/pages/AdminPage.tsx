import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../redux/store';
import { showToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export default function AdminPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data.products);
    } catch (error) {
      showToast('Failed to fetch products', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url,
        stock: parseInt(formData.stock, 10),
      };

      if (editingProduct) {
        await axios.patch(
          `${API_URL}/api/products/${editingProduct.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Product updated successfully!', 'success');
      } else {
        await axios.post(
          `${API_URL}/api/products`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Product created successfully!', 'success');
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Operation failed', 'error');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowCreateForm(false);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      stock: product.stock.toString(),
    });
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      await axios.delete(`${API_URL}/api/products/${deleteProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Product deleted successfully!', 'success');
      setDeleteProduct(null);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Delete failed', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      stock: '',
    });
    setEditingProduct(null);
    // Removed: setShowCreateForm(false); - This was causing the bug!
  };

  const ProductForm = () => (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price *
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Stock *
        </label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field"
          rows={3}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image URL
        </label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="input-field"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="md:col-span-2 flex gap-3">
        <button type="submit" className="btn-primary">
          {editingProduct ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowCreateForm(false);
          }}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Product Management
        </h1>
        <button
          onClick={() => {
            if (!showCreateForm) {
              resetForm();
            }
            setShowCreateForm(!showCreateForm);
            setEditingProduct(null);
          }}
          className="btn-primary"
        >
          {showCreateForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create New Product
          </h2>
          <ProductForm />
        </div>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id}>
            <div className="card flex items-center gap-6">
              <img
                src={product.image_url || 'https://placehold.co/100x100?text=No+Image'}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.category} • ${product.price.toFixed(2)} • Stock: {product.stock}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-1">
                  {product.description}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteProduct(product)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingProduct?.id === product.id && (
              <div className="card mt-4 ml-8 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Product
                </h3>
                <ProductForm />
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteProduct !== null}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteProduct(null)}
      />
    </div>
  );
}