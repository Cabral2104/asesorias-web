import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axiosClient from '../../../api/axiosClient';
import Swal from 'sweetalert2';
import { Save, Lock, User, Phone, Mail, Key, CheckCircle, XCircle } from 'lucide-react';

export default function ProfileSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // Estado para datos del perfil
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        phoneNumber: ''
    });

    // Estado para el flujo de cambio de contraseña
    // 'initial' = Mostrar botón solicitar
    // 'verify'  = Mostrar inputs de Token y Nueva Contraseña
    const [passwordStep, setPasswordStep] = useState('initial');
    
    const [passwordData, setPasswordData] = useState({
        token: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                nombreCompleto: user.nombreCompleto || user.userName || '',
                phoneNumber: user.phoneNumber || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // --- ACTUALIZAR PERFIL ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.put('/Auth/profile', formData);
            if (response.data.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado',
                    text: 'Tu perfil ha sido actualizado',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar', background: '#1e293b', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    // --- PASO 1: SOLICITAR TOKEN ---
    const requestResetToken = async () => {
        setLoading(true);
        try {
            await axiosClient.post('/Auth/forgot-password', { email: user.email });
            
            Swal.fire({
                icon: 'success',
                title: 'Código Enviado',
                text: `Hemos enviado un código de seguridad a ${user.email}. Ingrésalo abajo.`,
                background: '#1e293b',
                color: '#fff'
            });
            
            // Cambiamos al modo de verificación
            setPasswordStep('verify'); 
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar el correo.', background: '#1e293b', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    // --- PASO 2: CONFIRMAR CAMBIO ---
    const confirmPasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden', background: '#1e293b', color: '#fff' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                email: user.email,
                token: passwordData.token,
                newPassword: passwordData.newPassword
            };

            const response = await axiosClient.post('/Auth/reset-password', payload);

            if (response.data.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Tu contraseña ha sido cambiada correctamente.',
                    background: '#1e293b',
                    color: '#fff'
                });
                // Reiniciamos el formulario
                setPasswordStep('initial');
                setPasswordData({ token: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            // El backend validará si el token es incorrecto o expiró (seguridad)
            const msg = error.response?.data?.message || 'Token inválido o expirado.';
            Swal.fire({ icon: 'error', title: 'Error', text: msg, background: '#1e293b', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            
            {/* --- SECCIÓN 1: DATOS PERSONALES --- */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="text-indigo-400" /> Información Personal
                </h2>
                
                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400 font-medium">Nombre Completo</label>
                        <input 
                            type="text" 
                            name="nombreCompleto"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400 font-medium">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                            <input 
                                type="tel" 
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400 font-medium">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                            <input 
                                type="email" 
                                value={user?.email || ''} 
                                disabled 
                                className="w-full bg-slate-950/50 border border-slate-800/50 rounded-lg pl-10 pr-4 py-3 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button type="submit" disabled={loading} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50">
                            <Save size={18} /> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>

            {/* --- SECCIÓN 2: SEGURIDAD (CAMBIO DE CONTRASEÑA) --- */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Lock className="text-emerald-400" /> Seguridad de la Cuenta
                </h2>

                {/* ESTADO 1: SOLICITAR CÓDIGO */}
                {passwordStep === 'initial' && (
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-slate-950/50 rounded-xl border border-white/5">
                        <div>
                            <h3 className="text-white font-bold text-lg">Contraseña</h3>
                            <p className="text-slate-400 text-sm mt-1 max-w-md">
                                Para tu seguridad, enviaremos un código único a tu correo para autorizar el cambio.
                            </p>
                        </div>
                        <button 
                            onClick={requestResetToken}
                            disabled={loading}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl transition-colors text-sm font-bold whitespace-nowrap"
                        >
                            {loading ? 'Enviando...' : 'Solicitar Código de Cambio'}
                        </button>
                    </div>
                )}

                {/* ESTADO 2: INGRESAR CÓDIGO Y NUEVA CONTRASEÑA */}
                {passwordStep === 'verify' && (
                    <form onSubmit={confirmPasswordChange} className="bg-slate-950/50 rounded-xl border border-indigo-500/30 p-6 animate-fade-in">
                        <div className="mb-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <p className="text-indigo-300 text-sm flex items-center gap-2">
                                <Mail size={16} /> Hemos enviado el código a <strong>{user.email}</strong>.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm text-slate-400 font-bold uppercase tracking-wider">Código de Verificación</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3.5 w-5 h-5 text-emerald-400" />
                                    <input 
                                        type="text" 
                                        name="token"
                                        value={passwordData.token}
                                        onChange={handlePasswordChange}
                                        className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-all font-mono tracking-widest"
                                        placeholder="Pega tu código aquí"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Confirmar Contraseña</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Repite la contraseña"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/5">
                            <button 
                                type="button"
                                onClick={() => setPasswordStep('initial')}
                                className="px-5 py-2.5 text-slate-400 hover:text-white font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                            >
                                <CheckCircle size={18} />
                                {loading ? 'Verificando...' : 'Confirmar Cambio'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

        </div>
    );
}