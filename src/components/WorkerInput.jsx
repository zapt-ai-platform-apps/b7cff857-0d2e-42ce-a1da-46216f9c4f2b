import React from 'react';
import FileUpload from './FileUpload';

const WorkerInput = ({ worker, data, onChange, onFileUpload }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{worker.name}</h2>
      
      <FileUpload worker={worker} onFileUpload={onFileUpload} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {worker.name === 'Kallen' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regular Hours:
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={data.regularHours || ''}
              onChange={(e) => onChange(worker.name, 'regularHours', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm box-border"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overtime Hours:
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={data.overtimeHours || ''}
            onChange={(e) => onChange(worker.name, 'overtimeHours', parseFloat(e.target.value) || 0)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm box-border"
          />
        </div>
      </div>

      {worker.description && (
        <div className="mt-3 text-sm text-gray-600 italic">
          {worker.description}
        </div>
      )}
    </div>
  );
};

export default WorkerInput;