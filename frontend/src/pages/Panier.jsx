import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

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
      console.error('Error fetching cart', error);
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
      console.error('Error updating quantity', error);
      alert('Error updating.');
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Remove this item from the cart?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/panier/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(items => items.filter(item => item.id !== id));
      fetchCartCount();
      showToast('Item removed from cart');
    } catch (error) {
      console.error('Error removing item', error);
      alert('Error removing.');
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
      showToast('Order placed successfully!');
      navigate(`/commande-confirmee/${response.data.commande.id}`);
    } catch (error) {
      console.error('Error placing order', error);
      alert('Error placing order.');
    }
  };

  return (
    <div>
      <Header />

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)' }}>Your Cart</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_back</span>
            Back to Catalog
          </button>
        </div>
        {loading ? (
          <p>Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Discover our products and add them to your cart.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>View Catalog</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
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
                        <button className="btn btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
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
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Total:</h2>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {totalCartPrice.toFixed(2)} €
              </div>
              <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', marginTop: '1rem' }} onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Panier;
