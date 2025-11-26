import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        userName: '', // Este será el Nombre Completo visual
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseñas no coinciden',
                text: 'Por favor verifica que ambas contraseñas sean iguales.',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        setLoading(true);

        try {
            // Enviamos los datos al endpoint de registro
            // Nota: El backend espera 'userName' como nombre completo y 'email' como identificador único
            const payload = {
                userName: formData.userName,
                email: formData.email,
                password: formData.password
            };

            const response = await axiosClient.post('/Auth/register', payload);

            if (response.data.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Cuenta Creada!',
                    text: 'Tu registro fue exitoso. Ahora puedes iniciar sesión.',
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/login'); // Redirigimos al login para que entre con sus nuevas credenciales
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'Ocurrió un error al registrarse.';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMsg,
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md p-8 bg-slate-900/50 border border-white/10 rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-2xl">
                {/* Decoración superior */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>

                <h2 className="text-2xl font-bold text-white text-center mb-2">Crear Cuenta</h2>
                <p className="text-slate-400 text-center mb-8 text-sm">Únete a Lumina y comienza a aprender</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Nombre Completo */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Nombre Completo</label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <input 
                                type="text" 
                                name="userName"
                                value={formData.userName} 
                                onChange={handleChange} 
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder-slate-600" 
                                placeholder="Ej. Juan Pérez" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Correo Electrónico</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email} 
                                onChange={handleChange} 
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder-slate-600" 
                                placeholder="tu@correo.com" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Contraseña</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password} 
                                onChange={handleChange} 
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder-slate-600" 
                                placeholder="Mínimo 6 caracteres" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Confirmar Contraseña</label>
                        <div className="relative mt-1">
                            <CheckCircle className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none placeholder-slate-600" 
                                placeholder="Repite tu contraseña" 
                                required 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Crear Cuenta <ArrowRight className="w-4 h-4" /></>}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-slate-400">
                            ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Inicia Sesión</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}