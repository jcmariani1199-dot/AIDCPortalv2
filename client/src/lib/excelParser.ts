import * as XLSX from 'xlsx';
import type { DataRow } from '@/components/DataTable';

export async function parseExcelFile(file: File): Promise<DataRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const rows: DataRow[] = jsonData.map((row: any, index: number) => ({
          id: index + 1,
          ...row,
        }));
        
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(file);
  });
}

export async function parseExcelFromPath(path: string): Promise<DataRow[]> {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  const rows: DataRow[] = jsonData.map((row: any, index: number) => ({
    id: index + 1,
    ...row,
  }));
  
  return rows;
}

export function downloadExcel(data: DataRow[], filename: string = 'portal_data.xlsx') {
  const dataToExport = data.map(({ id, ...rest }) => rest);
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, filename);
}
