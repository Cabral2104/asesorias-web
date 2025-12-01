import { useState } from 'react';
import { X, CreditCard, Lock, Calendar, ShieldCheck } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';

export default function PaymentModal({ curso, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        titular: ''
    });

    // Formateadores simples
    const handleCardChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        val = val.substring(0, 16);
        val = val.replace(/(\d{4})/g, '$1 ').trim();
        setCardData({ ...cardData, cardNumber: val });
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2, 4);
        setCardData({ ...cardData, expiry: val });
    };

    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                cursoId: curso.cursoId,
                numeroTarjeta: cardData.cardNumber.replace(/\s/g, ''), // Enviamos sin espacios
                expiracion: cardData.expiry,
                cvc: cardData.cvc,
                titular: cardData.titular
            };

            const response = await axiosClient.post('/curso/inscribirse', payload);

            if (response.data.isSuccess) {
                onSuccess(); // Notificar al padre
                onClose(); // Cerrar modal
                Swal.fire({
                    icon: 'success',
                    title: '¡Pago Exitoso!',
                    text: 'Te hemos enviado el recibo a tu correo.',
                    background: '#1e293b', color: '#fff'
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error en el pago',
                text: error.response?.data?.message || 'Verifique sus datos e intente nuevamente.',
                background: '#1e293b', color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">
                
                {/* Header Seguro */}
                <div className="bg-slate-950 p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Lock size={16} /> Pago Seguro SSL
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>

                <div className="p-6">
                    <div className="mb-6 text-center">
                        <p className="text-slate-400 text-sm">Total a Pagar</p>
                        <h2 className="text-4xl font-bold text-white mt-1">${curso.costo} <span className="text-lg text-slate-500 font-normal">MXN</span></h2>
                        <p className="text-indigo-400 text-sm mt-2 font-medium">{curso.titulo}</p>
                    </div>

                    <form onSubmit={handlePay} className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase ml-1">Titular de la Tarjeta</label>
                            <input 
                                type="text" 
                                placeholder="Como aparece en la tarjeta"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors mt-1"
                                value={cardData.titular}
                                onChange={e => setCardData({...cardData, titular: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase ml-1">Número de Tarjeta</label>
                            <div className="relative mt-1">
                                <CreditCard className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors font-mono"
                                    value={cardData.cardNumber}
                                    onChange={handleCardChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase ml-1">Expiración</label>
                                <div className="relative mt-1">
                                    <Calendar className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors font-mono"
                                        value={cardData.expiry}
                                        onChange={handleExpiryChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase ml-1">CVC</label>
                                <div className="relative mt-1">
                                    <ShieldCheck className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                                    <input 
                                        type="password" 
                                        placeholder="123"
                                        maxLength="4"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors font-mono"
                                        value={cardData.cvc}
                                        onChange={e => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Procesando...' : 'Pagar Ahora'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}