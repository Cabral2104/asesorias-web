import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-1">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                            currentPage === number 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        {number}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}