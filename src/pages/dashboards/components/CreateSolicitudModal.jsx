import { useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Swal from 'sweetalert2';
import { X, Save, BookOpen, FileText, CalendarDays, Link as LinkIcon, AlignLeft } from 'lucide-react';
import { MATERIAS } from '../../../utils/constants'; // <--- IMPORTAR

export default function CreateSolicitudModal({ onClose, onCreated }) {
    const [formData, setFormData] = useState({
        materia: '', // Iniciará vacía
        tema: '',
        descripcion: '',
        fechaLimite: '',
        archivoUrl: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.materia) {
            Swal.fire({ icon: 'warning', title: 'Falta información', text: 'Selecciona una materia.', background: '#1e293b', color: '#fff' });
            return;
        }
        setLoading(true);

        try {
            const response = await axiosClient.post('/solicitud/custom/crear', formData);
            if (response.data.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: 'Solicitud Publicada',
                    text: 'Los asesores recibirán tu petición y enviarán ofertas pronto.',
                    background: '#1e293b', color: '#fff', timer: 2500, showConfirmButton: false
                });
                onCreated();
                onClose();
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al crear', background: '#1e293b', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h2 className="text-xl font-bold text-white">Nueva Solicitud de Ayuda</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Materia</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                                {/* CAMBIO: SELECT EN LUGAR DE INPUT */}
                                <select 
                                    name="materia" 
                                    value={formData.materia} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-white focus:border-indigo-500 outline-none text-sm appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">Selecciona...</option>
                                    {MATERIAS.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* ... (El resto del formulario Tema, Descripción, Fecha, Link se mantiene IGUAL) ... */}
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Tema Específico</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input type="text" name="tema" value={formData.tema} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-white focus:border-indigo-500 outline-none text-sm" placeholder="Ej. Cálculo Integral" required />
                            </div>
                        </div>
                    </div>

                    {/* ... Descripción ... */}
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Descripción del Problema</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-white focus:border-indigo-500 outline-none text-sm resize-none" placeholder="Describe qué necesitas..." required></textarea>
                        </div>
                    </div>

                    {/* ... Fecha y Link ... */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Fecha Límite</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input type="date" name="fechaLimite" value={formData.fechaLimite} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-white focus:border-indigo-500 outline-none text-sm [color-scheme:dark]" required />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Material (Link)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input type="url" name="archivoUrl" value={formData.archivoUrl} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-white focus:border-indigo-500 outline-none text-sm" placeholder="https://drive..." />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-400 hover:text-white font-medium transition-colors text-sm">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 text-sm">
                            <Save size={18} /> {loading ? 'Publicando...' : 'Publicar Solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}