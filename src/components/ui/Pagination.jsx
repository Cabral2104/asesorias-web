import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Si solo hay 1 página, no mostramos nada
    if (totalPages <= 1) return null;

    // Lógica para no mostrar todos los números si son muchos
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisibleButtons = 5; // Cuántos números ver a la vez

        if (totalPages <= maxVisibleButtons) {
            // Si son poquitas páginas (menos de 5), mostramos todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Si son muchas páginas, calculamos el rango
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            // Ajuste si estamos al principio
            if (currentPage <= 3) {
                endPage = 5;
            }
            // Ajuste si estamos al final
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
            }

            // Agregamos la primera página y puntos si es necesario
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) pages.push('...');
            }

            // Agregamos el rango central
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Agregamos la última página y puntos si es necesario
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <nav className="flex justify-center items-center gap-2 mt-4">
            {/* BOTÓN ANTERIOR */}
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-white/10 bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={18} />
            </button>

            {/* NÚMEROS DE PÁGINA */}
            <div className="flex gap-1">
                {renderPageNumbers().map((number, index) => (
                    <button
                        key={index}
                        onClick={() => typeof number === 'number' ? paginate(number) : null}
                        disabled={number === '...'}
                        className={`
                            px-3.5 py-1.5 text-sm font-bold rounded-lg transition-all
                            ${currentPage === number 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105' 
                                : number === '...' 
                                    ? 'bg-transparent text-slate-500 cursor-default' 
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'}
                        `}
                    >
                        {number}
                    </button>
                ))}
            </div>

            {/* BOTÓN SIGUIENTE */}
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-white/10 bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={18} />
            </button>
        </nav>
    );
}