// RetirementCalculatorService.ts
import dayjs from 'dayjs';
import { injectable } from 'tsyringe';

export interface ProjectionData {
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

@injectable()
export class RetirementCalculatorService {
  adjustForInflation(
    value: number,
    months: number,
    annualInflationRate: number
  ): number {
    return value / Math.pow(1 + annualInflationRate / 100, months / 12);
  }

  calculateAdjustedMonthlyInvestment(
    monthlyInvestment: number,
    isRetired: boolean,
    inflationAdjustments: number[],
    i: number
  ): number {
    return isRetired ? 0 : monthlyInvestment * inflationAdjustments[i];
  }

  updateAssetValues(
    value: number,
    allocation: number,
    CAGR: number,
    monthlyInvestment: number,
    applyTaxes: boolean,
    taxRate: number
  ): number {
    const growth = value * (CAGR / 100 / 12);
    const afterTaxGrowth = applyTaxes ? growth * (1 - taxRate / 100) : growth;
    return value + (monthlyInvestment * allocation) / 100 + afterTaxGrowth;
  }

  calculateWithdrawals(
    adjustedAnnualExpenses: number,
    assetValues: number[],
    projectedNetWorth: number
  ): number[] {
    const monthlyWithdrawal = adjustedAnnualExpenses / 12;
    return assetValues.map(
      (value) => value - monthlyWithdrawal * (value / projectedNetWorth)
    );
  }

  calculateProjection(
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
  ): {
    data: ProjectionData[];
    fireDate: Date | null;
    assetGrowth: { name: string; value: number }[];
  } {
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
      (_, i) => this.adjustForInflation(1, i, annualInflationRate)
    );
    const adjustedAnnualExpenses =
      annualExpenses * inflationAdjustments[totalMonths];

    let fireDate: Date | null = null;

    for (let i = 0; i <= totalMonths; i++) {
      const date = initialDateDayjs.add(i, 'month');

      if (i > 0) {
        const adjustedMonthlyInvestment =
          this.calculateAdjustedMonthlyInvestment(
            monthlyContribution,
            isRetired,
            inflationAdjustments,
            i
          );
        const applyTaxes = isRetired && includeWithdrawals;

        stockValue = this.updateAssetValues(
          stockValue,
          stockAllocation,
          stockCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (stockAllocation / 100),
          applyTaxes,
          taxRate
        );
        reitValue = this.updateAssetValues(
          reitValue,
          reitAllocation,
          reitCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (reitAllocation / 100),
          applyTaxes,
          taxRate
        );
        cryptoValue = this.updateAssetValues(
          cryptoValue,
          cryptoAllocation,
          cryptoCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (cryptoAllocation / 100),
          applyTaxes,
          taxRate
        );
        bondValue = this.updateAssetValues(
          bondValue,
          bondAllocation,
          bondCAGR,
          adjustedMonthlyInvestment +
            excessReinvestment * (bondAllocation / 100),
          applyTaxes,
          taxRate
        );
        realEstateValue = this.updateAssetValues(
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

          const updatedValues = this.calculateWithdrawals(
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
          fireDate = date.toDate();
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

    const assetGrowth = [
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
    ];

    return { data, fireDate, assetGrowth };
  }
}
