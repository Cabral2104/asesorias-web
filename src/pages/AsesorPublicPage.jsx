import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { User, Star, BookOpen, GraduationCap, Briefcase, ArrowLeft } from 'lucide-react';
import Pagination from '../components/ui/Pagination';

export default function AsesorPublicPage() {
    const { id } = useParams();
    const [asesor, setAsesor] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Paginación de cursos del perfil
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        axiosClient.get(`/Asesor/public/${id}`)
            .then(res => setAsesor(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center pt-40 text-white">Cargando perfil...</div>;
    if (!asesor) return <div className="text-center pt-40 text-white">Asesor no encontrado.</div>;

    // Paginación lógica
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCursos = asesor.cursos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mx-auto pt-32 pb-20 px-6 animate-fade-in">
            <Link to="/cursos" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 w-fit">
                <ArrowLeft size={20} /> Volver al catálogo
            </Link>

            {/* Header Perfil */}
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center md:items-start">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl font-bold text-white shadow-2xl shrink-0">
                    {asesor.nombre.charAt(0)}
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl font-bold text-white mb-2">{asesor.nombre}</h1>
                    <p className="text-xl text-indigo-400 font-medium mb-4">{asesor.especialidad}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-300 mb-6">
                        <span className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full"><Star size={16} className="text-yellow-400" /> {asesor.ratingPromedio.toFixed(1)} Rating</span>
                        <span className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full"><User size={16} /> {asesor.totalEstudiantes} Estudiantes</span>
                        <span className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full"><BookOpen size={16} /> {asesor.cursos.length} Cursos</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed max-w-3xl">{asesor.descripcion}</p>
                </div>
            </div>

            {/* Detalles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><GraduationCap className="text-emerald-400" /> Formación</h3>
                    <p className="text-slate-400">{asesor.nivelEstudios}</p>
                </div>
                <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Briefcase className="text-blue-400" /> Experiencia</h3>
                    <p className="text-slate-400">{asesor.aniosExperiencia} Años de trayectoria profesional.</p>
                </div>
            </div>

            {/* Cursos del Asesor */}
            <h2 className="text-2xl font-bold text-white mt-16 mb-8">Cursos de {asesor.nombre}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentCursos.map(curso => (
                    <div key={curso.cursoId} className="bg-slate-900 border border-white/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all group">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{curso.titulo}</h3>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">{curso.descripcion}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-emerald-400 font-bold">${curso.costo}</span>
                            <Link to="/cursos" className="text-xs text-white bg-slate-800 hover:bg-indigo-600 px-3 py-1.5 rounded transition-colors">Ver</Link>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination itemsPerPage={itemsPerPage} totalItems={asesor.cursos.length} paginate={setCurrentPage} currentPage={currentPage} />
        </div>
    );
}