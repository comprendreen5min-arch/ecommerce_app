import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ProduitDetail from './pages/ProduitDetail';
import Panier from './pages/Panier';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes pour l'admin */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes pour le client */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/produits/:id" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ProduitDetail />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/panier" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <Panier />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
