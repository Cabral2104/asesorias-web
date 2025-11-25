import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Nuevo Logo / Nombre */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Lumina<span className="text-indigo-400">.</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {['Inicio', 'Cursos', 'Mentores', 'Comunidad'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            {item}
                        </a>
                    ))}

                    <div className="h-4 w-px bg-white/10 mx-2"></div>

                    {!isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-white hover:text-indigo-300 transition-colors">
                                Ingresar
                            </Link>
                            <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-white text-slate-950 rounded-full hover:bg-indigo-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                Comenzar Gratis
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                                <User className="w-4 h-4" />
                                Mi Panel
                            </Link>
                            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors" title="Cerrar Sesión">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-950 border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-6 flex flex-col gap-4">
                            <Link to="/" className="text-slate-300 hover:text-white text-lg">Inicio</Link>
                            <Link to="/cursos" className="text-slate-300 hover:text-white text-lg">Explorar Cursos</Link>
                            <div className="h-px bg-white/10 my-2"></div>
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" className="text-white font-semibold">Iniciar Sesión</Link>
                                    <Link to="/register" className="text-indigo-400 font-semibold">Crear Cuenta</Link>
                                </>
                            ) : (
                                <Link to="/dashboard" className="text-indigo-400">Ir al Dashboard</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}