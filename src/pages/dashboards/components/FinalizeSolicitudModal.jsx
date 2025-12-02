import { useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import Swal from 'sweetalert2';
import { X, Star, CheckCircle } from 'lucide-react';

export default function FinalizeSolicitudModal({ solicitud, onClose, onFinalized }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            Swal.fire({ icon: 'warning', title: 'Falta calificación', text: 'Por favor califica el servicio recibido.', background: '#1e293b', color: '#fff' });
            return;
        }

        setLoading(true);
        try {
            const payload = { rating, comentario };
            const response = await axiosClient.post(`/solicitud/custom/finalizar/${solicitud.solicitudId}`, payload);

            if (response.data.isSuccess) {
                Swal.fire({ icon: 'success', title: '¡Finalizada!', text: 'Gracias por tu feedback.', background: '#1e293b', color: '#fff' });
                onFinalized();
                onClose();
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message, background: '#1e293b', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                    <h3 className="font-bold text-white">Finalizar Asesoría</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">¿El asesor resolvió tu duda?</h2>
                    <p className="text-slate-400 text-sm mb-6">Al finalizar, se cerrará la solicitud y se publicará tu calificación en el perfil del asesor.</p>

                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110 focus:outline-none"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(rating)}
                            >
                                <Star 
                                    size={32} 
                                    className={`${star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} transition-colors`}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none resize-none mb-6 text-sm"
                        rows="3"
                        placeholder="Escribe un comentario sobre el servicio..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    ></textarea>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Finalizar y Calificar'}
                    </button>
                </div>
            </div>
        </div>
    );
}