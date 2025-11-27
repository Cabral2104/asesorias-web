import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { DollarSign, Users, BookOpen, Star, Check, X, FileText, Download, Clock, Eye, Briefcase, GraduationCap, Building2, AlignLeft, Phone, Mail, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Pagination from '../../components/ui/Pagination';

const API_ROOT = 'https://localhost:7185';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]); // Gráfica Real
    const [asesores, setAsesores] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modales
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedAsesor, setSelectedAsesor] = useState(null); // Nuevo Modal Asesor

    // Paginación
    const [currentPageSolicitudes, setCurrentPageSolicitudes] = useState(1);
    const [currentPageAsesores, setCurrentPageAsesores] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const [statsRes, chartRes, asesoresRes, solicitudesRes] = await Promise.all([
                axiosClient.get('/Admin/dashboard-stats'),
                axiosClient.get('/Admin/revenue-chart'), // Datos reales de la gráfica
                axiosClient.get('/Admin/dashboard-asesores'),
                axiosClient.get('/Admin/pending-applications')
            ]);

            setStats(statsRes.data);
            setChartData(chartRes.data); // Guardamos datos reales
            setAsesores(asesoresRes.data);
            
            const sortedSolicitudes = solicitudesRes.data.sort((a, b) => 
                new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud)
            );
            setSolicitudes(sortedSolicitudes);

        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- CARGAR DETALLE DE ASESOR (Al hacer click) ---
    const handleViewAsesor = async (asesorId) => {
        try {
            const res = await axiosClient.get(`/Admin/asesor-detail/${asesorId}`);
            setSelectedAsesor(res.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los detalles del asesor', 'error');
        }
    };

    // --- ACCIONES SOLICITUDES ---
    const handleApprove = async (userId) => {
        /* ... (Misma lógica de antes) ... */
        // Por brevedad, mantén tu lógica de aprobar aquí
        // ...
        const result = await Swal.fire({ title: '¿Aprobar?', icon: 'question', showCancelButton: true, confirmButtonText: 'Sí', background: '#1e293b', color: '#fff' });
        if(result.isConfirmed) {
             await axiosClient.post(`/Admin/approve/${userId}`);
             fetchData();
             setSelectedRequest(null);
        }
    };

    const handleReject = async (userId) => {
        /* ... (Misma lógica de antes) ... */
        const result = await Swal.fire({ title: '¿Rechazar?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí', background: '#1e293b', color: '#fff' });
        if(result.isConfirmed) {
             await axiosClient.post(`/Admin/reject/${userId}`);
             fetchData();
             setSelectedRequest(null);
        }
    };

    // Paginación
    const currentSolicitudes = solicitudes.slice((currentPageSolicitudes - 1) * itemsPerPage, currentPageSolicitudes * itemsPerPage);
    const currentAsesores = asesores.slice((currentPageAsesores - 1) * itemsPerPage, currentPageAsesores * itemsPerPage);

    // Datos Pastel (Reales)
    const pieData = [
        { name: 'Aprobados', value: stats?.totalAsesoresAprobados || 0 },
        { name: 'Estudiantes', value: (stats?.totalUsuarios || 0) - (stats?.totalAsesoresAprobados || 0) },
    ];
    const COLORS = ['#10b981', '#3b82f6'];

    if (loading) return <div className="text-white text-center pt-40 animate-pulse">Cargando Sistema Integral...</div>;

    return (
        <div className="container mx-auto pt-32 pb-10 px-6 space-y-12 animate-fade-in relative">
            
            {/* ... (Header y Cards Stats igual que antes) ... */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Ingresos Totales" value={`$${stats?.ingresosTotales || 0}`} icon={DollarSign} color="text-emerald-400" bg="bg-emerald-500/10" />
                <StatCard title="Usuarios Totales" value={stats?.totalUsuarios || 0} icon={Users} color="text-blue-400" bg="bg-blue-500/10" />
                <StatCard title="Cursos Activos" value={stats?.totalCursosPublicados || 0} icon={BookOpen} color="text-purple-400" bg="bg-purple-500/10" />
                <StatCard title="Calidad Global" value={stats?.ratingPromedioGlobal.toFixed(1) || 0} icon={Star} color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            {/* GRÁFICAS REALES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Ingresos Mensuales ({new Date().getFullYear()})</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}> {/* Usamos data real */}
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="mes" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                                <Bar dataKey="ingresos" fill="#6366f1" radius={[4, 4, 0, 0]} name="Ingresos ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* ... (Gráfica Pastel igual que antes) ... */}
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Usuarios</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* SECCIÓN SOLICITUDES (Igual que antes pero con paginación) */}
            {/* ... (Mantén tu código de solicitudes aquí usando currentSolicitudes) ... */}
            
            {/* SECCIÓN ASESORES (MEJORADA CON CLICK) */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h3 className="text-xl font-bold text-white">Top Asesores</h3>
                    <p className="text-xs text-slate-400">Haz clic en un asesor para ver detalles.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-6 py-4">Asesor</th>
                                <th className="px-6 py-4 text-center">Cursos</th>
                                <th className="px-6 py-4 text-right">Ingresos</th>
                                <th className="px-6 py-4 text-right">Rating</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentAsesores.map((asesor) => (
                                <tr 
                                    key={asesor.asesorId} 
                                    onClick={() => handleViewAsesor(asesor.asesorId)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                            {asesor.nombreAsesor.substring(0, 2).toUpperCase()}
                                        </div>
                                        {asesor.nombreAsesor}
                                    </td>
                                    <td className="px-6 py-4 text-center"><span className="bg-slate-800 px-2 py-1 rounded text-xs text-white">{asesor.totalCursos}</span></td>
                                    <td className="px-6 py-4 text-right text-emerald-400 font-mono font-medium">${asesor.ingresosGenerados}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-1 text-yellow-400 font-bold">{asesor.ratingPromedio.toFixed(1)} <Star size={14} fill="currentColor" /></td>
                                    <td className="px-6 py-4 text-right text-slate-600 group-hover:text-indigo-400"><ChevronRight size={16} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-white/10 bg-slate-950/30">
                    <Pagination itemsPerPage={itemsPerPage} totalItems={asesores.length} paginate={setCurrentPageAsesores} currentPage={currentPageAsesores} />
                </div>
            </div>

            {/* --- MODAL DETALLE DE ASESOR (NUEVO) --- */}
            {selectedAsesor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        
                        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600">
                            <button onClick={() => setSelectedAsesor(null)} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/40 transition-colors"><X size={20} /></button>
                            <div className="absolute -bottom-10 left-8 flex items-end gap-4">
                                <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-slate-900 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                                    {selectedAsesor.nombreCompleto.substring(0,2).toUpperCase()}
                                </div>
                                <div className="mb-2">
                                    <h2 className="text-2xl font-bold text-white">{selectedAsesor.nombreCompleto}</h2>
                                    <p className="text-indigo-200 text-sm">{selectedAsesor.especialidad}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-14 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase">Ingresos Totales</p>
                                    <p className="text-2xl font-bold text-emerald-400">${selectedAsesor.totalIngresos}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase">Estudiantes</p>
                                    <p className="text-2xl font-bold text-blue-400">{selectedAsesor.totalEstudiantes}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase">Rating</p>
                                    <p className="text-2xl font-bold text-yellow-400 flex justify-center items-center gap-1">
                                        {selectedAsesor.ratingPromedio.toFixed(1)} <Star size={16} fill="currentColor" />
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-3">
                                    <h4 className="text-white font-bold flex items-center gap-2"><Mail size={16} className="text-indigo-400"/> Contacto</h4>
                                    <p className="text-slate-400 text-sm">{selectedAsesor.email}</p>
                                    <p className="text-slate-400 text-sm">{selectedAsesor.telefono}</p>
                                </div>
                            </div>

                            <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Cursos Creados</h3>
                            <div className="space-y-3">
                                {selectedAsesor.cursos.map((curso, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-950/30 p-3 rounded-lg border border-white/5">
                                        <div>
                                            <p className="text-white font-medium">{curso.titulo}</p>
                                            <p className="text-xs text-slate-500">{curso.inscritos} estudiantes inscritos</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded ${curso.estado ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                {curso.estado ? 'Activo' : 'Borrador'}
                                            </span>
                                            <p className="text-slate-300 font-mono text-sm mt-1">${curso.costo}</p>
                                        </div>
                                    </div>
                                ))}
                                {selectedAsesor.cursos.length === 0 && <p className="text-slate-500 text-sm italic">No ha creado cursos aún.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Solicitudes (Mantén el que tenías) */}
            {selectedRequest && (
                /* ... Pega aquí el modal de solicitudes que te di antes ... */
                <></> // Placeholder
            )}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <div className={`p-6 rounded-2xl border border-white/5 bg-slate-900/60 backdrop-blur-sm transition-all hover:scale-[1.02]`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bg} ${color}`}><Icon size={24} /></div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
        </div>
    );
}