import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { DollarSign, Users, BookOpen, Star, Check, X, FileText, ExternalLink, Clock, Briefcase, GraduationCap, Building2, Mail, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Pagination from '../../components/ui/Pagination';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modales
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedAsesor, setSelectedAsesor] = useState(null);

    // Paginación
    const [currentPageSolicitudes, setCurrentPageSolicitudes] = useState(1);
    const [currentPageAsesores, setCurrentPageAsesores] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            const [statsRes, chartRes, asesoresRes, solicitudesRes] = await Promise.all([
                axiosClient.get('/Admin/dashboard-stats'),
                axiosClient.get('/Admin/revenue-chart'),
                axiosClient.get('/Admin/dashboard-asesores'),
                axiosClient.get('/Admin/pending-applications')
            ]);

            setStats(statsRes.data);
            setChartData(chartRes.data);
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

    const handleViewAsesor = async (asesorId) => {
        try {
            const res = await axiosClient.get(`/Admin/asesor-detail/${asesorId}`);
            setSelectedAsesor(res.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los detalles.', 'error');
        }
    };

    const handleApprove = async (userId) => {
        const result = await Swal.fire({ title: '¿Aprobar Asesor?', text: 'Se le otorgará el rol de Asesor inmediatamente.', icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, aprobar', confirmButtonColor: '#10b981', cancelButtonColor: '#334155', background: '#1e293b', color: '#fff' });
        if(result.isConfirmed) {
             try {
                await axiosClient.post(`/Admin/approve/${userId}`);
                Swal.fire({ title: 'Aprobado', icon: 'success', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#fff' });
                fetchData();
                setSelectedRequest(null);
             } catch (e) {
                Swal.fire({ title: 'Error', text: 'No se pudo aprobar.', icon: 'error', background: '#1e293b', color: '#fff' });
             }
        }
    };

    const handleReject = async (userId) => {
        const result = await Swal.fire({ title: '¿Rechazar solicitud?', text: 'Esta acción es irreversible.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, rechazar', confirmButtonColor: '#ef4444', cancelButtonColor: '#334155', background: '#1e293b', color: '#fff' });
        if(result.isConfirmed) {
             try {
                await axiosClient.post(`/Admin/reject/${userId}`);
                Swal.fire({ title: 'Rechazado', icon: 'success', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#fff' });
                fetchData();
                setSelectedRequest(null);
             } catch (e) {
                Swal.fire({ title: 'Error', text: 'No se pudo rechazar.', icon: 'error', background: '#1e293b', color: '#fff' });
             }
        }
    };

    const currentSolicitudes = solicitudes.slice((currentPageSolicitudes - 1) * itemsPerPage, currentPageSolicitudes * itemsPerPage);
    const currentAsesores = asesores.slice((currentPageAsesores - 1) * itemsPerPage, currentPageAsesores * itemsPerPage);

    const pieData = [
        { name: 'Aprobados', value: stats?.totalAsesoresAprobados || 0 },
        { name: 'Estudiantes', value: (stats?.totalUsuarios || 0) - (stats?.totalAsesoresAprobados || 0) },
    ];
    const COLORS = ['#10b981', '#3b82f6'];

    if (loading) return <div className="text-white text-center pt-40 animate-pulse">Cargando Panel de Administración...</div>;

    return (
        <div className="container mx-auto pt-32 pb-10 px-6 space-y-12 animate-fade-in relative">
            
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Ingresos Totales" value={`$${stats?.ingresosTotales || 0}`} icon={DollarSign} color="text-emerald-400" bg="bg-emerald-500/10" />
                <StatCard title="Usuarios Totales" value={stats?.totalUsuarios || 0} icon={Users} color="text-blue-400" bg="bg-blue-500/10" />
                <StatCard title="Cursos Activos" value={stats?.totalCursosPublicados || 0} icon={BookOpen} color="text-purple-400" bg="bg-purple-500/10" />
                <StatCard title="Calidad Global" value={stats?.ratingPromedioGlobal.toFixed(1) || 0} icon={Star} color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            {/* GRÁFICAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Ingresos Mensuales ({new Date().getFullYear()})</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="mes" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                                <Bar dataKey="ingresos" fill="#6366f1" radius={[4, 4, 0, 0]} name="Ingresos ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Distribución Usuarios</h3>
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

            {/* SOLICITUDES PENDIENTES */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-orange-400" /> Solicitudes Pendientes
                    </h3>
                    <span className="text-xs font-bold bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20">{solicitudes.length} nuevas</span>
                </div>
                
                {solicitudes.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">No hay solicitudes pendientes.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-950 text-slate-200 uppercase font-semibold text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Usuario</th>
                                        <th className="px-6 py-4">Especialidad</th>
                                        <th className="px-6 py-4">Fecha</th>
                                        <th className="px-6 py-4 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {currentSolicitudes.map((sol) => (
                                        <tr key={sol.usuarioId} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">{sol.userName}</td>
                                            <td className="px-6 py-4">{sol.especialidad}</td>
                                            <td className="px-6 py-4 text-xs">{new Date(sol.fechaSolicitud).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => setSelectedRequest(sol)}
                                                    className="px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-bold border border-indigo-500/20 transition-all flex items-center justify-center gap-2 mx-auto"
                                                >
                                                    <FileText size={14} /> Revisar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-slate-950/30">
                            <Pagination itemsPerPage={itemsPerPage} totalItems={solicitudes.length} paginate={setCurrentPageSolicitudes} currentPage={currentPageSolicitudes} />
                        </div>
                    </>
                )}
            </div>
            
            {/* TOP ASESORES */}
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

            {/* --- MODAL DETALLE DE SOLICITUD (CON LINK) --- */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-indigo-400" /> Revisión de Solicitud
                            </h2>
                            <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            
                            {/* Header del Postulante */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl text-slate-400 font-bold">
                                    {selectedRequest.userName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedRequest.userName}</h3>
                                    <p className="text-indigo-400">{selectedRequest.especialidad}</p>
                                    <p className="text-slate-500 text-sm">{selectedRequest.email}</p>
                                </div>
                            </div>

                            {/* Datos Académicos y Experiencia */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-slate-400 text-xs uppercase font-bold mb-3 flex items-center gap-2"><GraduationCap size={14}/> Formación</h4>
                                    <p className="text-white font-medium">{selectedRequest.nivelEstudios}</p>
                                    <p className="text-slate-400 text-sm">{selectedRequest.institucionEducativa}</p>
                                    <p className="text-slate-500 text-xs mt-1">Graduado: {selectedRequest.anioGraduacion || 'N/A'}</p>
                                </div>
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-slate-400 text-xs uppercase font-bold mb-3 flex items-center gap-2"><Briefcase size={14}/> Experiencia</h4>
                                    <p className="text-white font-medium">{selectedRequest.aniosExperiencia} Años</p>
                                    <p className="text-slate-400 text-sm mt-1 line-clamp-3">{selectedRequest.experienciaLaboral}</p>
                                </div>
                            </div>

                            <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-2">Sobre mí</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">{selectedRequest.descripcion}</p>
                            </div>

                            {/* --- SECCIÓN DOCUMENTO (LINK EXTERNO) --- */}
                            <div className="bg-indigo-500/10 p-5 rounded-xl border border-indigo-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500 rounded-lg text-white">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Documentación / Portafolio</p>
                                        <p className="text-indigo-200 text-xs">Enlace proporcionado por el usuario</p>
                                    </div>
                                </div>
                                
                                <a 
                                    href={selectedRequest.documentoVerificacionUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-white text-indigo-900 font-bold rounded-lg text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
                                >
                                    <ExternalLink size={16} /> Visitar Enlace
                                </a>
                            </div>

                        </div>

                        <div className="p-6 border-t border-white/10 bg-slate-950/50 flex justify-end gap-3">
                            <button 
                                onClick={() => handleReject(selectedRequest.usuarioId)}
                                className="px-5 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                            >
                                <X size={16} /> Rechazar
                            </button>
                            <button 
                                onClick={() => handleApprove(selectedRequest.usuarioId)}
                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                <Check size={16} /> Aprobar Asesor
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Detalle Asesor (Igual que antes) */}
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