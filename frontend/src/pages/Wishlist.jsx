import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cartCount, fetchCartCount, showToast } = useCart();

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlists(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (produitId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/wishlist/${produitId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlists(wishlists.filter(w => w.produit_id !== produitId));
      showToast('Retiré des favoris');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression.');
    }
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

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Chargement des favoris...</div>;
  }

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Bellelle - Mes Favoris</div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
            🛍️ Catalogue
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
        </div>
      </nav>

      <main className="container">
        <h2 style={{ marginTop: '2rem', marginBottom: '2rem' }}>Produits Favoris</h2>

        {wishlists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
            Vous n'avez aucun produit dans vos favoris.
          </div>
        ) : (
          <div className="card-grid">
            {wishlists.map((item) => {
              const produit = item.produit;
              if (!produit) return null;
              
              return (
                <div key={produit.id} className="card" style={{ position: 'relative' }}>
                  <div 
                    style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, cursor: 'pointer', fontSize: '1.5rem', backgroundColor: 'white', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                    onClick={() => handleRemove(produit.id)}
                    title="Retirer des favoris"
                  >
                    ❤️
                  </div>
                  {produit.stock <= 0 && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--danger)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', zIndex: 1 }}>Rupture</span>
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
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
