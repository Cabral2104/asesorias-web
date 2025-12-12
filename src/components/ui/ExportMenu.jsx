import { useState } from 'react';
// Agregamos FileJson a los iconos
import { Download, FileText, FileSpreadsheet, Code, FileJson } from 'lucide-react';
// Importamos la nueva función exportToJSON
import { fetchAllData, exportToExcel, exportToCSV, exportToXML, exportToPDF, exportToJSON } from '../../utils/exportUtils';
import Swal from 'sweetalert2';

export default function ExportMenu({ endpoint, fileName, title, formatData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const handleExport = async (type) => {
        setExporting(true);
        setIsOpen(false);
        try {
            const rawData = await fetchAllData(endpoint);
            const dataToExport = rawData.map(formatData);

            if (dataToExport.length === 0) {
                Swal.fire("Sin datos", "No hay registros para exportar", "info");
                return;
            }

            switch (type) {
                case 'csv': exportToCSV(dataToExport, fileName); break;
                case 'xml': exportToXML(dataToExport, fileName); break;
                case 'pdf':
                    const headers = Object.keys(dataToExport[0]).map(k => k.toUpperCase());
                    exportToPDF(headers, dataToExport, title, fileName);
                    break;
                case 'json': // NUEVO CASO
                    exportToJSON(dataToExport, fileName);
                    break;
                default: break;
            }
            
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#10b981', color: '#fff' });
            Toast.fire({ icon: 'success', title: 'Exportación completada' });

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Falló la exportación", "error");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} disabled={exporting} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 transition-all">
                {exporting ? <span className="animate-pulse">...</span> : <><Download size={14} /> Exportar</>}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                        <FileSpreadsheet size={14} className="text-emerald-400"/> CSV / Excel
                    </button>
                    <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                        <FileText size={14} className="text-red-400"/> PDF Report
                    </button>
                    <button onClick={() => handleExport('xml')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                        <Code size={14} className="text-blue-400"/> XML Data
                    </button>
                    {/* NUEVO BOTÓN JSON */}
                    <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                        <FileJson size={14} className="text-yellow-400"/> JSON Data
                    </button>
                </div>
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
}