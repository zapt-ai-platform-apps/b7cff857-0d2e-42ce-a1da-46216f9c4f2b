import { createWorker } from 'tesseract.js';
import * as Sentry from '@sentry/browser';

export const parseImageWithOCR = async (file) => {
  console.log('Starting OCR processing for image:', file.name);
  let worker;
  
  try {
    worker = await createWorker('eng');
    console.log('OCR worker created');
    
    const { data } = await worker.recognize(file);
    const recognizedText = data.text;
    console.log('OCR recognized text:', recognizedText);
    
    // Extract hours from the recognized text
    const hoursData = extractHoursFromText(recognizedText);
    console.log('Extracted hours data:', hoursData);
    
    await worker.terminate();
    return hoursData;
  } catch (error) {
    console.error("OCR Error:", error);
    Sentry.captureException(error, {
      extra: { fileName: file.name, fileType: file.type }
    });
    if (worker) await worker.terminate();
    throw error;
  }
};

const extractHoursFromText = (text) => {
  // Normalize text: remove extra spaces, convert to lowercase
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  console.log('Normalized OCR text:', normalizedText);
  
  // Pattern matching strategies
  
  // Strategy 1: Look for "total hours: X" or "X hours"
  const totalHoursRegex = /total\s*hours?\s*:?\s*(\d+\.?\d*)/i;
  const hoursRegex = /(\d+\.?\d*)\s*hours?/i;
  
  let match = normalizedText.match(totalHoursRegex) || normalizedText.match(hoursRegex);
  
  if (match && match[1]) {
    const totalHours = parseFloat(match[1]);
    console.log('Found hours via regex match:', totalHours);
    return { totalHours };
  }
  
  // Strategy 2: Look for patterns like "total: X" near hour-related words
  if (normalizedText.includes('hour') || normalizedText.includes('hrs') || normalizedText.includes('time')) {
    const totalRegex = /total\s*:?\s*(\d+\.?\d*)/i;
    match = normalizedText.match(totalRegex);
    
    if (match && match[1]) {
      const totalHours = parseFloat(match[1]);
      console.log('Found hours via total pattern:', totalHours);
      return { totalHours };
    }
  }
  
  // Strategy 3: Extract all numbers and analyze to find likely hour values
  const numberMatches = normalizedText.match(/\d+\.?\d*/g) || [];
  const numbers = numberMatches.map(num => parseFloat(num));
  
  // Filter numbers to likely hour values (between 1 and 24)
  const likelyHours = numbers.filter(num => num >= 1 && num <= 24);
  
  if (likelyHours.length > 0) {
    // Prefer numbers that appear after hours-related words
    const hourParts = normalizedText.split(/hour|hrs|time/);
    if (hourParts.length > 1) {
      for (let i = 1; i < hourParts.length; i++) {
        const numMatch = hourParts[i].match(/\d+\.?\d*/);
        if (numMatch) {
          const val = parseFloat(numMatch[0]);
          if (val >= 1 && val <= 24) {
            console.log('Found hours after hour-related word:', val);
            return { totalHours: val };
          }
        }
      }
    }
    
    // If no clear contextual match, return the largest likely hour value
    const totalHours = Math.max(...likelyHours);
    console.log('Using largest likely hour value:', totalHours);
    return { totalHours };
  }
  
  console.log('No hours found in text, returning 0');
  return { totalHours: 0 };
};