import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Search, Filter, Calendar, FileText, Link as LinkIcon, ArrowRight, User } from 'lucide-react';
import { MATERIAS } from '../utils/constants'; // IMPORTAR CONSTANTES
import MakeOfferModal from './dashboards/components/MakeOfferModal';

export default function MarketplaceAsesorPage() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroMateria, setFiltroMateria] = useState('');
    const [selectedSolicitud, setSelectedSolicitud] = useState(null); // Para el modal

    const fetchMarketplace = async () => {
        setLoading(true);
        try {
            // Construir URL con query params
            const url = filtroMateria 
                ? `/solicitud/custom/mercado?materia=${filtroMateria}`
                : '/solicitud/custom/mercado';
            
            const res = await axiosClient.get(url);
            setSolicitudes(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketplace();
    }, [filtroMateria]); // Recargar cuando cambie el filtro

    return (
        <div className="container mx-auto pt-32 pb-20 px-6 animate-fade-in min-h-screen">
            
            {/* MODAL */}
            {selectedSolicitud && (
                <MakeOfferModal 
                    solicitud={selectedSolicitud} 
                    onClose={() => setSelectedSolicitud(null)}
                    onOfferSent={fetchMarketplace} 
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mercado de Solicitudes</h1>
                    <p className="text-slate-400 mt-1">Encuentra estudiantes que necesitan tu ayuda y envía una cotización.</p>
                </div>
                
                {/* FILTRO DE MATERIAS */}
                <div className="relative min-w-[250px]">
                    <Filter className="absolute left-3 top-3 w-5 h-5 text-indigo-400 pointer-events-none" />
                    <select 
                        value={filtroMateria}
                        onChange={(e) => setFiltroMateria(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Todas las Materias</option>
                        {MATERIAS.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Buscando oportunidades...</div>
            ) : solicitudes.length === 0 ? (
                <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
                    <Search size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl text-white font-bold mb-2">No hay solicitudes disponibles</h3>
                    <p className="text-slate-400">Intenta con otra materia o vuelve más tarde.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {solicitudes.map(sol => (
                        <div key={sol.solicitudId} className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20">
                                    {sol.materia}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar size={12} /> Límite: {new Date(sol.fechaLimite).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{sol.tema}</h3>
                            <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">{sol.descripcion}</p>

                            <div className="flex items-center gap-3 mb-6 p-3 bg-slate-950/50 rounded-lg border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                                    {sol.nombreEstudiante.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Solicitado por</p>
                                    <p className="text-sm text-white font-medium">{sol.nombreEstudiante}</p>
                                </div>
                                {sol.archivoUrl && (
                                    <a href={sol.archivoUrl} target="_blank" rel="noreferrer" className="ml-auto p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors" title="Ver Archivo">
                                        <LinkIcon size={16} />
                                    </a>
                                )}
                            </div>

                            <button 
                                onClick={() => setSelectedSolicitud(sol)}
                                className="w-full py-3 bg-white text-slate-900 hover:bg-emerald-400 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                Cotizar Ayuda <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}