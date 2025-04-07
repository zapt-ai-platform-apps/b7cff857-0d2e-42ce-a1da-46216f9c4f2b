import React from 'react';
import FileUpload from './FileUpload';
import { calculateOvertimeHours, calculateRegularHours, STANDARD_HOURS_WITH_LUNCH } from '../utils/calculations';

const WorkerInput = ({ worker, data, onChange, onFileUpload }) => {
  const handleTotalHoursChange = (e) => {
    const totalHours = parseFloat(e.target.value) || 0;
    onChange(worker.name, 'totalHours', totalHours);
  };

  // Calculate overtime hours to display (but don't store it as it will be calculated during final computation)
  const displayOvertimeHours = data.totalHours ? calculateOvertimeHours(data.totalHours) : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{worker.name}</h2>
      
      <FileUpload worker={worker} onFileUpload={onFileUpload} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Hours Worked:
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={data.totalHours || ''}
            onChange={handleTotalHoursChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm box-border"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calculated Overtime Hours:
          </label>
          <input
            type="text"
            value={displayOvertimeHours}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>Standard hours (including lunch): {STANDARD_HOURS_WITH_LUNCH} hours</p>
        {data.totalHours > 0 && (
          <p>
            {worker.name === 'Kallen' ? (
              <>Regular hours: {calculateRegularHours(data.totalHours)} at £{worker.regularRate}/hr</>
            ) : (
              <>Regular hours: Already covered in base salary</>
            )}
          </p>
        )}
      </div>

      {worker.description && (
        <div className="mt-2 text-sm text-gray-600 italic">
          {worker.description}
        </div>
      )}
    </div>
  );
};

export default WorkerInput;