import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage'; // IMPORTAR PERFIL
import RegisterPage from './pages/RegisterPage';
import SolicitarAsesorPage from './pages/SolicitarAsesorPage';

// ... (Mantén tus componentes placeholder Register y Cursos igual que antes) ...
const Register = () => <div className="pt-32 text-center h-screen text-white">Registro</div>;
const Cursos = () => <div className="pt-32 text-center h-screen text-white">Catálogo Completo</div>;

// Componente para proteger rutas privadas (Genérico)
const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-slate-950"></div>;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Rutas Públicas */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="cursos" element={<Cursos />} />
            
            {/* RUTAS PROTEGIDAS */}
            <Route element={<ProtectedRoute />}>
                {/* La nueva página de perfil unificada */}
                <Route path="profile" element={<ProfilePage />} />
                <Route path="solicitar-asesor" element={<SolicitarAsesorPage />} />
            </Route>

          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;