/**
 * Converte un array di oggetti in formato CSV e scarica il file
 * @param data Array di oggetti da esportare
 * @param filename Nome del file (senza estensione)
 */
export function exportToCSV<T extends Record<string, string | number | Date | null | undefined>>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) {
    alert('Nessun dato da esportare');
    return;
  }

  // Prepara i dati per l'export
  const headers = Object.keys(data[0]);
  
  // Converti in CSV
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Gestisci valori null/undefined
          if (value === null || value === undefined) {
            return '""';
          }
          // Converti date in formato leggibile
          if (value instanceof Date) {
            return `"${value.toLocaleString('it-IT')}"`;
          }
          // Escape virgolette e newline nei valori stringa
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(',')
    ),
  ];
  
  const csv = csvRows.join('\n');

  // Download
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM per Excel
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

