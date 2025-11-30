import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { PlayCircle, CheckCircle, ArrowLeft, Menu, ChevronRight, Circle, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import RateCourseModal from '../components/ui/RateCourseModal'; // <--- IMPORTAR MODAL

export default function CursoPlayerPage() {
    const { cursoId } = useParams();
    const navigate = useNavigate();
    const [lecciones, setLecciones] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [completedIds, setCompletedIds] = useState([]); // IDs completados
    const [progressStats, setProgressStats] = useState({ porcentaje: 0, completadas: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showRateModal, setShowRateModal] = useState(false); // <--- ESTADO PARA EL MODAL

    // Cargar Lecciones y Progreso
    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Cargar Lecciones
                const leccionesRes = await axiosClient.get(`/leccion/curso/${cursoId}`);
                setLecciones(leccionesRes.data);
                if (leccionesRes.data.length > 0) {
                    setCurrentLesson(leccionesRes.data[0]);
                }

                // 2. Cargar Progreso
                const progresoRes = await axiosClient.get(`/Progreso/curso/${cursoId}`);
                setCompletedIds(progresoRes.data.leccionesCompletadasIds);
                setProgressStats({
                    porcentaje: progresoRes.data.porcentaje,
                    completadas: progresoRes.data.leccionesCompletadas,
                    total: progresoRes.data.leccionesTotales
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [cursoId]);

    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        return url;
    };

    // Marcar/Desmarcar lección
    const toggleCompletion = async (leccionId) => {
        const isCompleted = completedIds.includes(leccionId);
        
        let newCompletedIds;
        if (isCompleted) {
            newCompletedIds = completedIds.filter(id => id !== leccionId);
        } else {
            newCompletedIds = [...completedIds, leccionId];
        }
        setCompletedIds(newCompletedIds);

        // Calcular porcentaje localmente
        const newPercent = (newCompletedIds.length / lecciones.length) * 100;
        setProgressStats({
            ...progressStats,
            completadas: newCompletedIds.length,
            porcentaje: newPercent
        });

        try {
            await axiosClient.post(`/Progreso/marcar/${leccionId}`, !isCompleted, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error("Error guardando progreso", error);
        }
    };

    const handleNext = () => {
        if (currentLesson && !completedIds.includes(currentLesson.leccionId)) {
            toggleCompletion(currentLesson.leccionId);
        }

        const currentIndex = lecciones.findIndex(l => l.leccionId === currentLesson.leccionId);
        if (currentIndex < lecciones.length - 1) {
            setCurrentLesson(lecciones[currentIndex + 1]);
        } else {
            Swal.fire({ title: '¡Felicidades!', text: 'Has llegado al final del curso.', icon: 'success', background: '#1e293b', color: '#fff' });
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-white">Cargando contenido...</div>;

    if (lecciones.length === 0) return (
        <div className="h-screen flex flex-col items-center justify-center text-white gap-4">
            <p>Este curso aún no tiene contenido.</p>
            <button onClick={() => navigate('/profile')} className="text-indigo-400 hover:underline">Volver</button>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden pt-[70px]">
            
            {/* MODAL DE CALIFICACIÓN */}
            {showRateModal && (
                <RateCourseModal 
                    cursoId={cursoId} 
                    onClose={() => setShowRateModal(false)}
                    onRated={() => {/* Opcional: recargar algo si se necesita */}} 
                />
            )}

            {/* --- SIDEBAR --- */}
            <div className={`fixed inset-y-0 left-0 z-20 w-80 bg-slate-900 border-r border-white/10 transform transition-transform duration-300 pt-[80px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:pt-0 flex flex-col`}>
                
                {/* Header Progreso */}
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-white font-bold mb-3">Tu Progreso</h3>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2">
                        <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressStats.porcentaje}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 text-right">{progressStats.completadas} / {progressStats.total} lecciones ({progressStats.porcentaje.toFixed(0)}%)</p>
                </div>

                <div className="overflow-y-auto flex-1 pb-20">
                    {lecciones.map((leccion, index) => {
                        const isCompleted = completedIds.includes(leccion.leccionId);
                        const isActive = currentLesson?.leccionId === leccion.leccionId;

                        return (
                            <button
                                key={leccion.leccionId}
                                onClick={() => {
                                    setCurrentLesson(leccion);
                                    if(window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                className={`w-full text-left p-4 border-b border-white/5 flex items-center gap-3 hover:bg-white/5 transition-colors ${isActive ? 'bg-indigo-600/10 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div onClick={(e) => { e.stopPropagation(); toggleCompletion(leccion.leccionId); }} className="cursor-pointer shrink-0">
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-indigo-400 transition-colors"></div>
                                    )}
                                </div>

                                <div>
                                    <p className={`text-sm font-medium ${isActive ? 'text-indigo-300' : isCompleted ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                                        {index + 1}. {leccion.titulo}
                                    </p>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Video</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- ÁREA PRINCIPAL --- */}
            <div className="flex-1 flex flex-col h-full relative bg-black">
                
                {!sidebarOpen && (
                    <button onClick={() => setSidebarOpen(true)} className="absolute top-4 left-4 z-10 p-2 bg-slate-800 rounded-lg text-white lg:hidden shadow-lg"><Menu size={20} /></button>
                )}

                {/* Reproductor */}
                <div className="flex-1 flex items-center justify-center relative group">
                    {currentLesson ? (
                        <iframe 
                            src={getEmbedUrl(currentLesson.contenidoUrl)} 
                            title={currentLesson.titulo}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <p className="text-slate-500">Selecciona una lección</p>
                    )}
                </div>

                {/* Barra Inferior */}
                <div className="h-20 bg-slate-900 border-t border-white/10 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => toggleCompletion(currentLesson.leccionId)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${completedIds.includes(currentLesson?.leccionId) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            {completedIds.includes(currentLesson?.leccionId) ? <><CheckCircle size={16}/> Completada</> : <><Circle size={16}/> Marcar vista</>}
                        </button>

                        {/* BOTÓN CALIFICAR */}
                        <button 
                            onClick={() => setShowRateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-slate-800 text-yellow-400 hover:bg-slate-700 transition-colors border border-yellow-500/20"
                        >
                            <Star size={16} fill="currentColor" /> Calificar Curso
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => navigate('/profile')} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">Salir</button>
                        <button onClick={handleNext} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
                            Siguiente <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}