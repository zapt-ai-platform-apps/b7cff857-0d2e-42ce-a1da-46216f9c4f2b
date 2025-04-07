import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseImageWithOCR } from './ocrParser';
import { createWorker } from 'tesseract.js';

// Mock Tesseract.js
vi.mock('tesseract.js', () => ({
  createWorker: vi.fn()
}));

// Mock Sentry
vi.mock('@sentry/browser', () => ({
  captureException: vi.fn()
}));

describe('OCR Parser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should extract hours from images using explicit total hours pattern', async () => {
    // Mock worker
    const mockWorker = {
      recognize: vi.fn().mockResolvedValue({
        data: { text: 'Total Hours: 9.5' }
      }),
      terminate: vi.fn().mockResolvedValue(undefined)
    };
    
    // Setup mock
    createWorker.mockResolvedValue(mockWorker);
    
    // Create a mock file
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    // Call the function
    const result = await parseImageWithOCR(mockFile);
    
    // Assert
    expect(result).toHaveProperty('totalHours');
    expect(result.totalHours).toBe(9.5);
    expect(mockWorker.recognize).toHaveBeenCalledWith(mockFile);
    expect(mockWorker.terminate).toHaveBeenCalled();
  });
  
  it('should extract hours from images using "X hours" pattern', async () => {
    const mockWorker = {
      recognize: vi.fn().mockResolvedValue({
        data: { text: 'Worker completed 10.5 hours this week' }
      }),
      terminate: vi.fn().mockResolvedValue(undefined)
    };
    
    createWorker.mockResolvedValue(mockWorker);
    
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    const result = await parseImageWithOCR(mockFile);
    
    expect(result).toHaveProperty('totalHours');
    expect(result.totalHours).toBe(10.5);
  });
  
  it('should extract hours from images using largest likely hour value', async () => {
    const mockWorker = {
      recognize: vi.fn().mockResolvedValue({
        data: { text: 'Weekly report: 2023-05-11 Employee: John Schedule: 5.5 8.0 7.5 10.25 9.0' }
      }),
      terminate: vi.fn().mockResolvedValue(undefined)
    };
    
    createWorker.mockResolvedValue(mockWorker);
    
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    const result = await parseImageWithOCR(mockFile);
    
    expect(result).toHaveProperty('totalHours');
    expect(result.totalHours).toBe(10.25); // The largest value
  });
  
  it('should handle errors during OCR processing', async () => {
    const mockError = new Error('OCR processing failed');
    
    const mockWorker = {
      recognize: vi.fn().mockRejectedValue(mockError),
      terminate: vi.fn().mockResolvedValue(undefined)
    };
    
    createWorker.mockResolvedValue(mockWorker);
    
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    await expect(parseImageWithOCR(mockFile)).rejects.toThrow('OCR processing failed');
  });
});