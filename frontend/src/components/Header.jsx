import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const token = localStorage.getItem('token');

  const handleAuthAction = () => {
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar" style={{ padding: '0 1.5rem', height: '72px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="navbar-brand" style={{ flex: '1' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Bellelle</Link>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: '1', justifyContent: 'flex-end' }}>
          <Link to="/favoris" style={{ textDecoration: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          <Link to="/panier" style={{ textDecoration: 'none', color: 'var(--primary)', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-12px',
                backgroundColor: 'var(--danger)', color: 'white',
                borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            onClick={handleAuthAction} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase' 
            }}
          >
            {token ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
