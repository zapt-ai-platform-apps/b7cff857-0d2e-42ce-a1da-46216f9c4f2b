import React, { useState } from 'react';

const FileUpload = ({ worker, onFileUpload }) => {
  const [fileName, setFileName] = useState('');
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(worker.name, file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload {worker.name}'s Hours Screenshot:
      </label>
      <div className="flex items-center">
        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-l transition-colors duration-200">
          Choose File
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </label>
        <div className="border border-gray-300 rounded-r py-2 px-4 flex-grow text-sm text-gray-700 truncate">
          {fileName || "No file chosen"}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;