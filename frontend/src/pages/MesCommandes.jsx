import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const MesCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/commandes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommandes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
      alert('Erreur lors du chargement de l\'historique.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    let config = { label: 'Inconnu', color: '#6b7280', bg: '#f3f4f6' };
    
    switch(status) {
      case 'en_attente': 
        config = { label: 'En attente', color: '#4b5563', bg: '#e5e7eb' }; 
        break;
      case 'payee': 
        config = { label: 'Payée', color: '#1d4ed8', bg: '#dbeafe' }; 
        break;
      case 'en_preparation': 
        config = { label: 'En préparation', color: '#b45309', bg: '#fef3c7' }; 
        break;
      case 'expediee': 
        config = { label: 'Expédiée', color: '#6d28d9', bg: '#ede9fe' }; 
        break;
      case 'livree': 
        config = { label: 'Livrée', color: '#047857', bg: '#d1fae5' }; 
        break;
      case 'annulee': 
        config = { label: 'Annulée', color: '#b91c1c', bg: '#fee2e2' }; 
        break;
      default: break;
    }

    return (
      <span style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        display: 'inline-block'
      }}>
        {config.label}
      </span>
    );
  };

  const renderTimeline = (statut) => {
    // Si la commande est annulée, on ne montre pas la timeline de progression normale
    if (statut === 'annulee') {
      return (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
          Cette commande a été annulée.
        </div>
      );
    }

    const steps = [
      { key: 'payee', label: 'Payée' },
      { key: 'en_preparation', label: 'En préparation' },
      { key: 'expediee', label: 'Expédiée' },
      { key: 'livree', label: 'Livrée' }
    ];

    // Trouver l'index de l'étape actuelle. "en_attente" est avant tout (index -1)
    let currentIndex = -1;
    if (statut === 'payee') currentIndex = 0;
    else if (statut === 'en_preparation') currentIndex = 1;
    else if (statut === 'expediee') currentIndex = 2;
    else if (statut === 'livree') currentIndex = 3;

    return (
      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Suivi de livraison</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Ligne de fond */}
          <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '3px', backgroundColor: '#e5e7eb', zIndex: 1 }}></div>
          {/* Ligne de progression */}
          <div style={{ position: 'absolute', top: '15px', left: '10%', right: `calc(100% - 10% - ${Math.max(0, currentIndex) * 33.33}%)`, height: '3px', backgroundColor: 'var(--primary)', zIndex: 1, transition: 'right 0.3s ease' }}></div>
          
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            
            return (
              <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '25%' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  backgroundColor: isCompleted ? 'var(--primary)' : 'white',
                  border: isCompleted ? '2px solid var(--primary)' : '2px solid #d1d5db',
                  color: isCompleted ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(79, 70, 229, 0.2)' : 'none'
                }}>
                  {isCompleted ? '✓' : (idx + 1)}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
                  textAlign: 'center'
                }}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Chargement de votre historique...</div>;
  }

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Bellelle - Mes Commandes</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/dashboard" className="btn btn-outline">Retour au catalogue</Link>
        </div>
      </nav>

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Historique de vos commandes</h2>

        {commandes.length === 0 ? (
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Vous n'avez pas encore passé de commande.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Découvrir nos produits</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {commandes.map((commande) => (
              <div key={commande.id} style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      Commande #{commande.id}
                      {getStatusBadge(commande.statut)}
                    </h3>
                    <div style={{ color: 'var(--text-muted)' }}>
                      Passée le {new Date(commande.created_at).toLocaleDateString('fr-FR')} à {new Date(commande.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    Total: {commande.total} €
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Articles commandés ({commande.items?.length || 0})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {commande.items?.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {item.produit?.image ? (
                            <img src={`http://127.0.0.1:8000${item.produit.image}`} alt={item.produit.nom} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            <div style={{ width: '50px', height: '50px', backgroundColor: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#9ca3af' }}>N/A</div>
                          )}
                          <div>
                            <div style={{ fontWeight: '500' }}>{item.produit?.nom || 'Produit indisponible'}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Quantité: {item.quantite}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>
                          {(item.prix_unitaire * item.quantite).toFixed(2)} €
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frise chronologique */}
                {renderTimeline(commande.statut)}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MesCommandes;
