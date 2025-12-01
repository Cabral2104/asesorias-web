import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SolicitarAsesorPage from './pages/SolicitarAsesorPage';
import CursoManagerPage from './pages/CursoManagerPage';
import CursosPage from './pages/CursosPage';
import CursoPlayerPage from './pages/CursoPlayerPage'; // <--- IMPORTAR REPRODUCTOR

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
            <Route path="cursos" element={<CursosPage />} />
            
            {/* RUTAS PROTEGIDAS */}
            <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="solicitar-asesor" element={<SolicitarAsesorPage />} />
                
                {/* Gestión de Cursos (Asesor) */}
                <Route path="manage-course/:cursoId" element={<CursoManagerPage />} />
                
                {/* Sala de Clases (Estudiante) */}
                <Route path="classroom/:cursoId" element={<CursoPlayerPage />} />
            </Route>

          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;