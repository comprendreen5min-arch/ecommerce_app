import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

const ProduitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { cartCount, fetchCartCount, showToast } = useCart();

  // Nouveaux états pour favoris et avis
  const [currentUser, setCurrentUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [avisList, setAvisList] = useState([]);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // On récupère le produit
        const prodRes = await api.get(`/produits/${id}`);
        setProduit(prodRes.data);

        // Récupération des avis (route publique)
        const avisRes = await api.get(`/produits/${id}/avis`);
        setAvisList(avisRes.data);

        // Si l'utilisateur est connecté, on récupère son profil et sa wishlist
        if (token) {
          try {
            const userRes = await api.get('/user', { headers: { Authorization: `Bearer ${token}` } });
            setCurrentUser(userRes.data);
            
            const wishRes = await api.get('/wishlist', { headers: { Authorization: `Bearer ${token}` } });
            setIsFavorite(wishRes.data.some(w => w.produit_id === parseInt(id)));
          } catch (e) {
            console.error("Not logged in or token error", e);
          }
        }
      } catch (err) {
        console.error('Error fetching product', err);
        setError('Product not found or loading error.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/panier', { produit_id: produit.id, quantite: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartCount();
      showToast('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart', err.response || err);
      const msg = err.response?.data?.message || 'Error adding to cart';
      alert(`Error: ${msg}`);
    }
  };

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isFavorite) {
        await api.delete(`/wishlist/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setIsFavorite(false);
        showToast('Removed from favorites');
      } else {
        await api.post('/wishlist', { produit_id: id }, { headers: { Authorization: `Bearer ${token}` } });
        setIsFavorite(true);
        showToast('Added to favorites ❤️');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("You must be logged in to add to favorites.");
      }
    }
  };

  const submitAvis = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/produits/${id}/avis`, { note, commentaire }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvisList([response.data, ...avisList]);
      showToast('Review published!');
      // Update average locally for UI
      setProduit(prev => {
        const newCount = (prev.avis_count || 0) + 1;
        const currentTotal = (prev.moyenne_notes || 0) * (prev.avis_count || 0);
        return {
          ...prev,
          avis_count: newCount,
          moyenne_notes: (currentTotal + parseInt(note)) / newCount
        };
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error publishing review.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !produit) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
          Back
        </button>
      </div>
    );
  }

  const hasLeftReview = currentUser && avisList.some(a => a.user_id === currentUser.id);

  return (
    <div>
      <Header />

      <main className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          backgroundColor: 'var(--bg-card)',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          position: 'relative'
        }}>
          {/* Cœur Favori */}
          <div 
            style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 2, cursor: 'pointer', fontSize: '2rem', backgroundColor: 'white', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
            onClick={toggleWishlist}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? '❤️' : '🤍'}
          </div>

          {/* Section Image */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            {produit.image ? (
              <img 
                src={`http://127.0.0.1:8000${produit.image}`} 
                alt={produit.nom} 
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  borderRadius: 'var(--radius)',
                  objectFit: 'cover',
                  boxShadow: 'var(--shadow-lg)'
                }} 
              />
            ) : (
              <div style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#e5e7eb',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af'
              }}>
                No image
              </div>
            )}
          </div>

          {/* Section Infos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {produit.categorie}
              </span>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--text-main)', lineHeight: '1.2' }}>
              {produit.nom}
            </h1>
            
            <div style={{ color: '#f59e0b', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {produit.moyenne_notes ? `★ ${Number(produit.moyenne_notes).toFixed(1)} (${produit.avis_count} reviews)` : 'No reviews yet'}
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {produit.prix} €
            </div>

            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.125rem' }}>
              {produit.description ? produit.description : 'No description available for this product.'}
            </div>

            <div style={{ 
              marginTop: 'auto',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem' 
            }}>
              <div style={{ fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {produit.stock <= 0 && (
                  <span style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>Out of stock</span>
                )}
                {produit.stock > 0 && produit.stock <= 5 && (
                  <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>Low stock: {produit.stock} unit(s)</span>
                )}
                {produit.stock > 5 && (
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>In stock: {produit.stock} unit(s)</span>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
                  onClick={handleAddToCart}
                  disabled={produit.stock <= 0}
                >
                  {produit.stock > 0 ? 'Add to cart' : 'Out of Stock'}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Catalog
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Avis */}
        <div style={{ marginTop: '3rem', backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Customer Reviews</h2>
          
          {/* Formulaire pour laisser un avis */}
          {currentUser && !hasLeftReview ? (
            <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Leave a review</h3>
              <form onSubmit={submitAvis}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Rating:</label>
                  <select 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Very Good)</option>
                    <option value="3">3 Stars (Good)</option>
                    <option value="2">2 Stars (Fair)</option>
                    <option value="1">1 Star (Poor)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Comment (optional):</label>
                  <textarea 
                    value={commentaire} 
                    onChange={(e) => setCommentaire(e.target.value)}
                    rows="3"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', resize: 'vertical' }}
                    placeholder="What did you think of this product?"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Publish review</button>
              </form>
            </div>
          ) : currentUser && hasLeftReview ? (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>
              You have already left a review for this product. Thank you!
            </div>
          ) : !currentUser ? (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>
              Log in to leave a review.
            </div>
          ) : null}

          {/* Liste des avis */}
          <div>
            {avisList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {avisList.map((avis) => (
                  <div key={avis.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{avis.user?.name || 'User'}</strong>
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{'★'.repeat(avis.note)}{'☆'.repeat(5 - avis.note)}</span>
                    </div>
                    {avis.commentaire && <p style={{ color: 'var(--text-muted)', margin: '0' }}>"{avis.commentaire}"</p>}
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                      Published on {new Date(avis.created_at).toLocaleDateString('en-US')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProduitDetail;
