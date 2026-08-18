import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const ClientDashboard = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes les catégories');
  const navigate = useNavigate();
  const { cartCount, fetchCartCount, showToast } = useCart();

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

  const handleAddToCart = async (produitId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/panier', { produit_id: produitId, quantite: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartCount();
      showToast('Produit ajouté au panier !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier', error.response || error);
      const msg = error.response?.data?.message || 'Erreur lors de l\'ajout au panier';
      alert(`Erreur : ${msg}`);
    }
  };

  const filteredProduits = produits.filter((produit) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (produit.nom && produit.nom.toLowerCase().includes(searchLower)) || 
      (produit.description && produit.description.toLowerCase().includes(searchLower));
    
    const matchesCategory = 
      selectedCategory === 'Toutes les catégories' || 
      produit.categorie === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Espace Client</div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/mes-commandes" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
            📦 Mes Commandes
          </Link>
          <Link to="/panier" style={{ textDecoration: 'none', color: 'var(--text-main)', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem' }}>🛒 Panier</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-12px',
                backgroundColor: 'var(--danger)', color: 'white',
                borderRadius: '50%', padding: '0.1rem 0.4rem',
                fontSize: '0.75rem', fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={handleLogout} className="btn btn-outline">Déconnexion</button>
        </div>
      </nav>

      <main className="container">
        <h2 style={{ marginTop: '2rem' }}>Nos Produits</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Rechercher par nom ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '250px', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ minWidth: '200px', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          >
            <option value="Toutes les catégories">Toutes les catégories</option>
            <option value="Accessoires">Accessoires</option>
            <option value="Chapeaux & Accessoires cheveux">Chapeaux & Accessoires cheveux</option>
            <option value="Sacs & Maroquinerie">Sacs & Maroquinerie</option>
          </select>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="card-grid">
            {filteredProduits.map((produit) => (
              <div key={produit.id} className="card" style={{ position: 'relative' }}>
                {produit.stock <= 0 && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--danger)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', zIndex: 1 }}>Rupture</span>
                )}
                {produit.stock > 0 && produit.stock <= 5 && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', zIndex: 1 }}>Stock limité : {produit.stock}</span>
                )}
                {produit.image ? (
                  <img src={`http://127.0.0.1:8000${produit.image}`} alt={produit.nom} className="card-image" />
                ) : (
                  <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    Aucune image
                  </div>
                )}
                <div className="card-content">
                  <h3 className="card-title">{produit.nom}</h3>
                  <div className="card-price">{produit.prix} €</div>
                  <p className="card-desc">
                    {produit.description ? 
                      (produit.description.length > 80 ? produit.description.substring(0, 80) + '...' : produit.description) 
                      : 'Aucune description disponible.'}
                  </p>
                  <div className="card-actions">
                    <button className="btn btn-outline" onClick={() => navigate(`/produits/${produit.id}`)}>Voir le détail</button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleAddToCart(produit.id)}
                      disabled={produit.stock <= 0}
                    >
                      {produit.stock > 0 ? 'Ajouter au panier' : 'Rupture'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProduits.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
                Aucun produit trouvé.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
