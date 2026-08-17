import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await api.get('/panier', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const count = response.data.reduce((total, item) => total + item.quantite, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier', error);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, showToast, toastMessage }}>
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: 'var(--success)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </CartContext.Provider>
  );
};
