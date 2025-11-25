import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { DollarSign, Users, BookOpen, Star } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [asesores, setAsesores] = useState([]);

    useEffect(() => {
        // 1. Cargar Stats Generales (SQL + Postgres)
        axiosClient.get('/Admin/dashboard-stats')
            .then(res => setStats(res.data))
            .catch(console.error);

        // 2. Cargar Tabla de Asesores (Linked Server Query)
        axiosClient.get('/Admin/dashboard-asesores')
            .then(res => setAsesores(res.data))
            .catch(console.error);
    }, []);

    if (!stats) return <div className="text-white text-center mt-20">Cargando Dashboard Distribuido...</div>;

    return (
        <div className="container mx-auto py-10 space-y-8">
            <h1 className="text-3xl font-bold text-white">Dashboard Ejecutivo</h1>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Ingresos Totales" value={`$${stats.ingresosTotales}`} icon={DollarSign} color="text-emerald-400" />
                <StatCard title="Usuarios" value={stats.totalUsuarios} icon={Users} color="text-blue-400" />
                <StatCard title="Cursos" value={stats.totalCursosPublicados} icon={BookOpen} color="text-purple-400" />
                <StatCard title="Rating Global" value={stats.ratingPromedioGlobal.toFixed(1)} icon={Star} color="text-yellow-400" />
            </div>

            {/* Tabla de Asesores (Data de Postgres + SQL Server) */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Rendimiento de Asesores</h3>
                    <p className="text-slate-400 text-sm">Datos consolidados de ventas y calificaciones.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Asesor</th>
                                <th className="px-6 py-4">Cursos</th>
                                <th className="px-6 py-4">Ventas</th>
                                <th className="px-6 py-4">Calificación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {asesores.map((asesor) => (
                                <tr key={asesor.asesorId} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{asesor.nombreAsesor}</td>
                                    <td className="px-6 py-4">{asesor.totalCursos}</td>
                                    <td className="px-6 py-4 text-emerald-400 font-mono">${asesor.ingresosGenerados}</td>
                                    <td className="px-6 py-4 flex items-center gap-1 text-yellow-400">
                                        <Star size={14} fill="currentColor" /> {asesor.ratingPromedio.toFixed(1)}
                                        <span className="text-slate-600 ml-1">({asesor.totalCalificaciones})</span>
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

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-slate-900 ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
            <p className="text-slate-400 text-sm">{title}</p>
            <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
        </div>
    );
}