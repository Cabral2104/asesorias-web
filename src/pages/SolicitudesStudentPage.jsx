import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Calendar, FileText, ChevronDown, CheckCircle, Link as LinkIcon, DollarSign, XCircle, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import CreateSolicitudModal from './dashboards/components/CreateSolicitudModal';
import EditSolicitudModal from './dashboards/components/EditSolicitudModal';
import FinalizeSolicitudModal from './dashboards/components/FinalizeSolicitudModal';

export default function SolicitudesStudentPage() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para Modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSolicitud, setEditingSolicitud] = useState(null);
    const [finalizingSolicitud, setFinalizingSolicitud] = useState(null);
    
    // Estado para acordeón
    const [expandedId, setExpandedId] = useState(null); 

    const fetchSolicitudes = async () => {
        try {
            const res = await axiosClient.get('/solicitud/custom/mis-solicitudes');
            setSolicitudes(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const toggleExpand = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
        }
    };

    const handleAcceptOffer = async (ofertaId, nombreAsesor, precio) => {
        const result = await Swal.fire({
            title: `¿Aceptar oferta de ${nombreAsesor}?`,
            html: `<p>El costo será de <strong>$${precio} MXN</strong>.</p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, Aceptar y Pagar',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#334155',
            background: '#1e293b', color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosClient.post(`/solicitud/custom/aceptar-oferta/${ofertaId}`);
                if (res.data.isSuccess) {
                    Swal.fire({ icon: 'success', title: '¡Oferta Aceptada!', text: 'El asesor ha sido notificado.', background: '#1e293b', color: '#fff' });
                    fetchSolicitudes(); 
                    setExpandedId(null);
                }
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message, background: '#1e293b', color: '#fff' });
            }
        }
    };

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar solicitud?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            background: '#1e293b', color: '#fff'
        });

        if(result.isConfirmed) {
            try {
                await axiosClient.delete(`/solicitud/custom/eliminar/${id}`);
                fetchSolicitudes();
                Swal.fire({ icon: 'success', title: 'Eliminada', background: '#1e293b', color: '#fff', timer: 1500, showConfirmButton: false });
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar', background: '#1e293b', color: '#fff' });
            }
        }
    };

    return (
        <div className="container mx-auto pt-32 pb-20 px-6 animate-fade-in min-h-screen">
            
            {/* --- MODALES --- */}
            {isCreateModalOpen && (
                <CreateSolicitudModal 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onCreated={fetchSolicitudes} 
                />
            )}

            {editingSolicitud && (
                <EditSolicitudModal 
                    solicitud={editingSolicitud} 
                    onClose={() => setEditingSolicitud(null)} 
                    onUpdated={fetchSolicitudes} 
                />
            )}

            {finalizingSolicitud && (
                <FinalizeSolicitudModal 
                    solicitud={finalizingSolicitud}
                    onClose={() => setFinalizingSolicitud(null)}
                    onFinalized={fetchSolicitudes}
                />
            )}

            {/* --- HEADER --- */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mis Solicitudes</h1>
                    <p className="text-slate-400 mt-1">Gestiona tus peticiones de ayuda personalizada.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Nueva Solicitud
                </button>
            </div>

            {/* --- CONTENIDO --- */}
            {loading ? (
                <div className="text-center py-20 text-slate-500">Cargando...</div>
            ) : solicitudes.length === 0 ? (
                <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
                    <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl text-white font-bold mb-2">No tienes solicitudes activas</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">¿Tienes problemas con una materia? Crea una solicitud y recibe ayuda de expertos.</p>
                    <button onClick={() => setIsCreateModalOpen(true)} className="text-indigo-400 hover:text-indigo-300 font-semibold">Crear mi primera solicitud →</button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {solicitudes.map(sol => {
                        const cantidadOfertas = sol.ofertas ? sol.ofertas.length : 0;
                        const tieneOfertas = cantidadOfertas > 0;

                        return (
                            <div key={sol.solicitudId} className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all ${expandedId === sol.solicitudId ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-white/10 hover:border-indigo-500/30'}`}>
                                
                                {/* HEADER DE LA TARJETA */}
                                <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                sol.estado === 'Abierta' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                                sol.estado === 'EnProceso' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>
                                                {sol.estado === 'Abierta' ? 'RECIBIENDO OFERTAS' : sol.estado === 'EnProceso' ? 'ASIGNADA' : sol.estado}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(sol.fechaCreacion).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{sol.tema} <span className="text-slate-500 font-normal text-base">({sol.materia})</span></h3>
                                        <p className="text-slate-400 text-sm line-clamp-2">{sol.descripcion}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-4 mt-4">
                                            {sol.archivoUrl && (
                                                <a href={sol.archivoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:underline">
                                                    <LinkIcon size={12} /> Ver Material Adjunto
                                                </a>
                                            )}

                                            {/* BOTONES DE ACCIÓN */}
                                            <div className="flex gap-2 ml-auto md:ml-0">
                                                {/* Editar/Eliminar (Solo si Abierta) */}
                                                {sol.estado === 'Abierta' && (
                                                    <>
                                                        <button 
                                                            onClick={() => setEditingSolicitud(sol)} 
                                                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                                                        >
                                                            <Edit size={14} /> Editar
                                                        </button>
                                                        <button 
                                                            onClick={() => handleCancel(sol.solicitudId)} 
                                                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                                        >
                                                            <Trash2 size={14} /> Eliminar
                                                        </button>
                                                    </>
                                                )}

                                                {/* Finalizar (Solo si EnProceso) */}
                                                {sol.estado === 'EnProceso' && (
                                                    <button 
                                                        onClick={() => setFinalizingSolicitud(sol)}
                                                        className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-900/20 transition-all"
                                                    >
                                                        <CheckCircle size={14} /> Finalizar y Calificar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-end min-w-[180px]">
                                        <div className="text-right mb-3">
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Ofertas Recibidas</p>
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-3xl font-bold text-white">{cantidadOfertas}</span>
                                                {tieneOfertas && sol.estado === 'Abierta' && (
                                                    <span className="relative flex h-3 w-3">
                                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => toggleExpand(sol.solicitudId)}
                                            disabled={!tieneOfertas}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all w-full justify-center
                                                ${tieneOfertas 
                                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 cursor-pointer opacity-100' 
                                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}
                                            `}
                                        >
                                            {expandedId === sol.solicitudId ? 'Ocultar' : 'Ver Ofertas'} 
                                            <ChevronDown size={16} className={`transition-transform ${expandedId === sol.solicitudId ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* ACORDEÓN DE OFERTAS */}
                                {expandedId === sol.solicitudId && sol.ofertas && (
                                    <div className="bg-slate-950/50 border-t border-white/10 p-6 space-y-4 animate-fade-in">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <DollarSign size={14}/> Propuestas de Asesores
                                        </h4>
                                        
                                        {sol.ofertas.map(oferta => (
                                            <div key={oferta.ofertaId} className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${oferta.fueAceptada ? 'bg-emerald-900/10 border-emerald-500/40 ring-1 ring-emerald-500/20' : 'bg-slate-900 border-white/10 hover:border-indigo-500/30'}`}>
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-white/10 shrink-0">
                                                        {oferta.nombreAsesor.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-white font-bold">{oferta.nombreAsesor}</p>
                                                            <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400">{oferta.especialidadAsesor || 'Asesor'}</span>
                                                        </div>
                                                        <p className="text-slate-300 text-sm mt-2 bg-black/20 p-3 rounded-lg border border-white/5 italic">"{oferta.mensaje}"</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500">Cotización</p>
                                                        <p className="text-xl font-bold text-emerald-400">${oferta.precio}</p>
                                                    </div>
                                                    
                                                    {sol.estado === 'Abierta' ? (
                                                        <button 
                                                            onClick={() => handleAcceptOffer(oferta.ofertaId, oferta.nombreAsesor, oferta.precio)}
                                                            className="px-5 py-2 bg-white text-slate-900 hover:bg-emerald-400 hover:text-white font-bold rounded-lg text-sm transition-all shadow-lg flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={16} /> Aceptar
                                                        </button>
                                                    ) : oferta.fueAceptada ? (
                                                        <span className="flex items-center gap-2 text-emerald-400 font-bold text-sm px-4 py-2 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
                                                            <CheckCircle size={16} /> Aceptada
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600 text-sm font-medium flex items-center gap-1">
                                                            <XCircle size={16} /> Rechazada
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}