import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const useRetirementCalculator = (
  initialNetWorth: number,
  monthlyContribution: number,
  monthlyExpenses: number,
  years: number,
  stockAllocation: number,
  reitAllocation: number,
  cryptoAllocation: number,
  bondAllocation: number,
  stockCAGR: number,
  reitCAGR: number,
  cryptoCAGR: number,
  bondCAGR: number,
  annualInflationRate: number,
  initialDate: Date,
  currentDate: Date,
  currentNetWorth: number,
  isMonthly: boolean
) => {
  const [projectionData, setProjectionData] = useState<any[]>([]);
  const [assetGrowth, setAssetGrowth] = useState<any[]>([]);
  const [allocationError, setAllocationError] = useState('');

  useEffect(() => {
    const totalAllocation = stockAllocation + reitAllocation + cryptoAllocation + bondAllocation;
    if (totalAllocation !== 100) {
      setAllocationError('Total asset allocation must equal 100%.');
    } else {
      setAllocationError('');
      calculateProjection();
    }
  }, [initialNetWorth, monthlyContribution, monthlyExpenses, years, stockAllocation, reitAllocation, cryptoAllocation, bondAllocation, stockCAGR, reitCAGR, cryptoCAGR, bondCAGR, annualInflationRate, initialDate, currentDate, currentNetWorth, isMonthly]);

  const adjustForInflation = (value: number, months: number, annualInflationRate: number) => {
    return value / (1 + annualInflationRate / 100) ** (months / 12);
  };

  const calculateProjection = () => {
    const monthlyInvestment = monthlyContribution - monthlyExpenses;
    const months = years * 12;
    let projectedNetWorth = initialNetWorth;
    const data = [];
    let stockValue = projectedNetWorth * stockAllocation / 100;
    let reitValue = projectedNetWorth * reitAllocation / 100;
    let cryptoValue = projectedNetWorth * cryptoAllocation / 100;
    let bondValue = projectedNetWorth * bondAllocation / 100;

    const initialDateDayjs = dayjs(initialDate);
    const currentDateDayjs = dayjs(currentDate);
    const endDateDayjs = initialDateDayjs.add(months, 'month');

    const totalMonths = endDateDayjs.diff(initialDateDayjs, 'month');
    const currentProgressMonths = currentDateDayjs.diff(initialDateDayjs, 'month');

    for (let i = 0; i <= totalMonths; i++) {
      const date = initialDateDayjs.add(i, 'month');

      if (i > 0) {
        const adjustedMonthlyInvestment = adjustForInflation(monthlyInvestment, i, annualInflationRate);

        stockValue = (stockValue + adjustedMonthlyInvestment * stockAllocation / 100) * (1 + stockCAGR / 100 / 12);
        reitValue = (reitValue + adjustedMonthlyInvestment * reitAllocation / 100) * (1 + reitCAGR / 100 / 12);
        cryptoValue = (cryptoValue + adjustedMonthlyInvestment * cryptoAllocation / 100) * (1 + cryptoCAGR / 100 / 12);
        bondValue = (bondValue + adjustedMonthlyInvestment * bondAllocation / 100) * (1 + bondCAGR / 100 / 12);
        projectedNetWorth = stockValue + reitValue + cryptoValue + bondValue;
      }

      if (isMonthly || i % 12 === 0 || i === totalMonths) {
        const dataPoint = {
          date: date.format('YYYY-MM-DD'),
          netWorth: adjustForInflation(projectedNetWorth, i, annualInflationRate),
          stocks: adjustForInflation(stockValue, i, annualInflationRate),
          reit: adjustForInflation(reitValue, i, annualInflationRate),
          crypto: adjustForInflation(cryptoValue, i, annualInflationRate),
          bonds: adjustForInflation(bondValue, i, annualInflationRate),
        } as any;

        if (i === currentProgressMonths) {
          dataPoint.currentProgress = currentNetWorth;
        }

        data.push(dataPoint);
      }
    }

    // Ensure current progress point is included
    if (!data.some(d => d.currentProgress)) {
      const currentProgressDate = currentDateDayjs.format('YYYY-MM-DD');
      const index = data.findIndex(d => dayjs(d.date).isAfter(currentDateDayjs));
      if (index !== -1) {
        data.splice(index, 0, {
          date: currentProgressDate,
          currentProgress: currentNetWorth,
        });
      } else {
        data.push({
          date: currentProgressDate,
          currentProgress: currentNetWorth,
        });
      }
    }

    setProjectionData(data);
    setAssetGrowth([
      { name: 'Stocks', value: adjustForInflation(stockValue, totalMonths, annualInflationRate) },
      { name: 'REIT', value: adjustForInflation(reitValue, totalMonths, annualInflationRate) },
      { name: 'Crypto', value: adjustForInflation(cryptoValue, totalMonths, annualInflationRate) },
      { name: 'Bonds', value: adjustForInflation(bondValue, totalMonths, annualInflationRate) }
    ]);
  };

  return { projectionData, assetGrowth, allocationError };
};
