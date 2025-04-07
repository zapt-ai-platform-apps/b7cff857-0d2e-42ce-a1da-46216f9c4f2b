import React, { useState } from 'react';

const EmailTemplate = ({ workers, calculations }) => {
  const [copied, setCopied] = useState(false);
  
  if (!calculations || Object.keys(calculations).length === 0) {
    return null;
  }

  const emailContent = `Hi Andy, 

Re last month the overtime is as follows;

${workers.map(worker => {
  const calc = calculations[worker.name];
  if (!calc) return '';
  
  if (worker.name === 'Brad') {
    return `Brad has ${calc.overtimeHours}h overtime at £${worker.overtimeRate} ph totalling to £${calc.overtimePay.toFixed(2)}`;
  } else if (worker.name === 'Kallen') {
    return `Kallen has a total of ${calc.regularHours}h at £${worker.regularRate}ph (£${calc.regularPay.toFixed(2)}) with ${calc.overtimeHours}h of overtime at £${worker.overtimeRate} (£${calc.overtimePay.toFixed(2)}) totalling to £${calc.totalPay.toFixed(2)} this month.`;
  } else if (worker.name === 'Jack') {
    return `Jack has ${calc.overtimeHours}h overtime at £${worker.overtimeRate}ph totalling to £${calc.overtimePay.toFixed(2)} this month.
(Jack's base is full time, 8 hrs/day at minimum wage.)`;
  }
  return '';
}).filter(Boolean).join('\n\n')}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        Sentry.captureException(err);
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Email Template</h2>
      <div className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md mb-4 text-gray-800 border border-gray-200">
        {emailContent}
      </div>
      <button
        onClick={copyToClipboard}
        disabled={copied}
        className={`${copied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded cursor-pointer transition-colors duration-200 flex items-center justify-center`}
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Copied!
          </>
        ) : (
          'Copy to Clipboard'
        )}
      </button>
    </div>
  );
};

export default EmailTemplate;