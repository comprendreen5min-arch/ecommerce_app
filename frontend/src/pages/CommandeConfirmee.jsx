import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';

const CommandeConfirmee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommandeDetails();
  }, [id]);

  const fetchCommandeDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/commandes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommande(response.data);
    } catch (error) {
      console.error('Error fetching order', error);
      // Rediriger si la commande n'existe pas ou n'appartient pas à l'utilisateur
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Loading order details...</div>;
  }

  if (!commande) {
    return null; // Déjà redirigé
  }

  return (
    <div>
      <Header />

      <main className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          padding: '3rem', 
          borderRadius: 'var(--radius)', 
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Thank you for your order!</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            Your order #{commande.id} has been successfully placed and its simulated payment has been validated.
          </p>

          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Order summary</h3>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {commande.items.map(item => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px dashed var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: '500' }}>{item.quantite}x</span>
                    <span>{item.produit ? item.produit.nom : 'Unknown product'}</span>
                  </div>
                  <div>
                    {(item.quantite * item.prix_unitaire).toFixed(2)} €
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid var(--border)' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total paid</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{Number(commande.total).toFixed(2)} €</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommandeConfirmee;
