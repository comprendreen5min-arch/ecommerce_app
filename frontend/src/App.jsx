import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ProduitDetail from './pages/ProduitDetail';
import Panier from './pages/Panier';
import CommandeConfirmee from './pages/CommandeConfirmee';
import MesCommandes from './pages/MesCommandes';
import AdminStats from './pages/AdminStats';
import Wishlist from './pages/Wishlist';

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

        <Route 
          path="/admin/stats" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminStats />
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
          path="/favoris" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <Wishlist />
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
        
        <Route 
          path="/commande-confirmee/:id" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <CommandeConfirmee />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/mes-commandes" 
          element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <MesCommandes />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
