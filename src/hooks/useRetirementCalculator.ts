import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

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
  annualExpenses: number
) => {
  const [projectionData, setProjectionData] = useState<any[]>([]);
  const [assetGrowth, setAssetGrowth] = useState<any[]>([]);
  const [allocationError, setAllocationError] = useState('');
  const [fireDate, setFireDate] = useState<Date | null>(null);

  useEffect(() => {
    const totalAllocation = stockAllocation + reitAllocation + cryptoAllocation + bondAllocation + realEstateAllocation;
    if (totalAllocation !== 100) {
      setAllocationError('Total asset allocation must equal 100%.');
    } else {
      setAllocationError('');
      calculateProjection();
    }
  }, [
    initialNetWorth, monthlyContribution, years, stockAllocation, reitAllocation, cryptoAllocation, bondAllocation,
    realEstateAllocation, stockCAGR, reitCAGR, cryptoCAGR, bondCAGR, realEstateCAGR, annualInflationRate, initialDate,
    currentDate, currentNetWorth, isMonthly, annualExpenses
  ]);

  const adjustForInflation = (value: number, months: number, annualInflationRate: number) => {
    return value / Math.pow((1 + annualInflationRate / 100), (months / 12));
  };

  const calculateProjection = () => {
    const monthlyInvestment = monthlyContribution;
    const months = years * 12;
    const data = [];

    const initialDateDayjs = dayjs(initialDate);
    const currentDateDayjs = dayjs(currentDate);
    const endDateDayjs = initialDateDayjs.add(months, 'month');

    let totalMonths = endDateDayjs.diff(initialDateDayjs, 'month');
    let currentProgressMonths = currentDateDayjs.diff(initialDateDayjs, 'month');

    if (currentProgressMonths > totalMonths) {
      totalMonths = currentProgressMonths;
    }

    let projectedNetWorth = initialNetWorth;
    let stockValue = projectedNetWorth * stockAllocation / 100;
    let reitValue = projectedNetWorth * reitAllocation / 100;
    let cryptoValue = projectedNetWorth * cryptoAllocation / 100;
    let bondValue = projectedNetWorth * bondAllocation / 100;
    let realEstateValue = projectedNetWorth * realEstateAllocation / 100;

    const fireTarget = annualExpenses / 0.04;
    let fireDateFound = false;

    const inflationAdjustments = Array.from({ length: totalMonths + 1 }, (_, i) => adjustForInflation(1, i, annualInflationRate));
    
    for (let i = 0; i <= totalMonths; i++) {
      const date = initialDateDayjs.add(i, 'month');

      if (i > 0) {
        const adjustedMonthlyInvestment = monthlyInvestment * inflationAdjustments[i];

        stockValue = (stockValue + adjustedMonthlyInvestment * stockAllocation / 100) * (1 + stockCAGR / 100 / 12);
        reitValue = (reitValue + adjustedMonthlyInvestment * reitAllocation / 100) * (1 + reitCAGR / 100 / 12);
        cryptoValue = (cryptoValue + adjustedMonthlyInvestment * cryptoAllocation / 100) * (1 + cryptoCAGR / 100 / 12);
        bondValue = (bondValue + adjustedMonthlyInvestment * bondAllocation / 100) * (1 + bondCAGR / 100 / 12);
        realEstateValue = (realEstateValue + adjustedMonthlyInvestment * realEstateAllocation / 100) * (1 + realEstateCAGR / 100 / 12);
        projectedNetWorth = stockValue + reitValue + cryptoValue + bondValue + realEstateValue;
      }

      if (isMonthly || i % 12 === 0 || i === totalMonths) {
        const dataPoint = {
          date: date.format('YYYY-MM-DD'),
          netWorth: projectedNetWorth * inflationAdjustments[i],
          stocks: stockValue * inflationAdjustments[i],
          reit: reitValue * inflationAdjustments[i],
          crypto: cryptoValue * inflationAdjustments[i],
          bonds: bondValue * inflationAdjustments[i],
          realEstate: realEstateValue * inflationAdjustments[i],
        } as any;

        if (i === currentProgressMonths) {
          dataPoint.currentProgress = currentNetWorth;
        }

        data.push(dataPoint);

        // Determine FIRE date
        if (!fireDateFound && projectedNetWorth >= fireTarget) {
          setFireDate(date.toDate());
          fireDateFound = true;
        }
      }
    }

    if (!data.some(d => d.currentProgress)) {
      const currentProgressDate = currentDateDayjs.format('YYYY-MM-DD');
      const index = data.findIndex(d => dayjs(d.date).isAfter(currentDateDayjs));
      const currentProgressPoint = {
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
      { name: 'Crypto', value: cryptoValue * inflationAdjustments[totalMonths] },
      { name: 'Bonds', value: bondValue * inflationAdjustments[totalMonths] },
      { name: 'Real Estate', value: realEstateValue * inflationAdjustments[totalMonths] }
    ]);
  };

  return { projectionData, assetGrowth, allocationError, fireDate };
};
