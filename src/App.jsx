import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Páginas Públicas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CursosPage from './pages/CursosPage';
import AsesorPublicPage from './pages/AsesorPublicPage'; 

// Páginas Protegidas
import ProfilePage from './pages/ProfilePage';
import SolicitarAsesorPage from './pages/SolicitarAsesorPage';
import CursoManagerPage from './pages/CursoManagerPage';
import CursoPlayerPage from './pages/CursoPlayerPage'; 
import SolicitudesStudentPage from './pages/SolicitudesStudentPage';
import MarketplaceAsesorPage from './pages/MarketplaceAsesorPage';
import StudentPaymentsPage from './pages/StudentPaymentsPage'; 

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
            
            {/* --- RUTAS PÚBLICAS --- */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="cursos" element={<CursosPage />} />
            <Route path="asesor/:id" element={<AsesorPublicPage />} />
            
            {/* --- RUTAS PROTEGIDAS --- */}
            <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="historial-pagos" element={<StudentPaymentsPage />} />
                <Route path="solicitar-asesor" element={<SolicitarAsesorPage />} />
                
                {/* Cursos */}
                <Route path="manage-course/:cursoId" element={<CursoManagerPage />} />
                <Route path="classroom/:cursoId" element={<CursoPlayerPage />} />
                
                {/* Asesorías */}
                <Route path="solicitudes" element={<SolicitudesStudentPage />} />
                <Route path="mercado" element={<MarketplaceAsesorPage />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;