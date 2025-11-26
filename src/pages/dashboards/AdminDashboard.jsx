import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { DollarSign, Users, BookOpen, Star } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [asesores, setAsesores] = useState([]);

    useEffect(() => {
        // 1. Cargar Stats Generales
        axiosClient.get('/Admin/dashboard-stats')
            .then(res => setStats(res.data))
            .catch(console.error);

        // 2. Cargar Tabla de Asesores
        axiosClient.get('/Admin/dashboard-asesores')
            .then(res => setAsesores(res.data))
            .catch(console.error);
    }, []);

    // CORRECCIÓN: pt-32 en el contenedor principal y en el loading state
    if (!stats) return <div className="text-white text-center pt-40">Cargando Dashboard Distribuido...</div>;

    return (
        <div className="container mx-auto pt-32 pb-10 px-6 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard Ejecutivo</h1>
                    <p className="text-slate-400 mt-1">Visión general del rendimiento de la plataforma (SQL Server + PostgreSQL).</p>
                </div>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">
                    TIEMPO REAL
                </span>
            </div>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Ingresos Totales" value={`$${stats.ingresosTotales}`} icon={DollarSign} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                <StatCard title="Usuarios" value={stats.totalUsuarios} icon={Users} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
                <StatCard title="Cursos" value={stats.totalCursosPublicados} icon={BookOpen} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
                <StatCard title="Rating Global" value={stats.ratingPromedioGlobal.toFixed(1)} icon={Star} color="text-yellow-400" bg="bg-yellow-500/10" border="border-yellow-500/20" />
            </div>

            {/* Tabla de Asesores */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">Rendimiento de Asesores</h3>
                        <p className="text-slate-400 text-sm">Top performers basado en ventas y calificaciones.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 text-slate-200 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Asesor</th>
                                <th className="px-6 py-4 text-center">Cursos</th>
                                <th className="px-6 py-4 text-right">Ventas</th>
                                <th className="px-6 py-4 text-right">Calificación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {asesores.map((asesor) => (
                                <tr key={asesor.asesorId} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                            {asesor.nombreAsesor.substring(0, 2).toUpperCase()}
                                        </div>
                                        {asesor.nombreAsesor}
                                    </td>
                                    <td className="px-6 py-4 text-center">{asesor.totalCursos}</td>
                                    <td className="px-6 py-4 text-right text-emerald-400 font-mono font-medium">${asesor.ingresosGenerados}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 text-yellow-400 font-bold">
                                            {asesor.ratingPromedio.toFixed(1)} <Star size={14} fill="currentColor" />
                                            <span className="text-slate-600 ml-1 font-normal text-xs">({asesor.totalCalificaciones})</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg, border }) {
    return (
        <div className={`p-6 rounded-2xl border ${border || 'border-white/5'} bg-slate-900/60 backdrop-blur-sm transition-all hover:scale-[1.02]`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
        </div>
    );
}