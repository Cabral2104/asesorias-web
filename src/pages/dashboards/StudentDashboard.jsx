import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { BookOpen, Search, PlayCircle, GraduationCap, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';

export default function StudentDashboard() {
    const [misCursos, setMisCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get('/estudiante/mis-cursos')
            .then(res => setMisCursos(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCursos = misCursos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Mi Aprendizaje</h2>
                    <p className="text-slate-400 mt-1">Cursos en progreso.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/solicitudes" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all border border-white/10">
                        <HelpCircle size={16} /> Ver Solicitudes
                    </Link>
                    <Link to="/solicitar-asesor" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all border border-white/10">
                        <GraduationCap size={16} /> Ser Asesor
                    </Link>
                    <Link to="/cursos" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
                        <Search size={16} /> Catálogo
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-white text-center py-20 animate-pulse">Cargando tus cursos...</div>
            ) : misCursos.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-white/5 border-dashed">
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={28} className="text-slate-500" />
                    </div>
                    <h3 className="text-lg text-white font-bold mb-2">Aún no tienes inscripciones</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">Descubre cientos de cursos impartidos por expertos.</p>
                    <Link to="/cursos" className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">Ir al catálogo →</Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentCursos.map(curso => (
                            <div key={curso.cursoId} className="group bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all hover:-translate-y-1 shadow-lg">
                                <div className="h-36 bg-gradient-to-br from-slate-800 to-slate-700 relative cursor-pointer" onClick={() => navigate(`/classroom/${curso.cursoId}`)}>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                        <PlayCircle size={40} className="text-white scale-90 group-hover:scale-100 transition-transform" />
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{curso.titulo}</h3>
                                    <p className="text-slate-400 text-xs line-clamp-2 mb-4">{curso.descripcion}</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <span className="text-xs text-slate-500">Instructor: <span className="text-slate-300">{curso.asesorNombre}</span></span>
                                        <button 
                                            onClick={() => navigate(`/classroom/${curso.cursoId}`)}
                                            className="text-xs font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-1"
                                        >
                                            Continuar <PlayCircle size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination itemsPerPage={itemsPerPage} totalItems={misCursos.length} paginate={setCurrentPage} currentPage={currentPage} />
                </>
            )}
        </div>
    );
}