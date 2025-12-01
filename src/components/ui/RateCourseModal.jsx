import { useState } from 'react';
import { Star, X } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';

export default function RateCourseModal({ cursoId, onClose, onRated }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            Swal.fire({ icon: 'warning', title: 'Faltan estrellas', text: 'Por favor selecciona una calificación.', background: '#1e293b', color: '#fff' });
            return;
        }

        setLoading(true);
        try {
            const payload = { rating, comentario };
            const response = await axiosClient.post(`/curso/${cursoId}/calificar`, payload);

            if (response.data.isSuccess) {
                Swal.fire({ icon: 'success', title: '¡Gracias!', text: 'Tu opinión ayuda a otros estudiantes.', background: '#1e293b', color: '#fff' });
                onRated(); // Callback para actualizar UI si es necesario
                onClose();
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al enviar calificación.';
            Swal.fire({ icon: 'error', title: 'Error', text: msg, background: '#1e293b', color: '#fff' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={20} />
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Califica este curso</h2>
                    <p className="text-slate-400 mb-6">¿Qué te ha parecido el contenido?</p>

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
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none resize-none mb-6"
                        rows="3"
                        placeholder="Escribe un comentario (opcional)..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    ></textarea>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Enviar Calificación'}
                    </button>
                </div>
            </div>
        </div>
    );
}