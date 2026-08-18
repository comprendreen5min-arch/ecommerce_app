import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Panier = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchCartCount, showToast } = useCart();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/panier', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem('token');
      await api.put(`/panier/${id}`, { quantite: newQuantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update locally
      setCartItems(items => items.map(item => item.id === id ? { ...item, quantite: newQuantity } : item));
      fetchCartCount();
    } catch (error) {
      console.error('Erreur lors de la modification de la quantité', error);
      alert('Erreur lors de la mise à jour.');
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Retirer cet article du panier ?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/panier/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(items => items.filter(item => item.id !== id));
      fetchCartCount();
      showToast('Article retiré du panier');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article', error);
      alert('Erreur lors de la suppression.');
    }
  };

  const totalCartPrice = cartItems.reduce((total, item) => {
    return total + (item.quantite * item.produit.prix);
  }, 0);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/commandes', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartCount();
      showToast('Commande validée avec succès !');
      navigate(`/commande-confirmee/${response.data.commande.id}`);
    } catch (error) {
      console.error('Erreur lors de la validation de la commande', error);
      alert('Erreur lors de la validation de la commande.');
    }
  };

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Votre Panier</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-outline">Continuer vos achats</button>
      </nav>

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        {loading ? (
          <p>Chargement du panier...</p>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Votre panier est vide</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Découvrez nos produits et ajoutez-les au panier.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Voir le catalogue</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix unitaire</th>
                    <th>Quantité</th>
                    <th>Sous-total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                        {item.produit.image ? (
                          <img 
                            src={`http://127.0.0.1:8000${item.produit.image}`} 
                            alt={item.produit.nom}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <div style={{ width: '60px', height: '60px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
                        )}
                        <Link to={`/produits/${item.produit.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>
                          {item.produit.nom}
                        </Link>
                      </td>
                      <td>{item.produit.prix} €</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.2rem 0.6rem' }}
                            onClick={() => updateQuantity(item.id, item.quantite - 1)}
                            disabled={item.quantite <= 1}
                          >-</button>
                          <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantite}</span>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.2rem 0.6rem' }}
                            onClick={() => updateQuantity(item.id, item.quantite + 1)}
                            disabled={item.quantite >= item.produit.stock}
                          >+</button>
                        </div>
                      </td>
                      <td style={{ fontWeight: '600' }}>{(item.quantite * item.produit.prix).toFixed(2)} €</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => removeItem(item.id)}>Retirer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: '2rem',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '1rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Total à payer :</h2>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {totalCartPrice.toFixed(2)} €
              </div>
              <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', marginTop: '1rem' }} onClick={handleCheckout}>
                Valider la commande
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Panier;
