import React, { useState } from 'react';
import WorkerInput from './components/WorkerInput';
import EmailTemplate from './components/EmailTemplate';
import { workers, calculatePay } from './utils/calculations';
import * as Sentry from '@sentry/browser';

export default function App() {
  const [files, setFiles] = useState({});
  const [hoursData, setHoursData] = useState({
    Brad: { totalHours: 0 },
    Kallen: { totalHours: 0 },
    Jack: { totalHours: 0 },
  });
  
  const [calculations, setCalculations] = useState({});
  const [calculating, setCalculating] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState({
    Brad: false,
    Kallen: false,
    Jack: false
  });

  const handleFileUpload = (workerName, file) => {
    console.log(`Uploaded file for ${workerName}:`, file.name);
    setFiles(prev => ({
      ...prev,
      [workerName]: file
    }));
    setFilesUploaded(prev => ({
      ...prev,
      [workerName]: true
    }));
  };

  const handleHoursChange = (workerName, field, value) => {
    setHoursData(prev => ({
      ...prev,
      [workerName]: {
        ...prev[workerName],
        [field]: value
      }
    }));
  };

  const calculateResults = () => {
    try {
      setCalculating(true);
      console.log("Calculating results with data:", hoursData);
      
      // Validate all files are uploaded
      const allFilesUploaded = Object.values(filesUploaded).every(status => status);
      if (!allFilesUploaded) {
        alert("Please upload screenshots for all workers before calculating.");
        setCalculating(false);
        return;
      }
      
      const results = {};
      
      workers.forEach(worker => {
        const data = hoursData[worker.name];
        if (data) {
          const totalHours = data.totalHours || 0;
          results[worker.name] = {
            ...calculatePay(worker, totalHours),
            totalHours
          };
        }
      });
      
      console.log("Calculation results:", results);
      setCalculations(results);
    } catch (error) {
      console.error("Error calculating results:", error);
      Sentry.captureException(error);
      alert("An error occurred while calculating. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Overtime Calculator</h1>
          <p className="text-gray-600">Upload screenshots and calculate overtime for each worker</p>
        </header>
        
        <div className="mb-8">
          {workers.map(worker => (
            <WorkerInput
              key={worker.name}
              worker={worker}
              data={hoursData[worker.name]}
              onChange={handleHoursChange}
              onFileUpload={handleFileUpload}
            />
          ))}
          
          <div className="text-center mt-8">
            <button
              onClick={calculateResults}
              disabled={calculating}
              className={`${calculating ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center mx-auto`}
            >
              {calculating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                'Generate Email Template'
              )}
            </button>
          </div>
        </div>
        
        {Object.keys(calculations).length > 0 && (
          <EmailTemplate workers={workers} calculations={calculations} />
        )}
        
        <footer className="mt-10 text-center text-sm text-gray-500">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="underline">
            Made on ZAPT
          </a>
        </footer>
      </div>
    </div>
  );
}