import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
      alert('Error loading users.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <AdminLayout activeTab="customers">
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your boutique's customers and staff.</p>
      </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>search</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.875rem', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            {loading ? (
              <p>Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No users found.</p>
            ) : (
              <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Role</th>
                      <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Registration Date</th>
                      <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Orders</th>
                      <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '1px solid var(--border)' }}>Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} style={{ backgroundColor: index % 2 === 0 ? 'transparent' : '#f9fafb' }}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>{user.name}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{user.email}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            backgroundColor: user.role === 'admin' ? '#fef3c7' : '#f3f4f6',
                            color: user.role === 'admin' ? '#92400e' : '#4b5563',
                            border: `1px solid ${user.role === 'admin' ? '#fcd34d' : '#d1d5db'}`
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                          {new Date(user.created_at).toLocaleDateString('en-US')}
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                          {user.commandes_count}
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 'bold' }}>
                          {user.total_depense ? Number(user.total_depense).toFixed(2) : '0.00'} €
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

export default AdminCustomers;
