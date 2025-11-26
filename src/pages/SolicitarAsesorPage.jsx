import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Upload, Send, CheckCircle, Briefcase, Book, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SolicitarAsesorPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Estado específico para el archivo convertido a texto
    const [fileData, setFileData] = useState({
        base64: '',
        name: ''
    });
    
    // Estado para los datos del formulario
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

    // Maneja los cambios en los inputs de texto
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Maneja la selección del archivo y lo convierte a Base64
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validación de tamaño (5MB máximo para no saturar el JSON)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivo muy grande',
                    text: 'Por favor sube un archivo menor a 5MB.',
                    background: '#1e293b',
                    color: '#fff'
                });
                e.target.value = null; // Limpiar input
                return;
            }

            // Validación de tipo
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Formato inválido',
                    text: 'Solo se aceptan archivos PDF o Word.',
                    background: '#1e293b',
                    color: '#fff'
                });
                return;
            }

            // Conversión a Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileData({
                    base64: reader.result, // Este string contiene el archivo codificado
                    name: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validar que haya archivo
        if (!fileData.base64) {
            Swal.fire({
                icon: 'warning',
                title: 'Falta el Documento',
                text: 'Por favor adjunta tu CV o título para continuar.',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        setLoading(true);

        // 2. Preparar el Payload (Objeto JSON plano)
        // Ya NO usamos FormData, enviamos un objeto normal.
        const payload = {
            // Esparcimos los datos del formulario
            ...formData,
            
            // Aseguramos tipos de datos correctos para el backend
            aniosExperiencia: parseInt(formData.aniosExperiencia) || 0,
            anioGraduacion: formData.anioGraduacion ? parseInt(formData.anioGraduacion) : null,
            
            // Agregamos el archivo como texto
            archivoBase64: fileData.base64,
            nombreArchivo: fileData.name
        };

        try {
            // 3. Enviar al Backend
            // Axios usa 'application/json' por defecto, que es exactamente lo que queremos.
            // NO tocamos headers.
            const response = await axiosClient.post('/Asesor/apply', payload);

            if (response.data.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud Enviada!',
                    text: 'Tu perfil y documentación han sido recibidos correctamente.',
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/student'); // Regresar al dashboard
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

                {/* Sección Archivo (Base64) */}
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
                                    {fileData.name ? fileData.name : "Sube tu CV o Título"}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">PDF, DOCX (Máx 5MB)</p>
                            </div>
                        </label>
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