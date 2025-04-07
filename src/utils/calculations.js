export const workers = [
  {
    name: 'Brad',
    overtimeRate: 19.8,
  },
  {
    name: 'Kallen',
    regularRate: 10,
    overtimeRate: 12,
  },
  {
    name: 'Jack',
    overtimeRate: 14.65,
    description: "(Jack's base is full time, 8 hrs/day at minimum wage.)"
  },
];

// Define standard working hours with lunch break
export const STANDARD_HOURS_WITH_LUNCH = 8.5;

// Calculate overtime based on total hours
export const calculateOvertimeHours = (totalHours) => {
  if (totalHours <= STANDARD_HOURS_WITH_LUNCH) {
    return 0;
  }
  return totalHours - STANDARD_HOURS_WITH_LUNCH;
};

// Calculate regular hours (up to standard hours)
export const calculateRegularHours = (totalHours) => {
  return Math.min(totalHours, STANDARD_HOURS_WITH_LUNCH);
};

// Helper function to round to 2 decimal places for money values
const roundToTwoDecimals = (value) => {
  return Math.round(value * 100) / 100;
};

export const calculatePay = (worker, totalHours = 0) => {
  const overtimeHours = calculateOvertimeHours(totalHours);
  const regularHours = calculateRegularHours(totalHours);
  
  // Only Kallen gets paid for regular hours
  const regularPay = worker.name === 'Kallen' 
    ? roundToTwoDecimals(worker.regularRate * regularHours) 
    : 0;
  
  // Round overtime pay to 2 decimal places (fix for test precision issue)
  const overtimePay = roundToTwoDecimals(worker.overtimeRate * overtimeHours);
  
  return {
    regularHours: worker.name === 'Kallen' ? regularHours : 0,
    overtimeHours,
    regularPay,
    overtimePay,
    totalPay: roundToTwoDecimals(regularPay + overtimePay),
  };
};