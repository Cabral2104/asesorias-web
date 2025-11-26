import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Upload, Send, CheckCircle, Briefcase, Book, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SolicitarAsesorPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    
    const [formData, setFormData] = useState({
        especialidad: '',
        descripcion: '',
        nivelEstudios: '',
        institucionEducativa: '',
        campoEstudio: '',
        anioGraduacion: '',
        aniosExperiencia: '',
        experienciaLaboral: '',
        certificaciones: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            Swal.fire('Falta el CV', 'Por favor adjunta tu CV en PDF o Word', 'warning');
            return;
        }

        setLoading(true);

        // Creamos el FormData para enviar archivo + datos
        const data = new FormData();
        data.append('DocumentoVerificacion', file);
        
        // Agregamos el resto de campos
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const response = await axiosClient.post('/Asesor/apply', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud Enviada!',
                    text: 'Un administrador revisará tu perfil pronto.',
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/student'); // Regresar al dashboard
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo enviar la solicitud',
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
                            <select name="nivelEstudios" onChange={handleChange} className="input-field w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" required>
                                <option value="">Selecciona...</option>
                                <option value="Licenciatura">Licenciatura</option>
                                <option value="Maestría">Maestría</option>
                                <option value="Doctorado">Doctorado</option>
                                <option value="Técnico">Técnico Superior</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Institución</label>
                            <input type="text" name="institucionEducativa" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" placeholder="Ej. UNAM, Tec de Monterrey" required />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Campo de Estudio</label>
                            <input type="text" name="campoEstudio" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" placeholder="Ej. Ingeniería de Software" required />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Año Graduación</label>
                            <input type="number" name="anioGraduacion" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" placeholder="2023" />
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
                                <input type="text" name="especialidad" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" placeholder="Ej. Matemáticas, React, Piano" required />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Años de Experiencia</label>
                                <input type="number" name="aniosExperiencia" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" placeholder="Ej. 5" required />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Resumen de Experiencia</label>
                            <textarea name="experienciaLaboral" rows="3" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" placeholder="Cuéntanos brevemente tu trayectoria..."></textarea>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Descripción para tu Perfil</label>
                            <textarea name="descripcion" rows="3" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" placeholder="Lo que verán los estudiantes..."></textarea>
                        </div>
                    </div>
                </div>

                {/* Sección Archivo */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FileText className="text-blue-400" /> Documentación
                    </h3>
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors bg-slate-950/30">
                        <input 
                            type="file" 
                            id="cvFile" 
                            className="hidden" 
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="cvFile" className="cursor-pointer flex flex-col items-center gap-3">
                            <div className="p-4 bg-slate-900 rounded-full text-indigo-400">
                                <Upload size={32} />
                            </div>
                            <div>
                                <p className="text-white font-medium text-lg">
                                    {file ? file.name : "Sube tu CV o Título"}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">PDF, DOCX (Máx 10MB)</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : <>Enviar Solicitud <Send size={20} /></>}
                    </button>
                </div>
            </form>
        </div>
    );
}