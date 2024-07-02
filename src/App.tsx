import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { BarChart, LineChart, PieChart } from './components/ChartComponent';

import FIRESummary from './components/FIRESummary';
import InputFields from './components/InputFields';
import { getBarChartData, getLineChartData, getLineChartOptions, getPieChartData } from './helpers/chartHelpers';
import { getNetWorthAtFireDate, getYearsToFire } from './helpers/fireHelpers';
import useLocalStorage from './hooks/useLocalStorage';
import { useRetirementCalculator } from './hooks/useRetirementCalculator';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, zoomPlugin, annotationPlugin);

const RetirementCalculator = () => {
  const [initialNetWorth, setInitialNetWorth] = useLocalStorage<number>('initialNetWorth', 10000);
  const [monthlyContribution, setMonthlyContribution] = useLocalStorage<number>('monthlyContribution', 500);
  const [years, setYears] = useLocalStorage<number>('years', 40);
  const [currentAge, setCurrentAge] = useLocalStorage<number>('currentAge', 30);
  const [stockAllocation, setStockAllocation] = useLocalStorage<number>('stockAllocation', 50);
  const [reitAllocation, setReitAllocation] = useLocalStorage<number>('reitAllocation', 10);
  const [cryptoAllocation, setCryptoAllocation] = useLocalStorage<number>('cryptoAllocation', 5);
  const [bondAllocation, setBondAllocation] = useLocalStorage<number>('bondAllocation', 25);
  const [realEstateAllocation, setRealEstateAllocation] = useLocalStorage<number>('realEstateAllocation', 10);
  const [stockCAGR, setStockCAGR] = useLocalStorage<number>('stockCAGR', 7);
  const [reitCAGR, setReitCAGR] = useLocalStorage<number>('reitCAGR', 8);
  const [cryptoCAGR, setCryptoCAGR] = useLocalStorage<number>('cryptoCAGR', 25);
  const [bondCAGR, setBondCAGR] = useLocalStorage<number>('bondCAGR', 4);
  const [realEstateCAGR, setRealEstateCAGR] = useLocalStorage<number>('realEstateCAGR', 6);
  const [annualInflationRate, setAnnualInflationRate] = useLocalStorage<number>('annualInflationRate', 3);
  const [initialDate, setInitialDate] = useLocalStorage<Date>('initialDate', new Date());
  const [currentDate, setCurrentDate] = useLocalStorage<Date>('currentDate', new Date());
  const [currentNetWorth, setCurrentNetWorth] = useLocalStorage<number>('currentNetWorth', 10000);
  const [annualExpenses, setAnnualExpenses] = useLocalStorage<number>('annualExpenses', 40000);
  const [withdrawalRate, setWithdrawalRate] = useLocalStorage<number>('withdrawalRate', 4);

  const { projectionData, assetGrowth, allocationError, fireDate } = useRetirementCalculator(
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
    true,
    annualExpenses,
    withdrawalRate,
    true
  );

  const formatCurrency = (value: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const lineChartData = getLineChartData(projectionData, fireDate);
  const lineChartOptions = getLineChartOptions(fireDate);

  const pieChartData = getPieChartData(assetGrowth);
  const barChartData = getBarChartData(assetGrowth);

  const values = {
    initialNetWorth, monthlyContribution, years, stockAllocation, reitAllocation, cryptoAllocation, bondAllocation, realEstateAllocation, stockCAGR, reitCAGR, cryptoCAGR, bondCAGR, realEstateCAGR, annualInflationRate, initialDate, currentDate, currentNetWorth, annualExpenses, withdrawalRate, currentAge,
  };

  const setValues = {
    setInitialNetWorth, setMonthlyContribution, setYears, setStockAllocation, setReitAllocation, setCryptoAllocation, setBondAllocation, setRealEstateAllocation, setStockCAGR, setReitCAGR, setCryptoCAGR, setBondCAGR, setRealEstateCAGR, setAnnualInflationRate, setInitialDate, setCurrentDate, setCurrentNetWorth, setAnnualExpenses, setWithdrawalRate, setCurrentAge,
  };

  const netWorthAtFire = getNetWorthAtFireDate(projectionData, fireDate!);
  const yearsToFire = getYearsToFire(initialDate, fireDate!);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-800 text-gray-200 shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">F.I.R.E Retirement Calculator</h2>
      </div>

      <div className="w-full max-w-8xl mx-auto p-4 shadow-lg mb-8">
        <h3 className="text-lg font-bold mb-2">Net Worth and Asset Growth Over Time</h3>
        <LineChart data={lineChartData} options={lineChartOptions as any} />
      </div>

      {!fireDate && (
        <div className="mb-4 p-4 bg-red-600 text-white border border-red-800 rounded">
          You won't retire before {years} years. Try increasing your timeline.
        </div>
      )}

 <FIRESummary
        initialNetWorth={initialNetWorth}
        monthlyContribution={monthlyContribution}
        years={years}
        yearsToFire={yearsToFire}
        netWorthAtFire={netWorthAtFire}
        withdrawalRate={withdrawalRate}
        annualExpenses={annualExpenses}
        fireDate={fireDate}
        currentAge={currentAge}
        formatCurrency={formatCurrency}
 />


      {allocationError && (
        <div className="mb-4 p-4 bg-red-600 text-white border border-red-800 rounded">
          {allocationError}
        </div>
      )}

      <InputFields values={values} setValues={setValues} />

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2">Final Asset Allocation</h3>
          <PieChart data={pieChartData} />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Asset Growth Comparison</h3>
          <BarChart data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;
