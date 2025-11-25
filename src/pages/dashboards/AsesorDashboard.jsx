import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus, Edit, BarChart2 } from 'lucide-react';

export default function AsesorDashboard() {
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        axiosClient.get('/curso/mis-cursos')
            .then(res => setCursos(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="container mx-auto py-10 px-6">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Panel de Instructor</h1>
                    <p className="text-slate-400 mt-1">Gestiona tu contenido y monitorea tus estudiantes.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
                    <Plus size={20} /> Crear Nuevo Curso
                </button>
            </div>

            {/* Stats Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Cursos Activos</p>
                    <p className="text-4xl font-bold text-white">{cursos.length}</p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Estudiantes Totales</p>
                    <p className="text-4xl font-bold text-emerald-400">0</p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Calificación Promedio</p>
                    <p className="text-4xl font-bold text-yellow-400">5.0</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-6">Mis Cursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map(curso => (
                    <div key={curso.cursoId} className="bg-slate-900 border border-white/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${curso.estaPublicado ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                {curso.estaPublicado ? 'PUBLICADO' : 'BORRADOR'}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><BarChart2 size={18}/></button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Edit size={18}/></button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{curso.titulo}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{curso.descripcion}</p>
                        <div className="text-xl font-mono font-bold text-indigo-400">${curso.costo}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}