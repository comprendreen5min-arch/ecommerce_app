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
      alert('Erreur lors du chargement de l\'historique des commandes.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatStatut = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.85rem', fontWeight: 'bold' }}>En attente</span>;
      case 'payee':
        return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '0.85rem', fontWeight: 'bold' }}>Payée</span>;
      case 'annulee':
        return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.85rem', fontWeight: 'bold' }}>Annulée</span>;
      default:
        return statut;
    }
  };

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Mes Commandes</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-outline">Retour à la boutique</button>
      </nav>

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Historique de vos commandes</h2>

        {loading ? (
          <p>Chargement de vos commandes...</p>
        ) : commandes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '1.2rem' }}>Vous n'avez passé aucune commande pour le moment.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Découvrir nos produits</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {commandes.map(commande => (
              <div key={commande.id} style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderRadius: 'var(--radius)', 
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  padding: '1.5rem', 
                  backgroundColor: '#f9fafb', 
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>COMMANDE PASSÉE LE</div>
                    <div style={{ fontWeight: '500' }}>{formatDate(commande.created_at)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>TOTAL</div>
                    <div style={{ fontWeight: '500' }}>{Number(commande.total).toFixed(2)} €</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>N° DE COMMANDE</div>
                    <div style={{ fontWeight: '500' }}>#{commande.id}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>STATUT</div>
                    <div>{formatStatut(commande.statut)}</div>
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {commande.items.map(item => (
                      <li key={item.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {item.produit && item.produit.image ? (
                          <img 
                            src={`http://127.0.0.1:8000${item.produit.image}`} 
                            alt={item.produit.nom}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <div style={{ width: '80px', height: '80px', backgroundColor: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Sans image</span>
                          </div>
                        )}
                        
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.5rem 0' }}>
                            {item.produit ? (
                              <Link to={`/produits/${item.produit.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
                                {item.produit.nom}
                              </Link>
                            ) : 'Produit inconnu ou supprimé'}
                          </h4>
                          <div style={{ color: 'var(--text-muted)' }}>
                            Quantité : {item.quantite}
                          </div>
                          <div style={{ color: 'var(--text-muted)' }}>
                            Prix : {Number(item.prix_unitaire).toFixed(2)} €
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MesCommandes;
