import { Outlet } from 'react-router-dom';
import Background3D from '../components/3d/Background3D';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-indigo-500 selection:text-white">
            {/* Fondo 3D animado siempre visible */}
            <Background3D />

            {/* Barra de Navegación */}
            <Navbar />

            {/* Contenido Principal */}
            {/* z-10 asegura que el contenido esté sobre el fondo 3D */}
            <main className="flex-grow relative z-10">
                <Outlet />
            </main>

            {/* Pie de Página */}
            <Footer />
        </div>
    );
};

export default MainLayout;