import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, Shield, Zap, Globe, Loader2, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import PaymentModal from '../components/ui/PaymentModal'; // <--- IMPORTANTE

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    visible: { transition: { staggerChildren: 0.2 } }
};

export default function HomePage() {
    const [popularCourses, setPopularCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [selectedCurso, setSelectedCurso] = useState(null); // <--- ESTADO DEL MODAL

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Cargar cursos al montar
    useEffect(() => {
        axiosClient.get('/curso/publicos')
            .then(res => {
                // Tomamos solo los primeros 3 para mostrar en el Home
                setPopularCourses(res.data.slice(0, 3));
            })
            .catch(console.error)
            .finally(() => setLoadingCourses(false));
    }, []);

    // --- FUNCIÓN DE CLICK (Igual que en CursosPage) ---
    const handleBuyClick = (curso) => {
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Inicia Sesión',
                text: 'Necesitas una cuenta para inscribirte.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Ir a Login',
                background: '#1e293b', color: '#fff'
            }).then((res) => {
                if (res.isConfirmed) navigate('/login');
            });
            return;
        }

        if (user.roles.includes('Asesor')) {
            Swal.fire({ icon: 'warning', title: 'Acceso Restringido', text: 'Los asesores no pueden inscribirse (usa cuenta de estudiante).', background: '#1e293b', color: '#fff' });
            return;
        }

        // Abrir Modal
        setSelectedCurso(curso);
    };

    return (
        <div className="overflow-hidden relative">
            
            {/* --- MODAL DE PAGO --- */}
            {selectedCurso && (
                <PaymentModal 
                    curso={selectedCurso} 
                    onClose={() => setSelectedCurso(null)}
                    onSuccess={() => navigate('/profile')} 
                />
            )}

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-6 text-center z-10">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            La plataforma #1 de aprendizaje colaborativo
                        </motion.div>
                        
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white tracking-tight">
                            Conecta con el conocimiento <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">sin límites geográficos.</span>
                        </motion.h1>
                        
                        <motion.p variants={fadeInUp} className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Lumina es el puente entre estudiantes ambiciosos y expertos apasionados. Encuentra cursos, solicita asesorías privadas y eleva tu nivel académico hoy.
                        </motion.p>
                        
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/register" className="px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2">
                                Empezar Gratis <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/cursos" className="px-8 py-4 bg-slate-800/50 text-white border border-slate-700/50 font-semibold rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center gap-2 backdrop-blur-md">
                                <Search className="w-5 h-5" /> Buscar Cursos
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- SECCIÓN SOBRE NOSOTROS (FEATURES) --- */}
            <section className="py-32 bg-slate-950/50 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Por qué elegir Lumina?</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Diseñamos una experiencia educativa centrada en la calidad, la rapidez y la conexión humana.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: Shield, 
                                title: "Calidad Verificada", 
                                desc: "Todos nuestros asesores pasan por un riguroso proceso de selección y verificación de credenciales." 
                            },
                            { 
                                icon: Zap, 
                                title: "Aprendizaje Rápido", 
                                desc: "Conecta en minutos. Sin esperas largas. Obtén la ayuda que necesitas justo cuando la necesitas." 
                            },
                            { 
                                icon: Globe, 
                                title: "Comunidad Global", 
                                desc: "Accede a conocimientos de expertos de todo el mundo, rompiendo las barreras del aula tradicional." 
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-gradient-to-b from-slate-800/40 to-slate-900/20 border border-white/5 hover:border-indigo-500/30 transition-colors group">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN CURSOS DESTACADOS (REAL) --- */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Cursos Populares</h2>
                            <p className="text-slate-400">Explora lo que otros estudiantes están aprendiendo.</p>
                        </div>
                        <Link to="/cursos" className="hidden md:flex text-indigo-400 font-semibold hover:text-indigo-300 items-center gap-2">
                            Ver todos <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loadingCourses ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
                        </div>
                    ) : popularCourses.length === 0 ? (
                        <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-white/5">
                            <p className="text-slate-400">Aún no hay cursos publicados. ¡Sé el primero en crear uno!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {popularCourses.map((curso, index) => (
                                <div key={curso.cursoId} className="group rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                                    {/* Imagen Placeholder Dinámica */}
                                    <div className={`h-48 w-full bg-gradient-to-br ${index % 3 === 0 ? 'from-blue-600 to-indigo-600' : index % 3 === 1 ? 'from-purple-600 to-pink-600' : 'from-emerald-500 to-teal-600'} relative overflow-hidden shrink-0`}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                                            <Tag size={12} className="text-emerald-400" /> ${curso.costo} MXN
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-3 text-xs text-indigo-300 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                            Curso Online
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                            {curso.titulo}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                                            {curso.descripcion}
                                        </p>
                                        
                                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                    {curso.asesorNombre.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm text-slate-300">{curso.asesorNombre}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                                                <Star className="w-4 h-4 fill-current" /> 
                                                {curso.promedioCalificacion > 0 ? curso.promedioCalificacion.toFixed(1) : "N/A"}
                                            </div>
                                        </div>

                                        {/* BOTÓN DE INSCRIPCIÓN DIRECTA */}
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
                    
                    <div className="mt-10 text-center md:hidden">
                        <Link to="/cursos" className="text-indigo-400 font-semibold hover:text-indigo-300 inline-flex items-center gap-2">
                            Ver todos los cursos <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN TESTIMONIOS Y FOOTER (IGUAL QUE ANTES) --- */}
            <section className="py-32 bg-slate-900/30 border-t border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">Lo que dicen nuestros estudiantes</h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { text: "Lumina cambió mi forma de estudiar. Encontré un asesor de cálculo en 10 minutos.", author: "Sofía R.", role: "Estudiante de Ingeniería" },
                            { text: "La calidad de los cursos es superior. No es solo video, es interacción real.", author: "Carlos M.", role: "Desarrollador Junior" },
                            { text: "Poder solicitar una asesoría específica para mi proyecto final fue un salvavidas.", author: "Ana P.", role: "Estudiante de Arquitectura" }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/5 text-left">
                                <div className="flex text-amber-400 mb-4">
                                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-slate-300 mb-6 italic">"{testimonial.text}"</p>
                                <div>
                                    <p className="text-white font-bold">{testimonial.author}</p>
                                    <p className="text-indigo-400 text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/20"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para empezar?</h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">Únete hoy a la comunidad de aprendizaje más grande y comienza a construir tu futuro.</p>
                    <Link to="/register" className="px-10 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-slate-100 transition-colors shadow-xl inline-block">
                        Crear Cuenta Gratis
                    </Link>
                </div>
            </section>
        </div>
    );
}