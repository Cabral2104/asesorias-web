import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus, Edit, BarChart2, BookOpen, Star, Calendar, Link as LinkIcon, DollarSign, User, Mail } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom'; 
import CreateCursoModal from './components/CreateCursoModal'; 

export default function AsesorDashboard() {
    // ... (mismos estados de antes) ...
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cursos');
    const navigate = useNavigate(); 

    const [cursos, setCursos] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const itemsPerPage = 6;
    const [trabajos, setTrabajos] = useState([]);

    const fetchData = async () => {
        try {
            const [cursosRes, chartRes, trabajosRes] = await Promise.all([
                axiosClient.get('/curso/mis-cursos'),
                axiosClient.get('/Asesor/chart-data'),
                axiosClient.get('/Asesor/mis-trabajos')
            ]);
            setCursos(cursosRes.data);
            setChartData(chartRes.data);
            setTrabajos(trabajosRes.data);
        } catch (error) {
            console.error("Error cargando dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCursos = cursos.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) return <div className="text-center pt-40 text-slate-500 animate-pulse">Cargando tu panel...</div>;

    return (
        <div className="container mx-auto pt-32 pb-10 px-6 animate-fade-in relative min-h-screen">
            
            {isModalOpen && (
                <CreateCursoModal onClose={() => setIsModalOpen(false)} onCourseCreated={fetchData} />
            )}

            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Panel de Instructor</h1>
                    <p className="text-slate-400 mt-1">Gestiona tu contenido y tus servicios personalizados.</p>
                </div>
                {activeTab === 'cursos' && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
                        <Plus size={20} /> Crear Nuevo Curso
                    </button>
                )}
            </div>

            <div className="flex gap-8 border-b border-white/10 mb-10">
                <button onClick={() => setActiveTab('cursos')} className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'cursos' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>
                    Mis Cursos
                    {activeTab === 'cursos' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 rounded-t-full"></div>}
                </button>
                <button onClick={() => setActiveTab('asesorias')} className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'asesorias' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
                    Asesorías Personalizadas
                    {activeTab === 'asesorias' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-t-full"></div>}
                </button>
            </div>

            {activeTab === 'cursos' && (
                <div className="animate-fade-in space-y-12">
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart2 className="text-indigo-400"/> Inscripciones (Últimos 7 días)
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="dia" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                                    <Area type="monotone" dataKey="cantidad" stroke="#818cf8" fillOpacity={1} fill="url(#colorVisitas)" name="Nuevos Inscritos" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">Catálogo Activo ({cursos.length})</h2>
                        {cursos.length === 0 ? (
                             <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-white/5 border-dashed">
                                <BookOpen size={32} className="mx-auto text-slate-600 mb-3" />
                                <p className="text-slate-400">Aún no has creado cursos.</p>
                             </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentCursos.map(curso => (
                                        <div key={curso.cursoId} className="bg-slate-900 border border-white/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all group hover:-translate-y-1 shadow-lg flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${curso.estaPublicado ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                    {curso.estaPublicado ? 'PUBLICADO' : 'BORRADOR'}
                                                </span>
                                                <button onClick={() => navigate(`/manage-course/${curso.cursoId}`)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Editar Contenido">
                                                    <Edit size={18}/>
                                                </button>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{curso.titulo}</h3>
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{curso.descripcion}</p>
                                            <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
                                                <div className="text-xl font-mono font-bold text-indigo-400">${curso.costo}</div>
                                                <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                                    <Star size={16} fill="currentColor"/> 
                                                    {curso.promedioCalificacion > 0 ? curso.promedioCalificacion.toFixed(1) : "-"}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Pagination itemsPerPage={itemsPerPage} totalItems={cursos.length} paginate={setCurrentPage} currentPage={currentPage} />
                            </>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'asesorias' && (
                <div className="animate-fade-in space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={64} /></div>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Ingresos por Asesorías</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mt-2">${trabajos.reduce((acc, curr) => acc + curr.precio, 0).toFixed(2)}</h3>
                        </div>
                        <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10"><User size={64} /></div>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Clientes Atendidos</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{trabajos.length}</h3>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2"><Mail className="text-indigo-400" /> Historial de Trabajos Aceptados</h3>
                        </div>
                        
                        {trabajos.length === 0 ? (
                             <div className="text-center py-12 text-slate-500">Aún no tienes asesorías confirmadas. Ve al Mercado para ofertar.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4">Estudiante</th>
                                            <th className="px-6 py-4">Tema</th>
                                            <th className="px-6 py-4">Fecha</th>
                                            <th className="px-6 py-4">Precio</th>
                                            <th className="px-6 py-4">Feedback</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {trabajos.map(job => (
                                            <tr key={job.solicitudId} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-white">{job.nombreEstudiante}</div>
                                                    <div className="text-xs text-slate-500">{job.emailEstudiante}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-indigo-300 font-medium">{job.tema}</div>
                                                    <div className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded inline-block mt-1">{job.materia}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-500" /> {new Date(job.fechaLimite).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-emerald-400 font-bold">${job.precio}</td>
                                                <td className="px-6 py-4">
                                                    {job.rating ? (
                                                        <div className="flex flex-col items-start">
                                                            <div className="flex text-yellow-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={12} fill={i < job.rating ? "currentColor" : "none"} className={i < job.rating ? "" : "text-slate-700"} />
                                                                ))}
                                                            </div>
                                                            {job.comentario && (
                                                                <span className="text-[10px] text-slate-500 mt-1 italic">"{job.comentario.substring(0, 20)}{job.comentario.length > 20 && '...'}"</span>
                                                            )}
                                                        </div>
                                                    ) : <span className="text-xs text-slate-600">Pendiente</span>}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {job.archivoUrl ? (
                                                        <a href={job.archivoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/20">
                                                            <LinkIcon size={12} /> Archivo
                                                        </a>
                                                    ) : <span className="text-xs text-slate-600">-</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}