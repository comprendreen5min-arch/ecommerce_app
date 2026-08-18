import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const AdminCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/commandes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommandes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
      alert('Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatutChange = async (commandeId, nouveauStatut) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/commandes/${commandeId}/statut`, { statut: nouveauStatut }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Mettre à jour l'état local
      setCommandes(commandes.map(cmd => cmd.id === commandeId ? { ...cmd, statut: nouveauStatut } : cmd));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const statusOptions = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'payee', label: 'Payée' },
    { value: 'en_preparation', label: 'En préparation' },
    { value: 'expediee', label: 'Expédiée' },
    { value: 'livree', label: 'Livrée' },
    { value: 'annulee', label: 'Annulée' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'en_attente': return '#6b7280'; // gris
      case 'payee': return '#3b82f6'; // bleu
      case 'en_preparation': return '#f59e0b'; // orange
      case 'expediee': return '#8b5cf6'; // violet
      case 'livree': return '#10b981'; // vert
      case 'annulee': return '#ef4444'; // rouge
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Chargement des commandes...</div>;
  }

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Admin Commandes</div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
            📦 Produits
          </Link>
          <Link to="/admin/stats" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
            📊 Stats
          </Link>
          <button onClick={handleLogout} className="btn btn-outline">Déconnexion</button>
        </div>
      </nav>

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Gestion des Commandes</h2>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          {commandes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Aucune commande trouvée.</p>
          ) : (
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Client</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Total</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Statut</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commandes.map((commande, index) => (
                    <tr key={commande.id} style={{ backgroundColor: index % 2 === 0 ? 'transparent' : '#f9fafb' }}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>#{commande.id}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>
                        {commande.user?.name || 'Inconnu'} <br/>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{commande.user?.email}</span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                        {new Date(commande.created_at).toLocaleDateString('fr-FR')} à {new Date(commande.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>
                        {commande.total} €
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <select 
                          value={commande.statut}
                          onChange={(e) => handleStatutChange(commande.id, e.target.value)}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: `1px solid ${getStatusColor(commande.statut)}`,
                            backgroundColor: 'white',
                            color: getStatusColor(commande.statut),
                            fontWeight: 'bold',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ color: 'black' }}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <details style={{ cursor: 'pointer' }}>
                          <summary style={{ color: 'var(--primary)', fontWeight: '500' }}>Voir articles ({commande.items?.length || 0})</summary>
                          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {commande.items?.map(item => (
                              <li key={item.id}>{item.produit?.nom || 'Produit inconnu'} - {item.quantite}x ({item.prix_unitaire} €)</li>
                            ))}
                          </ul>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCommandes;
