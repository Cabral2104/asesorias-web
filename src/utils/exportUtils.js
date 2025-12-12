import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosClient from '../api/axiosClient';

// --- 1. OBTENCIÓN DE DATOS (CON SEGURIDAD) ---
export const fetchAllData = async (endpoint) => {
    try {
        const res = await axiosClient.get(`${endpoint}?page=1&pageSize=500`);
        
        if (!res || !res.data) return [];

        let data = [];
        if (res.data.ultimasAsesorias) data = res.data.ultimasAsesorias;
        else if (res.data.items) data = res.data.items;
        else if (Array.isArray(res.data)) data = res.data;
        
        return data;
    } catch (error) {
        console.error("Error obteniendo datos:", error);
        return []; 
    }
};

// --- 2. EXCEL / CSV ---
export const exportToExcel = (data, fileName) => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
    } catch (e) {
        console.error("Error generando Excel:", e);
    }
};

export const exportToCSV = (data, fileName) => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `${fileName}.csv`);
    } catch (e) {
        console.error("Error generando CSV:", e);
    }
};

// --- 3. XML ---
export const exportToXML = (data, fileName) => {
    try {
        if (!data || data.length === 0) return;

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n';
        
        data.forEach(row => {
            xml += '  <row>\n';
            Object.entries(row).forEach(([key, value]) => {
                let cleanValue = value;
                if (value === null || value === undefined) cleanValue = '';
                else cleanValue = String(value)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&apos;');

                let cleanKey = key.replace(/\s+/g, '_'); 
                
                xml += `    <${cleanKey}>${cleanValue}</${cleanKey}>\n`;
            });
            xml += '  </row>\n';
        });
        xml += '</rows>';

        const blob = new Blob([xml], { type: 'application/xml' });
        saveAs(blob, `${fileName}.xml`);
    } catch (e) {
        console.error("Error generando XML:", e);
    }
};

// --- 4. PDF ---
export const exportToPDF = (headers, data, title, fileName) => {
    try {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableBody = data.map(row => Object.values(row));

        autoTable(doc, {
            startY: 35,
            head: [headers],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [79, 70, 229] },
        });

        doc.save(`${fileName}.pdf`);
    } catch (e) {
        console.error("Error generando PDF:", e);
    }
};

// --- 5. JSON (NUEVO) ---
export const exportToJSON = (data, fileName) => {
    try {
        // null, 2 sirve para que el JSON se guarde "bonito" con indentación
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        saveAs(blob, `${fileName}.json`);
    } catch (e) {
        console.error("Error generando JSON:", e);
    }
};