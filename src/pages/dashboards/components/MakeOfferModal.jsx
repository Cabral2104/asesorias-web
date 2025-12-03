import { useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Swal from 'sweetalert2';
import { X, DollarSign, MessageSquare, Send } from 'lucide-react';

export default function MakeOfferModal({ solicitud, onClose, onOfferSent }) {
    const [formData, setFormData] = useState({ precio: '', mensaje: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const payload = {
            precioOferta: parseFloat(formData.precio), 
            mensaje: formData.mensaje
        };

        try {
            const response = await axiosClient.post(`/solicitud/custom/${solicitud.solicitudId}/ofertar`, payload);
            if (response.data.isSuccess) {
                Swal.fire({ icon: 'success', title: 'Oferta Enviada', text: 'El estudiante será notificado.', background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });
                onOfferSent();
                onClose();
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo enviar', background: '#1e293b', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
                    <h3 className="font-bold text-white">Cotizar: {solicitud.tema}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Tu Precio (MXN)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 w-4 h-4 text-emerald-500" />
                            <input 
                                type="number" 
                                value={formData.precio}
                                onChange={e => setFormData({...formData, precio: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-white focus:border-emerald-500 outline-none font-mono"
                                placeholder="0.00"
                                min="1"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Mensaje para el estudiante</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <textarea 
                                value={formData.mensaje}
                                onChange={e => setFormData({...formData, mensaje: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-white focus:border-indigo-500 outline-none resize-none text-sm"
                                rows="3"
                                placeholder="Hola, puedo ayudarte con este tema..."
                                required
                            ></textarea>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Enviando...' : <><Send size={18} /> Enviar Oferta</>}
                    </button>
                </form>
            </div>
        </div>
    );
}