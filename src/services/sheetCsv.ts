import Papa from 'papaparse';

export function parseCsvRows(csv: string): Record<string, string>[] {
  const { data, errors } = Papa.parse<string[]>(csv, {
    delimiter: ',',
    skipEmptyLines: 'greedy',
  });
  if (errors.length > 0) {
    throw new Error('A planilha contém um CSV inválido.');
  }

  const [header, ...rows] = data;
  if (!header) return [];

  const columns = header.map((name, index) => name.trim() || `column_${index + 1}`);
  return rows.map((row) =>
    Object.fromEntries(columns.map((name, index) => [name, row[index]?.trim() ?? ''])),
  );
}
