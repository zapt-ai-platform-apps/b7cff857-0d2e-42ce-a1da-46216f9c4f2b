import * as XLSX from 'xlsx';
import * as Sentry from '@sentry/browser';

export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Parsed Excel data:', jsonData);
        
        // Extract hours from the Excel data
        const hoursData = extractHoursFromExcel(jsonData);
        
        resolve(hoursData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        Sentry.captureException(error, {
          extra: { fileName: file.name, fileType: file.type }
        });
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      Sentry.captureException(error);
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

const extractHoursFromExcel = (jsonData) => {
  // This function needs to be customized based on the actual Excel structure
  // Different strategies to find hours in the Excel file
  
  let totalHours = 0;
  
  // Strategy 1: Look for columns with 'hour' in the name
  for (const row of jsonData) {
    for (const key in row) {
      if (typeof row[key] === 'number' && 
          (key.toLowerCase().includes('hour') || key.toLowerCase().includes('hrs'))) {
        totalHours += row[key];
      }
    }
  }
  
  // Strategy 2: Look for total/sum rows
  for (const row of jsonData) {
    for (const key in row) {
      if (typeof row[key] === 'string' && 
          (row[key].toLowerCase().includes('total') || row[key].toLowerCase().includes('sum'))) {
        // Check adjacent cells for numeric values
        for (const valueKey in row) {
          if (typeof row[valueKey] === 'number' && row[valueKey] > 0 && row[valueKey] < 50) {
            // Likely to be hours if within a reasonable range
            totalHours = Math.max(totalHours, row[valueKey]);
          }
        }
      }
    }
  }
  
  // Strategy 3: If we have multiple numeric values between 1-24, assume the largest is total hours
  if (totalHours === 0) {
    let potentialHours = [];
    for (const row of jsonData) {
      for (const key in row) {
        if (typeof row[key] === 'number' && row[key] >= 1 && row[key] <= 24) {
          potentialHours.push(row[key]);
        }
      }
    }
    
    if (potentialHours.length > 0) {
      totalHours = Math.max(...potentialHours);
    }
  }
  
  return { totalHours };
};