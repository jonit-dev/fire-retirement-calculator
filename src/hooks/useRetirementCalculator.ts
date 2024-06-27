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
  annualInflationRate: number
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
  }, [initialNetWorth, monthlyContribution, monthlyExpenses, years, stockAllocation, reitAllocation, cryptoAllocation, bondAllocation, stockCAGR, reitCAGR, cryptoCAGR, bondCAGR, annualInflationRate]);

  const adjustForInflation = (value: number, months: number, annualInflationRate: number) => {
    return value / (1 + annualInflationRate / 100) ** (months / 12);
  };

  const calculateProjection = () => {
    const monthlyInvestment = monthlyContribution - monthlyExpenses;
    const months = years * 12;
    let currentNetWorth = initialNetWorth;
    const data = [];
    let stockValue = currentNetWorth * stockAllocation / 100;
    let reitValue = currentNetWorth * reitAllocation / 100;
    let cryptoValue = currentNetWorth * cryptoAllocation / 100;
    let bondValue = currentNetWorth * bondAllocation / 100;

    for (let i = 0; i <= months; i++) {
      const date = new Date(2024, 5, 26);
      date.setMonth(date.getMonth() + i);

      if (i > 0) {
        const adjustedMonthlyInvestment = adjustForInflation(monthlyInvestment, i, annualInflationRate);

        stockValue = (stockValue + adjustedMonthlyInvestment * stockAllocation / 100) * (1 + stockCAGR / 100 / 12);
        reitValue = (reitValue + adjustedMonthlyInvestment * reitAllocation / 100) * (1 + reitCAGR / 100 / 12);
        cryptoValue = (cryptoValue + adjustedMonthlyInvestment * cryptoAllocation / 100) * (1 + cryptoCAGR / 100 / 12);
        bondValue = (bondValue + adjustedMonthlyInvestment * bondAllocation / 100) * (1 + bondCAGR / 100 / 12);
        currentNetWorth = stockValue + reitValue + cryptoValue + bondValue;
      }

      if (i % 12 === 0) {
        data.push({
          date: date.toISOString().split('T')[0],
          netWorth: adjustForInflation(currentNetWorth, i, annualInflationRate),
          stocks: adjustForInflation(stockValue, i, annualInflationRate),
          reit: adjustForInflation(reitValue, i, annualInflationRate),
          crypto: adjustForInflation(cryptoValue, i, annualInflationRate),
          bonds: adjustForInflation(bondValue, i, annualInflationRate),
        });
      }
    }

    setProjectionData(data);
    setAssetGrowth([
      { name: 'Stocks', value: adjustForInflation(stockValue, months, annualInflationRate) },
      { name: 'REIT', value: adjustForInflation(reitValue, months, annualInflationRate) },
      { name: 'Crypto', value: adjustForInflation(cryptoValue, months, annualInflationRate) },
      { name: 'Bonds', value: adjustForInflation(bondValue, months, annualInflationRate) }
    ]);
  };

  return { projectionData, assetGrowth, allocationError };
};
 