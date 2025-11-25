import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosClient.post('/Auth/login', { email, password });
            
            if (response.data.isSuccess) {
                const { token, email: userEmail } = response.data;
                
                // Iniciar sesión
                login(token, { email: userEmail });

                // Obtener perfil para guardar roles en el contexto (opcional pero recomendado)
                try {
                    const perfilRes = await axiosClient.get('/Auth/perfil', {
                        headers: { Authorization: `Bearer ${token}` } 
                    });
                    // (El contexto AuthContext se actualizará solo si está configurado para ello)
                } catch (e) {
                    console.log("No se pudo cargar perfil completo, continuando...");
                }

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Has iniciado sesión correctamente',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1e293b',
                    color: '#fff'
                });

                // CORRECCIÓN: Redirigir a la Landing Page (Inicio)
                navigate('/'); 
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Credenciales incorrectas',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <h2 className="text-3xl font-bold text-center mb-2 text-white">Bienvenido</h2>
                <p className="text-center text-slate-400 mb-8">Ingresa a tu cuenta para continuar</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Correo</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="email" 
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Contraseña</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="password" 
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                            <>Ingresar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}