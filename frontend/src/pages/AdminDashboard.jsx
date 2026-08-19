import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    stock: 0,
    categorie: '',
    prix: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [flashMessage, setFlashMessage] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProduits();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProduits = async () => {
    try {
      const response = await api.get('/produits');
      setProduits(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/produits/${id}`);
        setProduits(produits.filter(p => p.id !== id));
        showFlashMessage('Product deleted successfully!');
      } catch (error) {
        alert('Error deleting');
      }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nom: product.nom,
        description: product.description || '',
        stock: product.stock,
        categorie: product.categorie,
        prix: product.prix,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nom: '',
        description: '',
        stock: 0,
        categorie: '',
        prix: 0,
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const showFlashMessage = (message) => {
    setFlashMessage(message);
    setTimeout(() => setFlashMessage(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('description', formData.description);
    data.append('stock', formData.stock);
    data.append('categorie', formData.categorie);
    data.append('prix', formData.prix);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      if (editingProduct) {
        // En PHP/Laravel, un PUT avec FormData peut poser problème. On utilise _method POST spoofing.
        data.append('_method', 'PUT');
        await api.post(`/produits/${editingProduct.id}`, data, config);
        showFlashMessage('Product modified successfully!');
      } else {
        await api.post('/produits', data, config);
        showFlashMessage('Product added successfully!');
      }
      fetchProduits();
      closeModal();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'An error occurred during saving.';
      alert(errorMessage);
    }
  };

  return (
    <AdminLayout activeTab="inventory">
      
      {adminUser && (
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
            Hello, {adminUser.name.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      )}

      {flashMessage && (
        <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', textAlign: 'center' }}>
          {flashMessage}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Product Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your boutique's inventory and product details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add a product
        </button>
      </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {produits.map((produit) => (
                  <tr key={produit.id} style={{ backgroundColor: produit.stock <= 0 ? '#fee2e2' : produit.stock <= 5 ? '#fef3c7' : 'inherit' }}>
                    <td>{produit.id}</td>
                    <td>
                      {produit.image ? (
                        <img src={`http://127.0.0.1:8000${produit.image}`} alt={produit.nom} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{ width: '50px', height: '50px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
                      )}
                    </td>
                    <td>{produit.nom}</td>
                    <td>{produit.categorie}</td>
                    <td>{produit.prix} €</td>
                    <td>
                      <span style={{ 
                        fontWeight: produit.stock <= 5 ? 'bold' : 'normal',
                        color: produit.stock <= 0 ? '#991b1b' : produit.stock <= 5 ? '#92400e' : 'inherit'
                      }}>
                        {produit.stock}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => openModal(produit)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => handleDelete(produit.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {produits.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{editingProduct ? 'Edit product' : 'Add a product'}</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" name="nom" value={formData.nom} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input type="text" className="form-input" name="categorie" value={formData.categorie} onChange={handleInputChange} required />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Price (€)</label>
                    <input type="number" step="0.01" min="0" className="form-input" name="prix" value={formData.prix} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-input" name="stock" value={formData.stock} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input type="file" className="form-input" onChange={handleFileChange} accept="image/*" />
                  {editingProduct && editingProduct.image && !imageFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      The current image will be kept if you do not select a new one.
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingProduct ? 'Save changes' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </AdminLayout>
  );
};

export default AdminDashboard;
