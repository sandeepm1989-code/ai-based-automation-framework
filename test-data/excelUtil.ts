import * as XLSX from 'xlsx';
import * as path from 'path';

export class ExcelUtil {
  /**
   * Reads a given sheet from an Excel file and returns row records as JSON objects.
   */
  public static readSheet<T = any>(filePath: string, sheetName: string): T[] {
    const absolutePath = path.resolve(filePath);
    const workbook = XLSX.readFile(absolutePath);
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found in file ${filePath}`);
    }

    return XLSX.utils.sheet_to_json(worksheet) as T[];
  }
}