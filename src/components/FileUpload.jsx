import React, { useState } from 'react';
import { parseExcelFile } from '../utils/excelParser';
import { parseImageWithOCR } from '../utils/ocrParser';
import * as Sentry from '@sentry/browser';

const FileUpload = ({ worker, onFileUpload, onHoursExtracted }) => {
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState('');
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setIsProcessing(true);
    setProcessingError('');
    
    try {
      // First notify parent that a file was uploaded
      onFileUpload(worker.name, file);
      
      // Then try to extract hours from the file
      let hoursData;
      
      // Check file type to determine how to parse it
      if (file.type.includes('excel') || 
          file.type.includes('spreadsheet') || 
          file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls')) {
        console.log(`Processing Excel file for ${worker.name}`);
        hoursData = await parseExcelFile(file);
      } else if (file.type.includes('image')) {
        console.log(`Processing image file for ${worker.name}`);
        hoursData = await parseImageWithOCR(file);
      } else {
        throw new Error('Unsupported file type. Please upload an Excel file or image.');
      }
      
      // If hours were extracted, notify parent component
      if (hoursData && typeof hoursData.totalHours === 'number') {
        console.log(`Extracted ${hoursData.totalHours} hours for ${worker.name}`);
        onHoursExtracted(worker.name, hoursData.totalHours);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      Sentry.captureException(error, {
        extra: {
          workerName: worker.name,
          fileName: file.name,
          fileType: file.type
        }
      });
      setProcessingError(error.message || 'Error processing file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload {worker.name}'s Hours (Excel or Screenshot):
      </label>
      <div className="flex items-center">
        <label className={`cursor-pointer ${isProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded-l transition-colors duration-200`}>
          {isProcessing ? 'Processing...' : 'Choose File'}
          <input 
            type="file" 
            accept=".xlsx,.xls,image/*"
            onChange={handleFileChange} 
            className="hidden"
            disabled={isProcessing}
          />
        </label>
        <div className="border border-gray-300 rounded-r py-2 px-4 flex-grow text-sm text-gray-700 truncate">
          {fileName || "No file chosen"}
        </div>
      </div>
      
      {isProcessing && (
        <div className="mt-2 text-sm text-blue-600">
          <div className="flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Extracting hours from file...
          </div>
        </div>
      )}
      
      {processingError && (
        <div className="mt-2 text-sm text-red-600">
          {processingError}
        </div>
      )}
    </div>
  );
};

export default FileUpload;