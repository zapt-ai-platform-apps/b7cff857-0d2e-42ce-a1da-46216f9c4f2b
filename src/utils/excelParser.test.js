import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseExcelFile } from './excelParser';
import * as XLSX from 'xlsx';

// Mock XLSX
vi.mock('xlsx', () => ({
  read: vi.fn(),
  utils: {
    sheet_to_json: vi.fn()
  }
}));

// Mock Sentry
vi.mock('@sentry/browser', () => ({
  captureException: vi.fn()
}));

describe('Excel Parser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should extract hours from Excel files with hour columns', async () => {
    // Mock implementation
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    const mockData = [
      { name: 'Day 1', hours: 8.5 },
      { name: 'Day 2', hours: 9.5 }
    ];
    
    // Setup mocks
    XLSX.read.mockReturnValue(mockWorkbook);
    XLSX.utils.sheet_to_json.mockReturnValue(mockData);
    
    // Create a mock file
    const mockFile = new File(['dummy content'], 'test.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Mock FileReader
    global.FileReader = class {
      readAsArrayBuffer() {
        this.onload({ target: { result: new ArrayBuffer(8) } });
      }
    };
    
    // Call the function
    const result = await parseExcelFile(mockFile);
    
    // Assert
    expect(result).toHaveProperty('totalHours');
    expect(result.totalHours).toBe(18); // 8.5 + 9.5
    expect(XLSX.read).toHaveBeenCalled();
    expect(XLSX.utils.sheet_to_json).toHaveBeenCalled();
  });
  
  it('should handle Excel files with total/sum rows', async () => {
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    const mockData = [
      { day: 'Monday', time: 8 },
      { day: 'Tuesday', time: 7.5 },
      { day: 'Total', time: 15.5 }
    ];
    
    XLSX.read.mockReturnValue(mockWorkbook);
    XLSX.utils.sheet_to_json.mockReturnValue(mockData);
    
    const mockFile = new File(['dummy content'], 'test.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    global.FileReader = class {
      readAsArrayBuffer() {
        this.onload({ target: { result: new ArrayBuffer(8) } });
      }
    };
    
    const result = await parseExcelFile(mockFile);
    
    expect(result).toHaveProperty('totalHours');
    expect(result.totalHours).toBe(15.5);
  });
  
  it('should handle errors during parsing', async () => {
    XLSX.read.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    const mockFile = new File(['dummy content'], 'test.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    global.FileReader = class {
      readAsArrayBuffer() {
        this.onload({ target: { result: new ArrayBuffer(8) } });
      }
    };
    
    await expect(parseExcelFile(mockFile)).rejects.toThrow('Test error');
  });
});