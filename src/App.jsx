import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'; // Añadido Navigate y Outlet
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// 1. IMPORTAMOS LOS DASHBOARDS REALES
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AsesorDashboard from './pages/dashboards/AsesorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Componentes Placeholder para rutas públicas
const Register = () => (
  <div className="pt-32 text-center h-screen">
    <h1 className="text-4xl font-bold text-white">Registro</h1>
    <p className="text-slate-400 mt-2">Próximamente...</p>
  </div>
);

const Cursos = () => (
  <div className="pt-32 text-center h-screen">
    <h1 className="text-4xl font-bold text-white">Catálogo Completo</h1>
    <p className="text-slate-400 mt-2">Listado de cursos aquí.</p>
  </div>
);

// Componente para proteger rutas privadas
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && user?.roles) {
        const hasPermission = allowedRoles.some(role => user.roles.includes(role));
        if (!hasPermission) return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

// NUEVO: Componente que redirige inteligentemente si entras a /dashboard
const DashboardRedirect = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Redirección basada en rol
    if (user?.roles?.includes('Admin')) return <Navigate to="/admin" replace />;
    if (user?.roles?.includes('Asesor')) return <Navigate to="/asesor" replace />;
    
    // Por defecto a estudiante
    return <Navigate to="/student" replace />;
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
            <Route path="register" element={<Register />} />
            <Route path="cursos" element={<Cursos />} />
            
            {/* 2. RUTAS PROTEGIDAS ESPECÍFICAS */}
            
            {/* Ruta Comodín: Si alguien va a /dashboard, lo mandamos a su lugar correcto */}
            <Route path="dashboard" element={<DashboardRedirect />} />
            
            {/* Ruta para Estudiantes */}
            <Route element={<ProtectedRoute allowedRoles={['Estudiante']} />}>
                <Route path="student" element={<StudentDashboard />} />
            </Route>

            {/* Ruta para Asesores */}
            <Route element={<ProtectedRoute allowedRoles={['Asesor']} />}>
                <Route path="asesor" element={<AsesorDashboard />} />
            </Route>

            {/* Ruta para Administradores */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="admin" element={<AdminDashboard />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;