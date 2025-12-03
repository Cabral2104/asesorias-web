import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Receipt, Calendar, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '../components/ui/Pagination';

export default function StudentPaymentsPage() {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        axiosClient.get('/estudiante/pagos')
            .then(res => setPagos(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPagos = pagos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mx-auto pt-32 pb-20 px-6 animate-fade-in min-h-screen">
            <Link to="/profile" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 w-fit transition-colors">
                <ArrowLeft size={20} /> Volver al perfil
            </Link>

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <Receipt className="text-emerald-400 w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Historial de Compras</h1>
                    <p className="text-slate-400">Consulta tus transacciones y recibos.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500 animate-pulse">Cargando historial...</div>
            ) : pagos.length === 0 ? (
                <div className="text-center py-24 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
                    <CreditCard size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl text-white font-bold mb-2">No tienes pagos registrados</h3>
                    <p className="text-slate-400">Cuando te inscribas a un curso, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Curso / Concepto</th>
                                    <th className="px-6 py-4">Método de Pago</th>
                                    <th className="px-6 py-4 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {currentPagos.map(pago => (
                                    <tr key={pago.pagoId} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-white">
                                                <Calendar size={14} className="text-indigo-400" />
                                                {new Date(pago.fechaPago).toLocaleDateString()}
                                            </div>
                                            <span className="text-xs text-slate-500 ml-6">
                                                {new Date(pago.fechaPago).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            {pago.nombreCurso}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
                                                <CreditCard size={12} /> {pago.metodoPago}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-emerald-400 font-bold text-base">
                                            ${pago.monto}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pagos.length > itemsPerPage && (
                        <div className="p-4 border-t border-white/10 bg-slate-950/30">
                            <Pagination itemsPerPage={itemsPerPage} totalItems={pagos.length} paginate={setCurrentPage} currentPage={currentPage} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}