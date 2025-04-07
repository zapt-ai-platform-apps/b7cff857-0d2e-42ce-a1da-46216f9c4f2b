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

export const calculatePay = (worker, regularHours = 0, overtimeHours = 0) => {
  const regularPay = (worker.regularRate || 0) * regularHours;
  const overtimePay = worker.overtimeRate * overtimeHours;
  return {
    regularPay,
    overtimePay,
    totalPay: regularPay + overtimePay,
  };
};