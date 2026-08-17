import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const response = await api.get('/produits');
      setProduits(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits', error);
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
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await api.delete(`/produits/${id}`);
        setProduits(produits.filter(p => p.id !== id));
        showFlashMessage('Produit supprimé avec succès !');
      } catch (error) {
        alert('Erreur lors de la suppression');
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
        showFlashMessage('Produit modifié avec succès !');
      } else {
        await api.post('/produits', data, config);
        showFlashMessage('Produit ajouté avec succès !');
      }
      fetchProduits();
      closeModal();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement.';
      alert(errorMessage);
    }
  };

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Admin Dashboard</div>
        <button onClick={handleLogout} className="btn btn-outline">Déconnexion</button>
      </nav>

      <main className="container" style={{ padding: '2rem 1.5rem', position: 'relative' }}>
        
        {flashMessage && (
          <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', textAlign: 'center' }}>
            {flashMessage}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Gestion des produits</h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            Ajouter un produit
          </button>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {produits.map((produit) => (
                  <tr key={produit.id}>
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
                    <td>{produit.stock}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => openModal(produit)}>
                          Modifier
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => handleDelete(produit.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {produits.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Aucun produit trouvé</td>
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
              <h3 style={{ marginBottom: '1.5rem' }}>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input type="text" className="form-input" name="nom" value={formData.nom} onChange={handleInputChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <input type="text" className="form-input" name="categorie" value={formData.categorie} onChange={handleInputChange} required />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Prix (€)</label>
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
                      L'image actuelle sera conservée si vous n'en sélectionnez pas une nouvelle.
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Annuler</button>
                  <button type="submit" className="btn btn-primary">{editingProduct ? 'Enregistrer les modifications' : 'Ajouter'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
