import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Tag, ArrowRight, Loader2, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import PaymentModal from '../components/ui/PaymentModal'; // <--- IMPORTAR

export default function CursosPage() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCurso, setSelectedCurso] = useState(null); // <--- ESTADO PARA EL MODAL
    
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // ... useEffect carga de cursos (queda igual) ...
    useEffect(() => {
        axiosClient.get('/curso/publicos')
            .then(res => setCursos(res.data))
            .catch(err => console.error("Error cargando cursos", err))
            .finally(() => setLoading(false));
    }, []);

    // Filtrar cursos por buscador (queda igual)
    const filteredCursos = cursos.filter(curso => 
        curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.asesorNombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // NUEVA FUNCIÓN DE CLICK
    const handleBuyClick = (curso) => {
        if (!isAuthenticated) {
            Swal.fire({ title: 'Inicia Sesión', text: 'Necesitas una cuenta para inscribirte.', icon: 'info', showCancelButton: true, confirmButtonText: 'Ir a Login', background: '#1e293b', color: '#fff' }).then((res) => {
                if (res.isConfirmed) navigate('/login');
            });
            return;
        }

        if (user.roles.includes('Asesor')) {
            Swal.fire({ icon: 'warning', title: 'Acceso Restringido', text: 'Los asesores no pueden inscribirse (usa cuenta de estudiante).', background: '#1e293b', color: '#fff' });
            return;
        }

        // Si todo bien, abrimos el modal
        setSelectedCurso(curso);
    };

    return (
        <div className="container mx-auto pt-32 pb-20 px-6 animate-fade-in min-h-screen relative">
            
            {/* RENDERIZAR MODAL SI HAY CURSO SELECCIONADO */}
            {selectedCurso && (
                <PaymentModal 
                    curso={selectedCurso} 
                    onClose={() => setSelectedCurso(null)}
                    onSuccess={() => navigate('/profile')} // Redirigir al éxito
                />
            )}

            {/* ... (Header y Buscador quedan igual) ... */}

            {/* Grid de Cursos */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>
            ) : filteredCursos.length === 0 ? (
                <div className="text-center py-20">
                    <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                    <p className="text-slate-500 text-xl">No se encontraron cursos públicos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCursos.map((curso) => (
                        <div key={curso.cursoId} className="group bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)] transition-all duration-300 flex flex-col">
                            
                            {/* ... (Imagen y Header de card quedan igual) ... */}
                             <div className={`h-48 w-full bg-gradient-to-br ${curso.cursoId % 2 === 0 ? 'from-indigo-900 to-slate-900' : 'from-slate-800 to-purple-900'} relative p-6 flex flex-col justify-end`}>
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-bold text-white flex items-center gap-1">
                                    <Tag size={12} className="text-emerald-400" /> ${curso.costo} MXN
                                </div>
                                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">{curso.titulo}</h3>
                            </div>

                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 border border-white/5">
                                        {curso.asesorNombre.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-slate-300 font-medium">{curso.asesorNombre}</span>
                                </div>

                                <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                                    {curso.descripcion}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto mb-4">
                                    <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                                        <Star className="w-4 h-4 fill-current" /> 
                                        {curso.promedioCalificacion > 0 ? curso.promedioCalificacion.toFixed(1) : "N/A"} 
                                        <span className="text-slate-500 text-xs font-normal ml-1">({curso.totalCalificaciones})</span>
                                    </div>
                                </div>

                                {/* BOTÓN DE INSCRIPCIÓN MODIFICADO */}
                                <button 
                                    onClick={() => handleBuyClick(curso)}
                                    className="w-full py-3 bg-white/5 hover:bg-indigo-600 hover:text-white text-indigo-300 border border-indigo-500/30 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent"
                                >
                                    Inscribirse Ahora <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}