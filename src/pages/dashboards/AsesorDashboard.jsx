import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus, Edit, BarChart2, BookOpen, Star } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom'; 
import CreateCursoModal from './components/CreateCursoModal'; 

export default function AsesorDashboard() {
    const [cursos, setCursos] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const itemsPerPage = 6;
    const navigate = useNavigate(); 

    const fetchDashboardData = async () => {
        try {
            const [cursosRes, chartRes] = await Promise.all([
                axiosClient.get('/curso/mis-cursos'),
                axiosClient.get('/Asesor/chart-data') 
            ]);

            setCursos(cursosRes.data);
            setChartData(chartRes.data);
        } catch (error) {
            console.error("Error cargando dashboard", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCursos = cursos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mx-auto pt-32 pb-10 px-6 animate-fade-in relative">
            
            {isModalOpen && (
                <CreateCursoModal 
                    onClose={() => setIsModalOpen(false)} 
                    onCourseCreated={fetchDashboardData} 
                />
            )}

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Panel de Instructor</h1>
                    <p className="text-slate-400 mt-1">Gestiona tu contenido y monitorea a tus estudiantes.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Crear Nuevo Curso
                </button>
            </div>

            {/* GRÁFICA DE RENDIMIENTO */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 mb-12 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart2 className="text-indigo-400"/> Actividad de Estudiantes (Últimos 7 días)
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

            <h2 className="text-xl font-bold text-white mb-6">Mis Cursos ({cursos.length})</h2>
            
            {cursos.length === 0 ? (
                 <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-white/5 border-dashed">
                    <BookOpen size={32} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">Aún no has creado cursos.</p>
                 </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentCursos.map(curso => (
                            <div key={curso.cursoId} className="bg-slate-900 border border-white/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all group hover:-translate-y-1 shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${curso.estaPublicado ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        {curso.estaPublicado ? 'PUBLICADO' : 'BORRADOR'}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => navigate(`/manage-course/${curso.cursoId}`)} 
                                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" 
                                            title="Editar Contenido"
                                        >
                                            <Edit size={18}/>
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{curso.titulo}</h3>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{curso.descripcion}</p>
                                
                                <div className="flex justify-between items-end mt-4">
                                    <div className="text-xl font-mono font-bold text-indigo-400">${curso.costo}</div>
                                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                        <Star size={16} fill="currentColor"/> 
                                        {curso.promedioCalificacion > 0 ? curso.promedioCalificacion.toFixed(1) : "-"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination 
                        itemsPerPage={itemsPerPage} 
                        totalItems={cursos.length} 
                        paginate={setCurrentPage} 
                        currentPage={currentPage} 
                    />
                </>
            )}
        </div>
    );
}