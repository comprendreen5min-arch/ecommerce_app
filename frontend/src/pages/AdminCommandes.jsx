import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';

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
      console.error('Error fetching orders', error);
      alert('Error loading orders.');
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
      console.error('Error updating status', error);
      alert('Error updating status.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const statusOptions = [
    { value: 'en_attente', label: 'Pending' },
    { value: 'payee', label: 'Paid' },
    { value: 'en_preparation', label: 'Processing' },
    { value: 'expediee', label: 'Shipped' },
    { value: 'livree', label: 'Delivered' },
    { value: 'annulee', label: 'Canceled' }
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
    return <div className="container" style={{ padding: '2rem' }}>Loading orders...</div>;
  }

  return (
    <AdminLayout activeTab="orders">
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Order Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage and process customer orders.</p>
      </div>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          {commandes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
          ) : (
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Total</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commandes.map((commande, index) => (
                    <tr key={commande.id} style={{ backgroundColor: index % 2 === 0 ? 'transparent' : '#f9fafb' }}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>#{commande.id}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>
                        {commande.user?.name || 'Unknown'} <br/>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{commande.user?.email}</span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                        {new Date(commande.created_at).toLocaleDateString('en-US')} at {new Date(commande.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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
                          <summary style={{ color: 'var(--primary)', fontWeight: '500' }}>View items ({commande.items?.length || 0})</summary>
                          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {commande.items?.map(item => (
                              <li key={item.id}>{item.produit?.nom || 'Unknown product'} - {item.quantite}x ({item.prix_unitaire} €)</li>
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
    </AdminLayout>
  );
};

export default AdminCommandes;
