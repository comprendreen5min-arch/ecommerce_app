import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

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
      console.error('Erreur lors de la récupération des statistiques', error);
      alert('Erreur lors du chargement des statistiques.');
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
    return <div className="container" style={{ padding: '2rem' }}>Chargement des statistiques...</div>;
  }

  return (
    <div>
      <nav className="navbar container">
        <div className="navbar-brand">Bellelle - Admin Stats</div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/admin/commandes" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
            📦 Commandes
          </Link>
          <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>
            🛍️ Produits
          </Link>
          <button onClick={handleLogout} className="btn btn-outline">Déconnexion</button>
        </div>
      </nav>

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Tableau de bord</h2>

        {/* Cartes KPI */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3rem' 
        }}>
          {/* Chiffre d'affaires */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Chiffre d'Affaires</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {Number(stats.chiffre_affaires || 0).toFixed(2)} €
            </div>
          </div>

          {/* Nombre de commandes */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Commandes Validées</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.total_commandes}
            </div>
          </div>

          {/* Produits en catalogue */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Produits en catalogue</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.total_produits}
            </div>
          </div>

          {/* Alertes Stock */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', borderLeft: stats.ruptures_stock > 0 ? '4px solid var(--danger)' : '4px solid var(--success)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Alertes de Stock</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.ruptures_stock > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {stats.ruptures_stock} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-main)' }}>produit(s) en alerte</span>
            </div>
          </div>
        </div>

        {/* Top 5 Produits */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Top 5 des ventes</h3>
          
          {stats.top_produits && stats.top_produits.length > 0 ? (
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>ID Produit</th>
                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Nom du produit</th>
                    <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Quantité vendue</th>
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
            <p style={{ color: 'var(--text-muted)' }}>Aucune vente enregistrée pour le moment.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminStats;
