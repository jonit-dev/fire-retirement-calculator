import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { RetirementCalculatorService } from '../RetirementCalculatorService';

describe('RetirementCalculatorService', () => {
  let service: RetirementCalculatorService;

  beforeEach(() => {
    container.clearInstances();
    service = container.resolve(RetirementCalculatorService);
  });

  describe('adjustForInflation', () => {
    it('should correctly adjust for inflation', () => {
      const result = service.adjustForInflation(1000, 12, 2);
      expect(result).toBeCloseTo(980.39, 2);
    });

    it('should handle zero inflation', () => {
      const result = service.adjustForInflation(1000, 12, 0);
      expect(result).toBe(1000);
    });

    it('should handle negative inflation (deflation)', () => {
      const result = service.adjustForInflation(1000, 12, -2);
      expect(result).toBeCloseTo(1020.41, 2);
    });
  });

  describe('calculateAdjustedMonthlyInvestment', () => {
    it('should return 0 if retired', () => {
      const result = service.calculateAdjustedMonthlyInvestment(
        1000,
        true,
        [1, 0.99, 0.98],
        1
      );
      expect(result).toBe(0);
    });

    it('should adjust investment based on inflation if not retired', () => {
      const result = service.calculateAdjustedMonthlyInvestment(
        1000,
        false,
        [1, 0.99, 0.98],
        1
      );
      expect(result).toBe(990);
    });
  });

  describe('updateAssetValues', () => {
    it('should correctly update asset values without taxes', () => {
      const result = service.updateAssetValues(10000, 50, 6, 1000, false, 20);
      expect(result).toBeCloseTo(10550, 2);
    });

    it('should correctly update asset values with taxes', () => {
      const result = service.updateAssetValues(10000, 50, 6, 1000, true, 20);
      expect(result).toBeCloseTo(10540, 2);
    });
  });

  describe('calculateWithdrawals', () => {
    it('should correctly calculate withdrawals', () => {
      const result = service.calculateWithdrawals(
        120000,
        [500000, 300000, 200000],
        1000000
      );
      expect(result).toEqual([495000, 297000, 198000]);
    });
  });

  describe('calculateProjection', () => {
    it('should calculate projection correctly', () => {
      const initialDate = dayjs('2024-01-01').toDate();
      const currentDate = dayjs('2024-07-01').toDate();
      const result = service.calculateProjection(
        100000,
        1000,
        30,
        60,
        10,
        5,
        20,
        5,
        7,
        6,
        10,
        3,
        4,
        2,
        initialDate,
        currentDate,
        105000,
        true,
        40000,
        4,
        true,
        20,
        false
      );

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.fireDate).toBeDefined();
      expect(result.assetGrowth.length).toBe(5);

      const firstDataPoint = result.data[0];
      expect(dayjs(firstDataPoint.date).format('YYYY-MM-DD')).toBe(
        '2024-01-01'
      );
      expect(firstDataPoint.netWorth).toBeCloseTo(100000, 2);

      const lastDataPoint = result.data[result.data.length - 1];
      expect(dayjs(lastDataPoint.date).year()).toBe(2054);
      expect(lastDataPoint.netWorth).toBeGreaterThan(100000);

      const currentProgressPoint = result.data.find(
        (d) => d.currentProgress !== undefined
      );
      expect(currentProgressPoint).toBeDefined();
      expect(currentProgressPoint?.currentProgress).toBe(105000);
    });
  });
});
