import Papa from 'papaparse';

export interface CsvParseResult<T> {
  data: T[];
  errors: Papa.ParseError[];
  success: boolean;
}

/**
 * Parse CSV content into typed objects
 */
export const parseCsvContent = <T>(
  csvContent: string,
  headers: string[]
): CsvParseResult<T> => {
  try {
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value, field) => {
        // Transform boolean fields
        if (field === 'isTrainer') {
          return value.toLowerCase() === 'true';
        }
        return value.trim();
      }
    });

    return {
      data: result.data as T[],
      errors: result.errors,
      success: result.errors.length === 0
    };
  } catch (error) {
    return {
      data: [],
      errors: [{ type: 'Delimiter', code: 'UndetectableDelimiter', message: String(error), row: 0 }],
      success: false
    };
  }
};

/**
 * Convert array of objects to CSV string
 */
export const arrayToCsv = <T extends Record<string, any>>(
  data: T[],
  headers?: string[]
): string => {
  if (data.length === 0) {
    return '';
  }

  const csvHeaders = headers || Object.keys(data[0]);
  
  return Papa.unparse(data, {
    columns: csvHeaders,
    header: true
  });
};
