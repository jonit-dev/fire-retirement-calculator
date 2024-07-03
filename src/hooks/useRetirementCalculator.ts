// useRetirementCalculator.ts
import { useEffect, useState } from 'react';
import { container } from 'tsyringe';
import {
  ProjectionData,
  RetirementCalculatorService,
} from '../services/RetirementCalculatorService';

interface AssetGrowth {
  name: string;
  value: number;
}

export const useRetirementCalculator = (
  initialNetWorth: number,
  monthlyContribution: number,
  years: number,
  stockAllocation: number,
  reitAllocation: number,
  cryptoAllocation: number,
  bondAllocation: number,
  realEstateAllocation: number,
  stockCAGR: number,
  reitCAGR: number,
  cryptoCAGR: number,
  bondCAGR: number,
  realEstateCAGR: number,
  annualInflationRate: number,
  initialDate: Date,
  currentDate: Date,
  currentNetWorth: number,
  isMonthly: boolean,
  annualExpenses: number,
  withdrawalRate: number,
  includeWithdrawals: boolean,
  taxRate: number,
  reinvestExcessAfterFire: boolean
) => {
  const [projectionData, setProjectionData] = useState<ProjectionData[]>([]);
  const [assetGrowth, setAssetGrowth] = useState<AssetGrowth[]>([]);
  const [allocationError, setAllocationError] = useState('');
  const [fireDate, setFireDate] = useState<Date | null>(null);

  const calculatorService = container.resolve<RetirementCalculatorService>(
    RetirementCalculatorService
  );

  useEffect(() => {
    const totalAllocation =
      stockAllocation +
      reitAllocation +
      cryptoAllocation +
      bondAllocation +
      realEstateAllocation;
    if (totalAllocation !== 100) {
      setAllocationError('Total asset allocation must equal 100%.');
    } else {
      setAllocationError('');
      const { data, fireDate, assetGrowth } =
        calculatorService.calculateProjection(
          initialNetWorth,
          monthlyContribution,
          years,
          stockAllocation,
          reitAllocation,
          cryptoAllocation,
          bondAllocation,
          realEstateAllocation,
          stockCAGR,
          reitCAGR,
          cryptoCAGR,
          bondCAGR,
          realEstateCAGR,
          annualInflationRate,
          initialDate,
          currentDate,
          currentNetWorth,
          isMonthly,
          annualExpenses,
          withdrawalRate,
          includeWithdrawals,
          taxRate,
          reinvestExcessAfterFire
        );
      setProjectionData(data);
      setFireDate(fireDate);
      setAssetGrowth(assetGrowth);
    }
  }, [
    initialNetWorth,
    monthlyContribution,
    years,
    stockAllocation,
    reitAllocation,
    cryptoAllocation,
    bondAllocation,
    realEstateAllocation,
    stockCAGR,
    reitCAGR,
    cryptoCAGR,
    bondCAGR,
    realEstateCAGR,
    annualInflationRate,
    initialDate,
    currentDate,
    currentNetWorth,
    isMonthly,
    annualExpenses,
    withdrawalRate,
    includeWithdrawals,
    taxRate,
    reinvestExcessAfterFire,
  ]);

  return { projectionData, assetGrowth, allocationError, fireDate };
};
