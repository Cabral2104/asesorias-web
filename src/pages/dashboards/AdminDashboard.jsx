import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { DollarSign, Users, Star, Check, X, FileText, ExternalLink, Clock, Briefcase, GraduationCap, ChevronRight, Link as LinkIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Pagination from '../../components/ui/Pagination';
import ExportMenu from '../../components/ui/ExportMenu'; // <--- IMPORTANTE

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [asesoriasStats, setAsesoriasStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para Modales
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedAsesor, setSelectedAsesor] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    // Estados de Paginación
    const [currentPageSolicitudes, setCurrentPageSolicitudes] = useState(1);
    const [currentPageAsesores, setCurrentPageAsesores] = useState(1);
    const [currentPageAsesorias, setCurrentPageAsesorias] = useState(1); // Server side
    
    // Paginación para Cursos dentro del Modal
    const [currentPageAsesorCursos, setCurrentPageAsesorCursos] = useState(1);
    const itemsPerModalPage = 4;

    const itemsPerPage = 5; 
    const itemsPerPageAsesorias = 10; 

    const COLORS_USERS = ['#10b981', '#3b82f6'];
    const COLORS_INCOME = ['#6366f1', '#10b981'];

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

    const fetchAsesorias = async (page) => {
        try {
            const res = await axiosClient.get(`/Admin/asesorias-stats?page=${page}&pageSize=${itemsPerPageAsesorias}`);
            setAsesoriasStats(res.data);
        } catch (error) {
            console.error("Error cargando asesorías:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchAsesorias(currentPageAsesorias);
    }, [currentPageAsesorias]);

    const ensureProtocol = (url) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    const handleViewAsesor = async (asesorId) => {
        try {
            const res = await axiosClient.get(`/Admin/asesor-detail/${asesorId}`);
            setSelectedAsesor(res.data);
            setCurrentPageAsesorCursos(1);
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
    
    const currentModalCourses = selectedAsesor 
        ? selectedAsesor.cursos.slice((currentPageAsesorCursos - 1) * itemsPerModalPage, currentPageAsesorCursos * itemsPerModalPage) 
        : [];

    const pieDataUsers = [
        { name: 'Aprobados', value: stats?.totalAsesoresAprobados || 0 },
        { name: 'Estudiantes', value: (stats?.totalUsuarios || 0) - (stats?.totalAsesoresAprobados || 0) },
    ];

    const incomeDistributionData = asesoriasStats ? [
        { name: 'Cursos', value: stats?.ingresosTotales || 0 },
        { name: 'Asesorías', value: asesoriasStats?.ingresosTotalesAsesorias || 0 }
    ] : [];

    if (loading) return <div className="text-white text-center pt-40 animate-pulse">Cargando Panel de Administración...</div>;

    return (
        <div className="container mx-auto pt-32 pb-10 px-6 space-y-12 animate-fade-in relative">
            {/* 1. TARJETAS KPI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Ingresos Totales" value={`$${((stats?.ingresosTotales || 0) + (asesoriasStats?.ingresosTotalesAsesorias || 0)).toFixed(2)}`} icon={DollarSign} color="text-emerald-400" bg="bg-emerald-500/10" />
                <StatCard title="Usuarios Totales" value={stats?.totalUsuarios || 0} icon={Users} color="text-blue-400" bg="bg-blue-500/10" />
                <StatCard title="Servicios Activos" value={(stats?.totalCursosPublicados || 0) + (asesoriasStats?.totalAsesoriasCerradas || 0)} icon={Briefcase} color="text-purple-400" bg="bg-purple-500/10" />
                <StatCard title="Calidad Global" value={stats?.ratingPromedioGlobal.toFixed(1) || 0} icon={Star} color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            {/* 2. GRÁFICAS Y REPORTE DE INGRESOS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Ingresos Mensuales</h3>
                        
                        {/* --- EXPORTAR INGRESOS --- */}
                        <ExportMenu 
                            endpoint="/Admin/revenue-chart" 
                            fileName="Reporte_Ingresos_Lumina" 
                            title="Reporte Financiero Mensual"
                            formatData={(item) => ({
                                Mes: item.mes,
                                Ingresos_Cursos: `$${item.ingresosCursos}`,
                                Ingresos_Asesorias: `$${item.ingresosAsesorias}`,
                                Total: `$${(item.ingresosCursos + item.ingresosAsesorias)}`
                            })}
                        />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="mes" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} />
                                <Legend verticalAlign="top" height={36}/>
                                <Bar dataKey="ingresosCursos" name="Cursos" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="ingresosAsesorias" name="Asesorías" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl flex-1">
                        <h3 className="text-sm font-bold text-white mb-4">Fuente de Ingresos</h3>
                        <div className="h-[150px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={incomeDistributionData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                        {incomeDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                                    <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={8}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-xl flex-1">
                        <h3 className="text-sm font-bold text-white mb-4">Usuarios</h3>
                        <div className="h-[150px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieDataUsers} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                        {pieDataUsers.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_USERS[index % COLORS_USERS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                                    <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={8}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. ASESORÍAS PERSONALIZADAS CERRADAS */}
            {asesoriasStats && (
                <div className="bg-slate-900/60 border border-indigo-500/30 rounded-2xl overflow-hidden">
                    <div className="p-8 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Check className="text-emerald-400" /> Asesorías Personalizadas Cerradas
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase">Total Generado</p>
                                <p className="text-xl font-bold text-emerald-400 font-mono">${asesoriasStats.ingresosTotalesAsesorias.toFixed(2)}</p>
                            </div>
                            
                            {/* --- EXPORTAR ASESORÍAS --- */}
                            <ExportMenu 
                                endpoint="/Admin/asesorias-stats" 
                                fileName="Reporte_Asesorias_Cerradas"
                                title="Historial de Asesorías Cerradas"
                                formatData={(item) => ({
                                    ID: item.solicitudId,
                                    Materia: item.materia,
                                    Tema: item.tema,
                                    Precio: `$${item.precio}`,
                                    Estudiante: item.nombreEstudiante,
                                    Fecha_Cierre: new Date(item.fechaAceptacion).toLocaleDateString()
                                })}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto bg-slate-950">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900/50 text-xs uppercase font-bold text-slate-500">
                                <tr>
                                    <th className="px-6 py-3">Estudiante</th>
                                    <th className="px-6 py-3">Materia / Tema</th>
                                    <th className="px-6 py-3">Precio</th>
                                    <th className="px-6 py-3">Fecha Cierre</th>
                                    <th className="px-6 py-3 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {asesoriasStats.ultimasAsesorias?.map(job => (
                                    <tr key={job.solicitudId} onClick={() => setSelectedJob(job)} className="hover:bg-white/5 cursor-pointer transition-colors">
                                        <td className="px-6 py-3 text-white font-medium">{job.nombreEstudiante}</td>
                                        <td className="px-6 py-3"><span className="bg-slate-800 px-2 py-0.5 rounded text-xs mr-2">{job.materia}</span>{job.tema}</td>
                                        <td className="px-6 py-3 font-mono text-emerald-400 font-bold">${job.precio}</td>
                                        <td className="px-6 py-3">{new Date(job.fechaAceptacion).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-right"><ChevronRight size={16} /></td>
                                    </tr>
                                ))}
                                {asesoriasStats.ultimasAsesorias?.length === 0 && (
                                    <tr><td colSpan="5" className="text-center py-4 italic">No hay registros recientes.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {asesoriasStats.totalAsesoriasCerradas > itemsPerPageAsesorias && (
                        <div className="p-4 border-t border-white/10 bg-slate-950/30">
                            <Pagination itemsPerPage={itemsPerPageAsesorias} totalItems={asesoriasStats.totalAsesoriasCerradas} paginate={setCurrentPageAsesorias} currentPage={currentPageAsesorias} />
                        </div>
                    )}
                </div>
            )}

            {/* 4. SOLICITUDES DE ROL ASESOR */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-orange-400" /> Solicitudes de Nuevo Asesor
                    </h3>
                    <div className="flex gap-3 items-center">
                        <span className="text-xs font-bold bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20">{solicitudes.length} pendientes</span>
                        
                        {/* --- EXPORTAR SOLICITUDES --- */}
                        <ExportMenu 
                            endpoint="/Admin/pending-applications" 
                            fileName="Solicitudes_Pendientes_Asesores"
                            title="Solicitudes de Ingreso - Asesores"
                            formatData={(item) => ({
                                Usuario: item.userName,
                                Email: item.email,
                                Especialidad: item.especialidad,
                                Nivel_Estudios: item.nivelEstudios,
                                Experiencia: `${item.aniosExperiencia} años`
                            })}
                        />
                    </div>
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
                                                <button onClick={() => setSelectedRequest(sol)} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-bold border border-indigo-500/20 transition-all flex items-center justify-center gap-2 mx-auto">
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
            
            {/* 5. DIRECTORIO DE ASESORES */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h3 className="text-xl font-bold text-white">Directorio de Asesores</h3>
                    
                    {/* --- EXPORTAR DIRECTORIO --- */}
                    <ExportMenu 
                        endpoint="/Admin/dashboard-asesores" 
                        fileName="Directorio_Asesores_Activos"
                        title="Directorio Oficial de Asesores"
                        formatData={(item) => ({
                            ID: item.asesorId,
                            Nombre: item.nombreAsesor,
                            Cursos_Activos: item.totalCursos,
                            Ingresos_Totales: `$${item.ingresosGenerados}`,
                            Rating: item.ratingPromedio.toFixed(1)
                        })}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-6 py-4">Asesor</th>
                                <th className="px-6 py-4 text-center">Cursos</th>
                                <th className="px-6 py-4 text-right">Ingresos Cursos</th>
                                <th className="px-6 py-4 text-right">Ingresos Asesorías</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-right">Rating</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentAsesores.map((asesor) => (
                                <tr key={asesor.asesorId} onClick={() => handleViewAsesor(asesor.asesorId)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">{asesor.nombreAsesor.charAt(0)}</div>
                                        {asesor.nombreAsesor}
                                    </td>
                                    <td className="px-6 py-4 text-center">{asesor.totalCursos}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-300">${asesor.ingresosCursos}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-300">${asesor.ingresosAsesorias}</td>
                                    <td className="px-6 py-4 text-right font-mono text-emerald-400 font-bold">${asesor.ingresosGenerados}</td>
                                    <td className="px-6 py-4 text-right text-yellow-400 font-bold flex justify-end items-center gap-1">{asesor.ratingPromedio.toFixed(1)} <Star size={14} fill="currentColor"/></td>
                                    <td className="px-6 py-4 text-right"><ChevronRight size={16} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-white/10 bg-slate-950/30">
                    <Pagination itemsPerPage={itemsPerPage} totalItems={asesores.length} paginate={setCurrentPageAsesores} currentPage={currentPageAsesores} />
                </div>
            </div>

            {/* --- MODALES (Sin cambios) --- */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                            <h3 className="font-bold text-white">Detalle del Servicio</h3>
                            <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Tema</label>
                                <p className="text-white text-lg font-bold">{selectedJob.tema}</p>
                                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded mt-1 inline-block">{selectedJob.materia}</span>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                                <p className="text-slate-300 text-sm mt-1 bg-slate-950/50 p-3 rounded-lg border border-white/5 max-h-40 overflow-y-auto">"{selectedJob.descripcion}"</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Cliente</label>
                                    <p className="text-white text-sm">{selectedJob.nombreEstudiante}</p>
                                    <p className="text-slate-500 text-xs">{selectedJob.emailEstudiante}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Costo Final</label>
                                    <p className="text-emerald-400 font-mono font-bold text-lg">${selectedJob.precio}</p>
                                </div>
                            </div>
                            {selectedJob.archivoUrl && (
                                <div className="pt-2">
                                    <a href={ensureProtocol(selectedJob.archivoUrl)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                                        <LinkIcon size={16} /> Ver Material Adjunto
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="text-indigo-400" /> Revisión de Solicitud</h2>
                            <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl text-slate-400 font-bold">{selectedRequest.userName.charAt(0)}</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedRequest.userName}</h3>
                                    <p className="text-indigo-400">{selectedRequest.especialidad}</p>
                                    <p className="text-slate-500 text-sm">{selectedRequest.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-slate-400 text-xs uppercase font-bold mb-3 flex items-center gap-2"><GraduationCap size={14}/> Formación</h4>
                                    <p className="text-white font-medium">{selectedRequest.nivelEstudios}</p>
                                    <p className="text-slate-400 text-sm">{selectedRequest.institucionEducativa}</p>
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
                            <div className="bg-indigo-500/10 p-5 rounded-xl border border-indigo-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <a href={ensureProtocol(selectedRequest.documentoVerificacionUrl)} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-indigo-900 font-bold rounded-lg text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
                                    <ExternalLink size={16} /> Ver Documento
                                </a>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 bg-slate-950/50 flex justify-end gap-3">
                            <button onClick={() => handleReject(selectedRequest.usuarioId)} className="px-5 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold text-sm transition-all">Rechazar</button>
                            <button onClick={() => handleApprove(selectedRequest.usuarioId)} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all">Aprobar</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedAsesor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600 shrink-0">
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
                            <div className="grid grid-cols-4 gap-4 mb-8">
                                <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Total Ingresos</p>
                                    <p className="text-2xl font-bold text-emerald-400">${selectedAsesor.totalIngresos}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Estudiantes</p>
                                    <p className="text-2xl font-bold text-blue-400">{selectedAsesor.totalEstudiantes}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Cursos</p>
                                    <p className="text-2xl font-bold text-white">{selectedAsesor.totalCursos}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Asesorías</p>
                                    <p className="text-2xl font-bold text-white">{selectedAsesor.totalAsesorias}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Cursos Publicados</h3>
                                    <div className="space-y-3">
                                        {currentModalCourses.map((curso, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-950/30 p-3 rounded-lg border border-white/5">
                                                <div><p className="text-white font-medium line-clamp-1">{curso.titulo}</p><p className="text-xs text-slate-500">{curso.inscritos} inscritos</p></div>
                                                <span className="text-emerald-400 font-mono text-sm font-bold">${curso.costo}</span>
                                            </div>
                                        ))}
                                        {selectedAsesor.cursos.length === 0 && <p className="text-slate-500 text-sm italic">Sin cursos.</p>}
                                    </div>
                                    {selectedAsesor.cursos.length > itemsPerModalPage && (
                                        <div className="mt-4 flex justify-center">
                                            <Pagination itemsPerPage={itemsPerModalPage} totalItems={selectedAsesor.cursos.length} paginate={setCurrentPageAsesorCursos} currentPage={currentPageAsesorCursos} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Historial de Asesorías</h3>
                                    <div className="space-y-3">
                                        {selectedAsesor.asesorias && selectedAsesor.asesorias.map((asesoria, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-950/30 p-3 rounded-lg border border-white/5">
                                                <div><p className="text-white font-medium">{asesoria.materia}</p><p className="text-xs text-slate-500">{new Date(asesoria.fecha).toLocaleDateString()} - {asesoria.estudiante}</p></div>
                                                <span className="text-emerald-400 font-mono text-sm font-bold">${asesoria.precio}</span>
                                            </div>
                                        ))}
                                        {(!selectedAsesor.asesorias || selectedAsesor.asesorias.length === 0) && <p className="text-slate-500 text-sm italic">Sin asesorías privadas.</p>}
                                    </div>
                                </div>
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