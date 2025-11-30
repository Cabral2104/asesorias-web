import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Swal from 'sweetalert2';
import { ArrowLeft, Plus, Trash2, Save, Eye, EyeOff, Video, Star, MessageSquare } from 'lucide-react';

export default function CursoManagerPage() {
    const { cursoId } = useParams();
    const navigate = useNavigate();
    const [curso, setCurso] = useState(null);
    const [lecciones, setLecciones] = useState([]);
    const [reseñas, setReseñas] = useState([]); // <--- Estado para reseñas
    const [loading, setLoading] = useState(true);
    
    // Estado para nueva lección
    const [newLeccion, setNewLeccion] = useState({ titulo: '', contenidoUrl: '', orden: 1 });
    const [isAdding, setIsAdding] = useState(false);

    const fetchCursoData = async () => {
        try {
            // Ahora traemos 3 cosas: Detalle, Lecciones y Reseñas
            const [cursoRes, leccionesRes, reseñasRes] = await Promise.all([
                axiosClient.get(`/curso/detalle/${cursoId}`),
                axiosClient.get(`/leccion/gestion/${cursoId}`),
                axiosClient.get(`/curso/${cursoId}/calificaciones`) // <--- Nuevo endpoint
            ]);
            
            setCurso(cursoRes.data);
            setLecciones(leccionesRes.data);
            setReseñas(reseñasRes.data);
            
            setNewLeccion(prev => ({ ...prev, orden: leccionesRes.data.length + 1 }));
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el curso', background: '#1e293b', color: '#fff' });
            navigate('/profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCursoData();
    }, [cursoId]);

    const handleTogglePublish = async () => {
        if(!curso.estaPublicado && lecciones.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Curso vacío', text: 'Agrega al menos una lección antes de publicar.', background: '#1e293b', color: '#fff' });
            return;
        }

        try {
            await axiosClient.post(`/curso/publish/${cursoId}`);
            fetchCursoData(); 
            Swal.fire({ 
                icon: 'success', 
                title: curso.estaPublicado ? 'Curso Oculto' : '¡Curso Publicado!', 
                text: curso.estaPublicado ? 'El curso ya no es visible al público.' : 'Tu curso está en vivo.',
                background: '#1e293b', color: '#fff' 
            });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar el estado.', background: '#1e293b', color: '#fff' });
        }
    };

    const handleAddLeccion = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post(`/leccion/curso/${cursoId}`, newLeccion);
            setNewLeccion({ titulo: '', contenidoUrl: '', orden: lecciones.length + 2 });
            setIsAdding(false);
            fetchCursoData();
            Swal.fire({ icon: 'success', title: 'Lección Agregada', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#fff' });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo agregar la lección.', background: '#1e293b', color: '#fff' });
        }
    };

    const handleDeleteLeccion = async (leccionId) => {
        const result = await Swal.fire({ title: '¿Eliminar lección?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#334155', background: '#1e293b', color: '#fff' });
        if (result.isConfirmed) {
            try {
                await axiosClient.delete(`/leccion/${leccionId}`);
                fetchCursoData();
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.', background: '#1e293b', color: '#fff' });
            }
        }
    };

    if (loading) return <div className="text-white text-center pt-40">Cargando Gestor...</div>;

    return (
        <div className="container mx-auto pt-32 pb-20 px-6 animate-fade-in">
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={20} /> Volver al Panel
            </button>

            {/* Header del Curso */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${curso.estaPublicado ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                            {curso.estaPublicado ? 'EN VIVO' : 'BORRADOR'}
                        </span>
                        <h1 className="text-3xl font-bold text-white">{curso.titulo}</h1>
                    </div>
                    <p className="text-slate-400 max-w-2xl">{curso.descripcion}</p>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={handleTogglePublish}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                            curso.estaPublicado 
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'
                        }`}
                    >
                        {curso.estaPublicado ? <><EyeOff size={20} /> Ocultar</> : <><Eye size={20} /> Publicar Curso</>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: LECCIONES */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Bloque Lecciones */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Contenido del Curso</h2>
                            <button onClick={() => setIsAdding(!isAdding)} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2">
                                <Plus size={20} /> Nueva Lección
                            </button>
                        </div>

                        {/* Formulario Nueva Lección */}
                        {isAdding && (
                            <form onSubmit={handleAddLeccion} className="bg-slate-800/50 border border-indigo-500/30 rounded-xl p-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Título de la lección" 
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none"
                                        value={newLeccion.titulo}
                                        onChange={e => setNewLeccion({...newLeccion, titulo: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Orden" 
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none"
                                        value={newLeccion.orden}
                                        onChange={e => setNewLeccion({...newLeccion, orden: parseInt(e.target.value)})}
                                        required
                                    />
                                    <div className="md:col-span-2">
                                        <input 
                                            type="url" 
                                            placeholder="URL del Video/Contenido (Ej: YouTube, Drive)" 
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none"
                                            value={newLeccion.contenidoUrl}
                                            onChange={e => setNewLeccion({...newLeccion, contenidoUrl: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-2">
                                        <Save size={16} /> Guardar
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Listado de Lecciones */}
                        {lecciones.length === 0 && !isAdding ? (
                            <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-white/5 border-dashed text-slate-500">
                                Este curso aún no tiene lecciones.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lecciones.map((leccion) => (
                                    <div key={leccion.leccionId} className="group flex items-center gap-4 bg-slate-900 border border-white/10 p-4 rounded-xl hover:border-indigo-500/30 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">
                                            {leccion.orden}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-white font-medium">{leccion.titulo}</h3>
                                            <a href={leccion.contenidoUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1">
                                                <Video size={12} /> Ver Contenido
                                            </a>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteLeccion(leccion.leccionId)}
                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- NUEVA SECCIÓN: RESEÑAS Y COMENTARIOS --- */}
                    <div className="space-y-6 pt-8 border-t border-white/10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MessageSquare className="text-emerald-400" /> Reseñas del Estudiante ({reseñas.length})
                        </h2>

                        {reseñas.length === 0 ? (
                            <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-white/5 text-slate-500 italic">
                                Aún no hay reseñas para este curso.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {reseñas.map((rev) => (
                                    <div key={rev.calificacionId} className="bg-slate-900/50 p-5 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                                                    {rev.nombreEstudiante.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium text-sm">{rev.nombreEstudiante}</p>
                                                    <p className="text-xs text-slate-500">{new Date(rev.fecha).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[1,2,3,4,5].map(s => (
                                                    <Star key={s} size={14} className={s <= rev.rating ? "text-yellow-400 fill-current" : "text-slate-700"} />
                                                ))}
                                            </div>
                                        </div>
                                        {rev.comentario && (
                                            <p className="text-slate-300 text-sm mt-3 bg-black/20 p-3 rounded-lg border border-white/5">
                                                "{rev.comentario}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* COLUMNA DERECHA: SIDEBAR INFO */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 sticky top-32">
                        <h3 className="text-white font-bold mb-4">Resumen</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex justify-between">
                                <span>Precio:</span>
                                <span className="text-white font-mono">${curso.costo}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Lecciones:</span>
                                <span className="text-white">{lecciones.length}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Calificación:</span>
                                <span className="text-yellow-400 font-bold flex items-center gap-1">
                                    <Star size={14} fill="currentColor"/> 
                                    {reseñas.length > 0 ? (reseñas.reduce((a,b) => a + b.rating, 0) / reseñas.length).toFixed(1) : "N/A"}
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span>Estado:</span>
                                <span className={curso.estaPublicado ? "text-emerald-400" : "text-yellow-400"}>
                                    {curso.estaPublicado ? "Público" : "Privado"}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}