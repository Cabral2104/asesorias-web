import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Settings, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentDashboard from './dashboards/StudentDashboard';
import AsesorDashboard from './dashboards/AsesorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import ProfileSettings from './dashboards/components/ProfileSettings';

export default function ProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderDashboard = () => {
        if (user?.roles?.includes('Admin')) return <AdminDashboard />;
        if (user?.roles?.includes('Asesor')) return <AsesorDashboard />;
        return <StudentDashboard />;
    };

    const isStudent = !user?.roles?.includes('Asesor') && !user?.roles?.includes('Admin');

    return (
        <div className="dashboard-container animate-fade-in min-h-screen pt-32 pb-20 px-6">
            
            {/* Encabezado de Perfil */}
            <div className="container mx-auto bg-slate-900/50 border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-indigo-500/30 uppercase">
                        {user?.userName?.charAt(0) || 'U'}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white mb-1">
                            {user?.nombreCompleto || user?.userName}
                        </h1>
                        <p className="text-slate-400 text-sm mb-3">{user?.email}</p>
                        <div className="flex gap-2 justify-center md:justify-start">
                            {user?.roles?.map(role => (
                                <span key={role} className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    role === 'Admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    role === 'Asesor' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTÓN HISTORIAL (Solo Estudiantes) */}
                {isStudent && (
                    <Link to="/historial-pagos" className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-white/5">
                        <Receipt size={18} className="text-emerald-400"/> Historial de Pagos
                    </Link>
                )}
            </div>

            {/* Navegación de Pestañas */}
            <div className="container mx-auto">
                <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`pb-4 px-6 text-sm font-medium flex items-center gap-2 transition-colors relative ${activeTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <LayoutDashboard size={18} /> Mi Panel
                        {activeTab === 'dashboard' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></div>}
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`pb-4 px-6 text-sm font-medium flex items-center gap-2 transition-colors relative ${activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Settings size={18} /> Configuración
                        {activeTab === 'settings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Contenido */}
                <div className="min-h-[400px]">
                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in">
                            {renderDashboard()}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <ProfileSettings />
                    )}
                </div>
            </div>
        </div>
    );
}