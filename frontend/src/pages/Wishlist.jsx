import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

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
      console.error('Error fetching favorites', error);
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
      showToast('Removed from favorites');
    } catch (error) {
      console.error(error);
      alert('Error removing.');
    }
  };

  const handleAddToCart = async (produitId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/panier', { produit_id: produitId, quantite: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartCount();
      showToast('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart', error.response || error);
      const msg = error.response?.data?.message || 'Error adding to cart';
      alert(`Error : ${msg}`);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Loading favorites...</div>;
  }

  return (
    <div>
      <Header />

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)' }}>My Favorites</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_back</span>
            Back to Catalog
          </button>
        </div>

        {wishlists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
            You have no products in your favorites.
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
                    title="Remove from favorites"
                  >
                    ❤️
                  </div>
                  {produit.stock <= 0 && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--danger)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', zIndex: 1 }}>Out of Stock</span>
                  )}
                  {produit.image ? (
                    <img src={`http://127.0.0.1:8000${produit.image}`} alt={produit.nom} className="card-image" />
                  ) : (
                    <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                      No image
                    </div>
                  )}
                  <div className="card-content">
                    <h3 className="card-title">{produit.nom}</h3>
                    <div className="card-price">{produit.prix} €</div>
                    <div className="card-actions">
                      <button className="btn btn-outline" onClick={() => navigate(`/produits/${produit.id}`)}>View Details</button>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleAddToCart(produit.id)}
                        disabled={produit.stock <= 0}
                      >
                        {produit.stock > 0 ? 'Add to cart' : 'Out of Stock'}
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
