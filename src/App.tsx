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
import zoomPlugin from 'chartjs-plugin-zoom';
import { BarChart, LineChart, PieChart } from './components/ChartComponent';
import InputField from './components/InputField';
import { CHART_COLORS } from './constants/ChartConstants';
import useLocalStorage from './hooks/useLocalStorage';
import { useRetirementCalculator } from './hooks/useRetirementCalculator';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, zoomPlugin);

const RetirementCalculator = () => {
  const [initialNetWorth, setInitialNetWorth] = useLocalStorage<number>('initialNetWorth', 1000);
  const [monthlyContribution, setMonthlyContribution] = useLocalStorage<number>('monthlyContribution', 500);
  const [years, setYears] = useLocalStorage<number>('years', 30);
  const [stockAllocation, setStockAllocation] = useLocalStorage<number>('stockAllocation', 60);
  const [reitAllocation, setReitAllocation] = useLocalStorage<number>('reitAllocation', 10);
  const [cryptoAllocation, setCryptoAllocation] = useLocalStorage<number>('cryptoAllocation', 5);
  const [bondAllocation, setBondAllocation] = useLocalStorage<number>('bondAllocation', 25);
  const [stockCAGR, setStockCAGR] = useLocalStorage<number>('stockCAGR', 7);
  const [reitCAGR, setReitCAGR] = useLocalStorage<number>('reitCAGR', 4);
  const [cryptoCAGR, setCryptoCAGR] = useLocalStorage<number>('cryptoCAGR', 10);
  const [bondCAGR, setBondCAGR] = useLocalStorage<number>('bondCAGR', 3);
  const [annualInflationRate, setAnnualInflationRate] = useLocalStorage<number>('annualInflationRate', 2);
  const [initialDate, setInitialDate] = useLocalStorage<Date>('initialDate', new Date());
  const [currentDate, setCurrentDate] = useLocalStorage<Date>('currentDate', new Date());
  const [currentNetWorth, setCurrentNetWorth] = useLocalStorage<number>('currentNetWorth', 1000);
  

  const { projectionData, assetGrowth, allocationError } = useRetirementCalculator(
    initialNetWorth,
    monthlyContribution,
    years,
    stockAllocation,
    reitAllocation,
    cryptoAllocation,
    bondAllocation,
    stockCAGR,
    reitCAGR,
    cryptoCAGR,
    bondCAGR,
    annualInflationRate,
    initialDate,
    currentDate,
    currentNetWorth,
    true
  );

  const formatCurrency = (value: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const lineChartData = {
    labels: projectionData.map((d) => d.date),
    datasets: [
      {
        label: 'Net Worth',
        data: projectionData.map((d) => d.netWorth),
        borderColor: '#8884d8',
        backgroundColor: '#8884d8',
        hidden: false,
      },
      {
        label: 'Stocks',
        data: projectionData.map((d) => d.stocks),
        borderColor: CHART_COLORS[0],
        backgroundColor: CHART_COLORS[0],
      },
      {
        label: 'REIT',
        data: projectionData.map((d) => d.reit),
        borderColor: CHART_COLORS[1],
        backgroundColor: CHART_COLORS[1],
      },
      {
        label: 'Crypto',
        data: projectionData.map((d) => d.crypto),
        borderColor: CHART_COLORS[2],
        backgroundColor: CHART_COLORS[2],
      },
      {
        label: 'Bonds',
        data: projectionData.map((d) => d.bonds),
        borderColor: CHART_COLORS[3],
        backgroundColor: CHART_COLORS[3],
      },
      {
        label: 'Current Progress',
        data: projectionData.map((d) => d.currentProgress || null),
        borderColor: 'red',
        backgroundColor: 'red',
        pointRadius: projectionData.map((d) => (d.currentProgress ? 6 : 0)),
        pointHoverRadius: projectionData.map((d) => (d.currentProgress ? 8 : 0)),
        pointStyle: projectionData.map((d) => (d.currentProgress ? 'circle' : 'circle')),
        showLine: false,
        order: -1,
        pointBackgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: assetGrowth.map((a) => a.name),
    datasets: [
      {
        data: assetGrowth.map((a) => a.value),
        backgroundColor: CHART_COLORS,
      },
    ],
  };

  const barChartData = {
    labels: assetGrowth.map((a) => a.name),
    datasets: [
      {
        label: 'Asset Value',
        data: assetGrowth.map((a) => a.value),
        backgroundColor: CHART_COLORS,
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-800 text-gray-200 shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">F.I.R.E Retirement Calculator</h2>
      </div>
      {allocationError && (
        <div className="mb-4 p-4 bg-red-600 text-white border border-red-800 rounded">
          {allocationError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <InputField id="initialNetWorth" label="Initial Net Worth ($)" value={initialNetWorth} onChange={setInitialNetWorth} />
        <InputField id="monthlyContribution" label="Monthly Contribution ($)" value={monthlyContribution} onChange={setMonthlyContribution} />
        <InputField id="years" label="Projection Years" value={years} onChange={setYears} />
        <InputField id="annualInflationRate" label="Annual Inflation Rate (%)" value={annualInflationRate} onChange={setAnnualInflationRate} />
        <InputField id="initialDate" label="Initial Date" value={initialDate} onChange={setInitialDate} type="date" />
        <InputField id="currentDate" label="Current Date" value={currentDate} onChange={setCurrentDate} type="date" />
        <InputField id="currentNetWorth" label="Current Net Worth ($)" value={currentNetWorth} onChange={setCurrentNetWorth} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <InputField id="stockAllocation" label="Stock Allocation (%)" value={stockAllocation} onChange={setStockAllocation} />
        <InputField id="reitAllocation" label="REIT Allocation (%)" value={reitAllocation} onChange={setReitAllocation} />
        <InputField id="cryptoAllocation" label="Crypto Allocation (%)" value={cryptoAllocation} onChange={setCryptoAllocation} />
        <InputField id="bondAllocation" label="Bond Allocation (%)" value={bondAllocation} onChange={setBondAllocation} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <InputField id="stockCAGR" label="Stock CAGR (%)" value={stockCAGR} onChange={setStockCAGR} />
        <InputField id="reitCAGR" label="REIT CAGR (%)" value={reitCAGR} onChange={setReitCAGR} />
        <InputField id="cryptoCAGR" label="Crypto CAGR (%)" value={cryptoCAGR} onChange={setCryptoCAGR} />
        <InputField id="bondCAGR" label="Bond CAGR (%)" value={bondCAGR} onChange={setBondCAGR} />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Net Worth and Asset Growth Over Time</h3>
        <LineChart data={lineChartData} />
      </div>

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

      <div className="mt-4">
        <p className="font-bold">Final Net Worth: {formatCurrency(projectionData[projectionData.length - 1]?.netWorth || 0)}</p>
      </div>
    </div>
  );
};

export default RetirementCalculator;
