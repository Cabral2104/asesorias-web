import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Send, Briefcase, Book, Link as LinkIcon } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SolicitarAsesorPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Estado único para todo el formulario
    const [formData, setFormData] = useState({
        especialidad: '',
        descripcion: '',
        nivelEstudios: '',
        institucionEducativa: '',
        campoEstudio: '',
        anioGraduacion: '',
        aniosExperiencia: '',
        experienciaLaboral: '',
        certificaciones: '',
        documentoUrl: '' // <--- NUEVO CAMPO
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Preparar el Payload (JSON simple)
        const payload = {
            ...formData,
            // Aseguramos tipos numéricos
            aniosExperiencia: parseInt(formData.aniosExperiencia) || 0,
            anioGraduacion: formData.anioGraduacion ? parseInt(formData.anioGraduacion) : null,
            // El documentoUrl se envía tal cual
        };

        try {
            // Enviamos JSON estándar (Axios lo maneja automático)
            const response = await axiosClient.post('/Asesor/apply', payload);

            if (response.data.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud Enviada!',
                    text: 'Tu perfil ha sido recibido. Un administrador revisará tu enlace.',
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/profile'); // Regresar al perfil
            }
        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            const msg = error.response?.data?.message || 'Ocurrió un error al procesar tu solicitud.';
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: msg,
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto pt-32 pb-20 px-6 animate-fade-in max-w-4xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Aplica para ser Asesor</h1>
                <p className="text-slate-400">Comparte tu conocimiento y gana dinero enseñando lo que amas.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Sección Académica */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Book className="text-indigo-400" /> Información Académica
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Nivel de Estudios</label>
                            <select 
                                name="nivelEstudios" 
                                value={formData.nivelEstudios}
                                onChange={handleChange} 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                                required
                            >
                                <option value="">Selecciona...</option>
                                <option value="Licenciatura">Licenciatura</option>
                                <option value="Maestría">Maestría</option>
                                <option value="Doctorado">Doctorado</option>
                                <option value="Técnico">Técnico Superior</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Institución</label>
                            <input 
                                type="text" 
                                name="institucionEducativa" 
                                value={formData.institucionEducativa}
                                onChange={handleChange} 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                                placeholder="Ej. UNAM, Tec de Monterrey" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Campo de Estudio</label>
                            <input 
                                type="text" 
                                name="campoEstudio" 
                                value={formData.campoEstudio}
                                onChange={handleChange} 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                                placeholder="Ej. Ingeniería de Software" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Año Graduación</label>
                            <input 
                                type="number" 
                                name="anioGraduacion" 
                                value={formData.anioGraduacion}
                                onChange={handleChange} 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                                placeholder="2023" 
                            />
                        </div>
                    </div>
                </div>

                {/* Sección Experiencia */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Briefcase className="text-emerald-400" /> Experiencia Profesional
                    </h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Especialidad Principal</label>
                                <input 
                                    type="text" 
                                    name="especialidad" 
                                    value={formData.especialidad}
                                    onChange={handleChange} 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                                    placeholder="Ej. Matemáticas, React, Piano" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Años de Experiencia</label>
                                <input 
                                    type="number" 
                                    name="aniosExperiencia" 
                                    value={formData.aniosExperiencia}
                                    onChange={handleChange} 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                                    placeholder="Ej. 5" 
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Resumen de Experiencia</label>
                            <textarea 
                                name="experienciaLaboral" 
                                rows="3" 
                                value={formData.experienciaLaboral}
                                onChange={handleChange} 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                                placeholder="Cuéntanos brevemente tu trayectoria..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Descripción para tu Perfil</label>
                            <textarea 
                                name="descripcion" 
                                rows="3" 
                                value={formData.descripcion}
                                onChange={handleChange} 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors" 
                                placeholder="Lo que verán los estudiantes en tu perfil..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN NUEVA: ENLACE EXTERNO --- */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <LinkIcon className="text-blue-400" /> Documentación (Enlace)
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <p className="text-sm text-blue-200">
                                Por favor, proporciona un enlace público (Google Drive, OneDrive, Dropbox, LinkedIn o tu Portafolio Web) donde podamos ver tu CV y certificaciones.
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 block mb-2">URL del Documento / Portafolio</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                <input 
                                    type="url" 
                                    name="documentoUrl"
                                    value={formData.documentoUrl}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-colors placeholder-slate-600" 
                                    placeholder="https://drive.google.com/..." 
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : <>Enviar Solicitud <Send size={20} /></>}
                    </button>
                </div>
            </form>
        </div>
    );
}