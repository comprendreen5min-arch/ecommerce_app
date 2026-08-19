import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, ShoppingBag, BarChart3, Users } from 'lucide-react';
import api from '../api/axios';

const AdminLayout = ({ children, activeTab }) => {
  const [stats, setStats] = useState({ pending_orders: 0, low_stock: 0, user: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSidebarStats();
  }, []);

  const fetchSidebarStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/sidebar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching sidebar stats', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar" style={{ padding: '0 1.5rem', height: '72px' }}>
        <div className="navbar-brand">Bellelle</div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Logout</button>
        </div>
      </nav>

      <div className="admin-layout">
        <aside className="admin-sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Bellelle Luxe</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Management Portal</p>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/admin/dashboard" className={`sidebar-link ${activeTab === 'inventory' ? 'active' : ''}`}>
                <LayoutGrid size={20} />
                <span style={{ flex: 1 }}>Inventory</span>
                {stats.low_stock > 0 && (
                  <span style={{ backgroundColor: 'var(--danger)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.15rem 0.4rem', borderRadius: '10px' }}>
                    {stats.low_stock}
                  </span>
                )}
              </Link>
              
              <Link to="/admin/commandes" className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}>
                <ShoppingBag size={20} />
                <span style={{ flex: 1 }}>Orders</span>
                {stats.pending_orders > 0 && (
                  <span style={{ backgroundColor: 'var(--danger)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.15rem 0.4rem', borderRadius: '10px' }}>
                    {stats.pending_orders}
                  </span>
                )}
              </Link>
              
              <Link to="/admin/stats" className={`sidebar-link ${activeTab === 'stats' ? 'active' : ''}`}>
                <BarChart3 size={20} />
                <span>Stats</span>
              </Link>
              
              <Link to="/admin/customers" className={`sidebar-link ${activeTab === 'customers' ? 'active' : ''}`}>
                <Users size={20} />
                <span>Customers</span>
              </Link>
            </nav>
          </div>

          {stats.user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                backgroundColor: 'var(--bg-soft)', color: 'var(--primary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.25rem'
              }}>
                {stats.user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stats.user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stats.user.email}</div>
              </div>
            </div>
          )}
        </aside>

        <main className="admin-content" style={{ position: 'relative' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
