import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

const ClientDashboard = () => {
  const [produits, setProduits] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [quickViewProduit, setQuickViewProduit] = useState(null);
  const navigate = useNavigate();
  const { cartCount, fetchCartCount, showToast } = useCart();

  useEffect(() => {
    fetchProduits();
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlists(response.data.map(w => w.produit_id));
    } catch (error) {
      console.error('Wishlist error', error);
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

  // handleLogout has been moved to Header.jsx

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

  const toggleWishlist = async (produitId) => {
    try {
      const token = localStorage.getItem('token');
      if (wishlists.includes(produitId)) {
        await api.delete(`/wishlist/${produitId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlists(wishlists.filter(id => id !== produitId));
        showToast('Removed from favorites');
      } else {
        await api.post('/wishlist', { produit_id: produitId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlists([...wishlists, produitId]);
        showToast('Added to favorites ❤️');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating favorites.');
    }
  };

  const filteredProduits = produits.filter((produit) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (produit.nom && produit.nom.toLowerCase().includes(searchLower)) || 
      (produit.description && produit.description.toLowerCase().includes(searchLower));
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      produit.categorie === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Header />

      <main className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Our Products</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>
            Discover our exclusive selection of timeless pieces, designed to elevate your everyday with elegance and refinement.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>search</span>
              <input
                type="text"
                placeholder="Search for a piece..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              />
            </div>
            
            <div className="filter-pills">
              {['All Categories', 'Accessories', 'Bags & Leather Goods', 'Hats & Hair Accessories'].map(cat => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'All Categories' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card-grid">
            {filteredProduits.map((produit) => (
              <div key={produit.id} className="card" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setQuickViewProduit(produit)}>
                <div 
                  style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 2, cursor: 'pointer', fontSize: '1.25rem', color: wishlists.includes(produit.id) ? 'var(--primary)' : 'var(--text-muted)' }} 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(produit.id); }}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: wishlists.includes(produit.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </div>
                {produit.stock <= 0 && (
                  <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', zIndex: 1, textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid var(--border)' }}>Out of Stock</span>
                )}
                {produit.stock > 0 && produit.stock <= 5 && (
                  <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', zIndex: 1, textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid #fcd34d' }}>Low stock: {produit.stock}</span>
                )}
                {produit.image ? (
                  <img src={`http://127.0.0.1:8000${produit.image}`} alt={produit.nom} className="card-image" />
                ) : (
                  <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    No image
                  </div>
                )}
                <div className="card-content">
                  <h3 className="card-title" style={{ fontSize: '1.125rem', fontFamily: 'var(--font-sans)', fontWeight: '400', marginBottom: '0.25rem' }}>{produit.nom}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div className="card-price" style={{ margin: 0, fontSize: '1rem' }}>{produit.prix} €</div>
                    <div style={{ color: 'var(--accent-gold)', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                      {produit.moyenne_notes ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span style={{ color: 'var(--text-muted)', marginLeft: '4px', fontSize: '0.75rem' }}>{Number(produit.moyenne_notes).toFixed(1)}/5</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="card-actions" style={{ marginTop: 'auto' }}>
                    <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/produits/${produit.id}`); }} style={{ width: '100%' }}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProduits.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
                No products found.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      <div className={`quick-view-backdrop ${quickViewProduit ? 'open' : ''}`} onClick={() => setQuickViewProduit(null)}>
        <div className={`quick-view-modal ${quickViewProduit ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          {quickViewProduit && (
            <>
              <button className="quick-view-close" onClick={() => setQuickViewProduit(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="quick-view-image">
                {quickViewProduit.image ? (
                  <img src={`http://127.0.0.1:8000${quickViewProduit.image}`} alt={quickViewProduit.nom} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', backgroundColor: '#f3f4f6' }}>No image</div>
                )}
              </div>
              <div className="quick-view-content">
                <div>
                  <span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>
                    {quickViewProduit.categorie}
                  </span>
                </div>
                <h2 className="quick-view-title" style={{ marginTop: '1rem' }}>{quickViewProduit.nom}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div className="quick-view-price" style={{ margin: 0 }}>{quickViewProduit.prix} €</div>
                  <div style={{ color: 'var(--accent-gold)', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                    {quickViewProduit.moyenne_notes ? (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '4px', fontSize: '0.9rem' }}>{Number(quickViewProduit.moyenne_notes).toFixed(1)}/5 ({quickViewProduit.avis_count || 0} reviews)</span>
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet</span>
                    )}
                  </div>
                </div>
                
                <div className="quick-view-desc">
                  {quickViewProduit.description ? quickViewProduit.description : 'No description available for this product.'}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {quickViewProduit.stock <= 0 && (
                      <span style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>Out of stock</span>
                    )}
                    {quickViewProduit.stock > 0 && quickViewProduit.stock <= 5 && (
                      <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>Low stock: {quickViewProduit.stock} unit(s)</span>
                    )}
                    {quickViewProduit.stock > 5 && (
                      <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>In stock: {quickViewProduit.stock} unit(s)</span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '1rem', fontSize: '1rem', minWidth: '150px' }}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(quickViewProduit.id); setQuickViewProduit(null); }}
                      disabled={quickViewProduit.stock <= 0}
                    >
                      {quickViewProduit.stock > 0 ? 'Add to cart' : 'Out of Stock'}
                    </button>
                    <button 
                      className="btn btn-outline"
                      style={{ flex: 1, padding: '1rem', fontSize: '1rem', minWidth: '150px' }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/produits/${quickViewProduit.id}`); }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
