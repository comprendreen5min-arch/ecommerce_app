import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const ProduitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { cartCount, fetchCartCount, showToast } = useCart();

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const response = await api.get(`/produits/${id}`);
        setProduit(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération du produit', err);
        setError('Produit introuvable ou erreur de chargement.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/panier', { produit_id: produit.id, quantite: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartCount();
      showToast('Produit ajouté au panier !');
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier', err.response || err);
      const msg = err.response?.data?.message || 'Erreur lors de l\'ajout au panier';
      alert(`Erreur : ${msg}`);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error || !produit) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Détail du Produit</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
          <button onClick={() => navigate(-1)} className="btn btn-outline">Retour</button>
        </div>
      </nav>

      <main className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          backgroundColor: 'var(--bg-card)',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)'
        }}>
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
                Aucune image
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
            
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {produit.prix} €
            </div>

            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.125rem' }}>
              {produit.description ? produit.description : 'Aucune description disponible pour ce produit.'}
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
                  <span style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>Rupture de stock</span>
                )}
                {produit.stock > 0 && produit.stock <= 5 && (
                  <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>Stock limité : {produit.stock} unité(s)</span>
                )}
                {produit.stock > 5 && (
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>En stock : {produit.stock} unité(s)</span>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
                  onClick={handleAddToCart}
                  disabled={produit.stock <= 0}
                >
                  {produit.stock > 0 ? 'Ajouter au panier' : 'Rupture'}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Retour au catalogue
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProduitDetail;
