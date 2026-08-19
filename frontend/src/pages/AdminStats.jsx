import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics', error);
      alert('Error loading statistics.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Loading statistics...</div>;
  }

  return (
    <AdminLayout activeTab="stats">
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your boutique's performance.</p>
      </div>

        {/* Cartes KPI */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3rem' 
        }}>
          {/* Chiffre d'affaires */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Revenue</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {Number(stats.chiffre_affaires || 0).toFixed(2)} €
            </div>
          </div>

          {/* Nombre de commandes */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Validated Orders</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.total_commandes}
            </div>
          </div>

          {/* Produits en catalogue */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Products in catalog</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.total_produits}
            </div>
          </div>

          {/* Alertes Stock */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', borderLeft: stats.ruptures_stock > 0 ? '4px solid var(--danger)' : '4px solid var(--success)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Stock Alerts</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.ruptures_stock > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {stats.ruptures_stock} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-main)' }}>product(s) on alert</span>
            </div>
          </div>
        </div>

        {/* Top 5 Produits */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Top 5 Sales</h3>
          
          {stats.top_produits && stats.top_produits.length > 0 ? (
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Product ID</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Product Name</th>
                    <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Quantity sold</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.top_produits.map((produit, index) => (
                    <tr key={produit.id} style={{ backgroundColor: index % 2 === 0 ? 'transparent' : '#f9fafb' }}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>#{produit.id}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>{produit.nom}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {produit.total_vendu}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No sales recorded yet.</p>
          )}
        </div>
    </AdminLayout>
  );
};

export default AdminStats;
