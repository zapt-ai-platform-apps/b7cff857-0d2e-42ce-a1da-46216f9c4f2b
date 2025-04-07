import { describe, it, expect } from 'vitest';
import { calculateOvertimeHours, calculateRegularHours, calculatePay } from './calculations';

describe('overtime calculations', () => {
  describe('calculateOvertimeHours', () => {
    it('should return 0 when hours worked is less than standard hours with lunch', () => {
      expect(calculateOvertimeHours(8)).toBe(0);
      expect(calculateOvertimeHours(8.5)).toBe(0);
      expect(calculateOvertimeHours(7)).toBe(0);
    });

    it('should correctly calculate overtime hours when working more than standard hours with lunch', () => {
      expect(calculateOvertimeHours(9)).toBe(0.5);
      expect(calculateOvertimeHours(10)).toBe(1.5);
      expect(calculateOvertimeHours(13.5)).toBe(5);  // As per the example
    });

    it('should handle fractional hours correctly', () => {
      expect(calculateOvertimeHours(8.75)).toBe(0.25);
      expect(calculateOvertimeHours(9.25)).toBe(0.75);
    });
  });

  describe('calculateRegularHours', () => {
    it('should return the total hours when less than standard hours with lunch', () => {
      expect(calculateRegularHours(8)).toBe(8);
      expect(calculateRegularHours(7.5)).toBe(7.5);
    });

    it('should return standard hours with lunch when total hours exceed it', () => {
      expect(calculateRegularHours(9)).toBe(8.5);
      expect(calculateRegularHours(12)).toBe(8.5);
    });
  });

  describe('calculatePay', () => {
    const bradWorker = { name: 'Brad', overtimeRate: 19.8 };
    const kallenWorker = { name: 'Kallen', regularRate: 10, overtimeRate: 12 };
    const jackWorker = { name: 'Jack', overtimeRate: 14.65 };

    it('should calculate Brad\'s pay correctly', () => {
      const result = calculatePay(bradWorker, 13.5);
      expect(result.overtimeHours).toBe(5);
      expect(result.overtimePay).toBeCloseTo(99, 0); // 5 * 19.8 = 99
      expect(result.regularPay).toBe(0); // Brad doesn't get regular pay
    });

    it('should calculate Kallen\'s pay correctly', () => {
      const result = calculatePay(kallenWorker, 10);
      expect(result.regularHours).toBe(8.5);
      expect(result.overtimeHours).toBe(1.5);
      expect(result.regularPay).toBe(85); // 8.5 * 10 = 85
      expect(result.overtimePay).toBe(18); // 1.5 * 12 = 18
      expect(result.totalPay).toBe(103); // 85 + 18 = 103
    });

    it('should calculate Jack\'s pay correctly', () => {
      const result = calculatePay(jackWorker, 12);
      expect(result.overtimeHours).toBe(3.5);
      expect(result.overtimePay).toBeCloseTo(51.28, 2); // 3.5 * 14.65 = 51.275
      expect(result.regularPay).toBe(0); // Jack doesn't get regular pay
    });
  });
});