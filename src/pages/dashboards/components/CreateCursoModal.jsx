import { useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Swal from 'sweetalert2';
import { X, Save, DollarSign, Type, AlignLeft } from 'lucide-react';

export default function CreateCursoModal({ onClose, onCourseCreated }) {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        costo: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                costo: parseFloat(formData.costo) || 0
            };

            const response = await axiosClient.post('/curso/crear', payload);

            if (response.data.isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: 'Curso Creado',
                    text: 'Ahora puedes agregar lecciones.',
                    background: '#1e293b',
                    color: '#fff',
                    timer: 2000,
                    showConfirmButton: false
                });
                onCourseCreated(); 
                onClose(); 
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo crear el curso',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h2 className="text-xl font-bold text-white">Crear Nuevo Curso</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Título del Curso</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input 
                                type="text" 
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-colors"
                                placeholder="Ej. Introducción a React"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Descripción</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <textarea 
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-colors resize-none"
                                placeholder="¿De qué trata este curso?"
                            ></textarea>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs uppercase font-bold text-slate-500 mb-1 block">Costo (MXN)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-emerald-500" />
                            <input 
                                type="number" 
                                name="costo"
                                value={formData.costo}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-colors"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-400 hover:text-white font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Guardando...' : 'Crear Curso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}