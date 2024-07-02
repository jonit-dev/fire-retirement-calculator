import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface ProjectionData {
  date: string;
  netWorth: number | null;
  stocks: number;
  reit: number;
  crypto: number;
  bonds: number;
  realEstate: number;
  currentProgress?: number;
  reinvestExcessAfterFire?: number;
}

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
      calculateProjection();
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

  const adjustForInflation = (
    value: number,
    months: number,
    annualInflationRate: number
  ): number => {
    return value / Math.pow(1 + annualInflationRate / 100, months / 12);
  };

  const calculateAdjustedMonthlyInvestment = (
    monthlyInvestment: number,
    isRetired: boolean,
    inflationAdjustments: number[],
    i: number
  ): number => {
    return isRetired ? 0 : monthlyInvestment * inflationAdjustments[i];
  };

  const updateAssetValues = (
    value: number,
    allocation: number,
    CAGR: number,
    monthlyInvestment: number,
    applyTaxes: boolean,
    taxRate: number
  ): number => {
    const growth = value * (CAGR / 100 / 12);
    const afterTaxGrowth = applyTaxes ? growth * (1 - taxRate / 100) : growth;
    return value + (monthlyInvestment * allocation) / 100 + afterTaxGrowth;
  };
  const calculateWithdrawals = (
    adjustedAnnualExpenses: number,
    assetValues: number[],
    projectedNetWorth: number
  ): number[] => {
    const monthlyWithdrawal = adjustedAnnualExpenses / 12;
    return assetValues.map(
      (value) => value - monthlyWithdrawal * (value / projectedNetWorth)
    );
  };

  const calculateProjection = () => {
    const months = years * 12;
    const data: ProjectionData[] = [];
    const initialDateDayjs = dayjs(initialDate);
    const currentDateDayjs = dayjs(currentDate);
    const endDateDayjs = initialDateDayjs.add(months, 'month');

    let totalMonths = endDateDayjs.diff(initialDateDayjs, 'month');
    let currentProgressMonths = currentDateDayjs.diff(
      initialDateDayjs,
      'month'
    );

    if (currentProgressMonths > totalMonths) {
      totalMonths = currentProgressMonths;
    }

    let projectedNetWorth = initialNetWorth;
    let stockValue = (projectedNetWorth * stockAllocation) / 100;
    let reitValue = (projectedNetWorth * reitAllocation) / 100;
    let cryptoValue = (projectedNetWorth * cryptoAllocation) / 100;
    let bondValue = (projectedNetWorth * bondAllocation) / 100;
    let realEstateValue = (projectedNetWorth * realEstateAllocation) / 100;
    const fireTarget = annualExpenses / (withdrawalRate / 100);
    const fireTargetWithTaxes = fireTarget / (1 - taxRate / 100);
    let fireDateFound = false;
    let isRetired = false;
    let excessReinvestment = 0;

    const inflationAdjustments = Array.from(
      { length: totalMonths + 1 },
      (_, i) => adjustForInflation(1, i, annualInflationRate)
    );
    const adjustedAnnualExpenses =
      annualExpenses * inflationAdjustments[totalMonths];

    for (let i = 0; i <= totalMonths; i++) {
      const date = initialDateDayjs.add(i, 'month');

      if (i > 0) {
        const adjustedMonthlyInvestment = calculateAdjustedMonthlyInvestment(
          monthlyContribution,
          isRetired,
          inflationAdjustments,
          i
        );
        const applyTaxes = isRetired && includeWithdrawals;

        stockValue = updateAssetValues(
          stockValue,
          stockAllocation,
          stockCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (stockAllocation / 100),
          applyTaxes,
          taxRate
        );
        reitValue = updateAssetValues(
          reitValue,
          reitAllocation,
          reitCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (reitAllocation / 100),
          applyTaxes,
          taxRate
        );
        cryptoValue = updateAssetValues(
          cryptoValue,
          cryptoAllocation,
          cryptoCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (cryptoAllocation / 100),
          applyTaxes,
          taxRate
        );
        bondValue = updateAssetValues(
          bondValue,
          bondAllocation,
          bondCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (bondAllocation / 100),
          applyTaxes,
          taxRate
        );
        realEstateValue = updateAssetValues(
          realEstateValue,
          realEstateAllocation,
          realEstateCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (realEstateAllocation / 100),
          applyTaxes,
          taxRate
        );

        projectedNetWorth =
          stockValue + reitValue + cryptoValue + bondValue + realEstateValue;

        if (isRetired && includeWithdrawals) {
          const monthlyExpenses = adjustedAnnualExpenses / 12;
          const monthlyTaxes = (monthlyExpenses * taxRate) / (100 - taxRate);
          const totalMonthlyWithdrawal = monthlyExpenses + monthlyTaxes;

          if (reinvestExcessAfterFire) {
            const annualGrowth = projectedNetWorth * (withdrawalRate / 100);
            const annualExcess = annualGrowth - adjustedAnnualExpenses;
            excessReinvestment = Math.max(0, annualExcess / 12);
          } else {
            excessReinvestment = 0;
          }

          const updatedValues = calculateWithdrawals(
            totalMonthlyWithdrawal,
            [stockValue, reitValue, cryptoValue, bondValue, realEstateValue],
            projectedNetWorth
          );
          [stockValue, reitValue, cryptoValue, bondValue, realEstateValue] =
            updatedValues;
          projectedNetWorth = updatedValues.reduce((acc, val) => acc + val, 0);
        }
      }

      if (isMonthly || i % 12 === 0 || i === totalMonths) {
        const dataPoint: ProjectionData = {
          date: date.format('YYYY-MM-DD'),
          netWorth: projectedNetWorth * inflationAdjustments[i],
          stocks: stockValue * inflationAdjustments[i],
          reit: reitValue * inflationAdjustments[i],
          crypto: cryptoValue * inflationAdjustments[i],
          bonds: bondValue * inflationAdjustments[i],
          realEstate: realEstateValue * inflationAdjustments[i],
          reinvestExcessAfterFire: excessReinvestment * inflationAdjustments[i],
        };

        if (i === currentProgressMonths) {
          dataPoint.currentProgress = currentNetWorth;
        }

        data.push(dataPoint);

        if (
          !fireDateFound &&
          projectedNetWorth * inflationAdjustments[i] >= fireTargetWithTaxes
        ) {
          setFireDate(date.toDate());
          fireDateFound = true;
          isRetired = includeWithdrawals;
        }
      }
    }

    if (!data.some((d) => d.currentProgress)) {
      const currentProgressDate = currentDateDayjs.format('YYYY-MM-DD');
      const index = data.findIndex((d) =>
        dayjs(d.date).isAfter(currentDateDayjs)
      );
      const currentProgressPoint: ProjectionData = {
        date: currentProgressDate,
        currentProgress: currentNetWorth,
        netWorth: null,
        stocks: stockValue,
        reit: reitValue,
        crypto: cryptoValue,
        bonds: bondValue,
        realEstate: realEstateValue,
      };

      if (index !== -1) {
        data.splice(index, 0, currentProgressPoint);
      } else {
        data.push(currentProgressPoint);
      }
    }

    setProjectionData(data);
    setAssetGrowth([
      { name: 'Stocks', value: stockValue * inflationAdjustments[totalMonths] },
      { name: 'REIT', value: reitValue * inflationAdjustments[totalMonths] },
      {
        name: 'Crypto',
        value: cryptoValue * inflationAdjustments[totalMonths],
      },
      { name: 'Bonds', value: bondValue * inflationAdjustments[totalMonths] },
      {
        name: 'Real Estate',
        value: realEstateValue * inflationAdjustments[totalMonths],
      },
    ]);
  };

  return { projectionData, assetGrowth, allocationError, fireDate };
};
