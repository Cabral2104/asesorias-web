import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { BookOpen, Search, PlayCircle, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import Pagination from '../../components/ui/Pagination';

export default function StudentDashboard() {
    const [misCursos, setMisCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate(); // Hook para navegación

    useEffect(() => {
        axiosClient.get('/estudiante/mis-cursos')
            .then(res => setMisCursos(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCursos = misCursos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mx-auto pt-32 pb-10 px-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mi Aprendizaje</h1>
                    <p className="text-slate-400 mt-1">Bienvenido de nuevo, continúa donde lo dejaste.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/solicitar-asesor" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl text-white font-semibold transition-all border border-white/10">
                        <GraduationCap size={18} /> Quiero ser Asesor
                    </Link>
                    <Link to="/cursos" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-white font-semibold transition-all shadow-lg shadow-indigo-500/20">
                        <Search size={18} /> Explorar Catálogo
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-white text-center py-20 animate-pulse">Cargando tus cursos...</div>
            ) : misCursos.length === 0 ? (
                <div className="text-center py-24 bg-slate-800/30 rounded-3xl border border-white/5 border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={32} className="text-slate-500" />
                    </div>
                    <h3 className="text-xl text-white font-bold mb-2">Aún no tienes inscripciones</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-8">Descubre cientos de cursos impartidos por expertos y lleva tu carrera al siguiente nivel.</p>
                    <Link to="/cursos" className="text-indigo-400 hover:text-indigo-300 font-semibold">Ir al catálogo →</Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentCursos.map(curso => (
                            <div key={curso.cursoId} className="group bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:-translate-y-1 shadow-lg">
                                <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-700 relative">
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm cursor-pointer"
                                        onClick={() => navigate(`/classroom/${curso.cursoId}`)}
                                    >
                                        <PlayCircle size={48} className="text-white scale-90 group-hover:scale-100 transition-transform" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">Curso</div>
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{curso.titulo}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-6">{curso.descripcion}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-xs text-slate-500">Impartido por <span className="text-slate-300">{curso.asesorNombre}</span></span>
                                        <button 
                                            onClick={() => navigate(`/classroom/${curso.cursoId}`)}
                                            className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors flex items-center gap-1"
                                        >
                                            Continuar <PlayCircle size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination 
                        itemsPerPage={itemsPerPage} 
                        totalItems={misCursos.length} 
                        paginate={setCurrentPage} 
                        currentPage={currentPage} 
                    />
                </>
            )}
        </div>
    );
}