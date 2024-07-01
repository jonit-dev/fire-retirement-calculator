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
import dayjs from 'dayjs';
import { BarChart, LineChart, PieChart } from './components/ChartComponent';
import InputField from './components/InputField';
import { CHART_COLORS } from './constants/ChartConstants';
import useLocalStorage from './hooks/useLocalStorage';
import { useRetirementCalculator } from './hooks/useRetirementCalculator';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, zoomPlugin, annotationPlugin);

const RetirementCalculator = () => {
  const [initialNetWorth, setInitialNetWorth] = useLocalStorage<number>('initialNetWorth', 1000);
  const [monthlyContribution, setMonthlyContribution] = useLocalStorage<number>('monthlyContribution', 500);
  const [years, setYears] = useLocalStorage<number>('years', 40);
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
  const [currentNetWorth, setCurrentNetWorth] = useLocalStorage<number>('currentNetWorth', 1000);
  const [annualExpenses, setAnnualExpenses] = useLocalStorage<number>('annualExpenses', 40000);

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
    annualExpenses
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
        label: 'Real Estate',
        data: projectionData.map((d) => d.realEstate),
        borderColor: CHART_COLORS[4],
        backgroundColor: CHART_COLORS[4],
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
    options: {
      plugins: {
        annotation: {
          annotations: fireDate ? {
            line1: {
              type: 'line',
              xMin: fireDate,
              xMax: fireDate,
              borderColor: 'yellow',
              borderWidth: 2,
              label: {
                content: 'FIRE Date',
                enabled: true,
                position: 'top'
              }
            }
          } : {}
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          modifierKey: 'shift',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
          },
          mode: 'x',
        },
      },
      annotation: {
        annotations: fireDate ? {
          fireLabel: {
            type: 'label',
            xValue: dayjs(fireDate).format('YYYY-MM-DD'),
            backgroundColor: 'rgba(245, 245, 245, 0.1)',
            content: 'Retirement Date',
            font: {
              size: 10
            },
            color: 'yellow',
          },
          fireLine: {
            type: 'line',
            xMin: dayjs(fireDate).format('YYYY-MM-DD'),
            xMax: dayjs(fireDate).format('YYYY-MM-DD'),
            borderColor: 'yellow',
            borderWidth: 2,
            borderDash: [5, 5],

          }
        } : {}
      },

    },
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
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-800 text-gray-200 shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">F.I.R.E Retirement Calculator</h2>
      </div>
      {allocationError && (
        <div className="mb-4 p-4 bg-red-600 text-white border border-red-800 rounded">
          {allocationError}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <InputField
            id="initialNetWorth"
            label="Initial Net Worth ($)"
            value={initialNetWorth}
            onChange={setInitialNetWorth}
            tooltip="Initial amount of money you have for retirement."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="monthlyContribution"
            label="Monthly Contribution ($)"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
            tooltip="Amount you contribute monthly towards retirement."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="years"
            label="Total Projection Years"
            value={years}
            onChange={setYears}
            tooltip="Number of years you plan to keep contributing."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="annualInflationRate"
            label="Annual Inflation Rate (%)"
            value={annualInflationRate}
            onChange={setAnnualInflationRate}
            tooltip="Expected annual inflation rate, typically around 2-3% in the US."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="initialDate"
            label="Initial Date"
            value={initialDate}
            onChange={setInitialDate}
            type="date"
            tooltip="The start date for the projection."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="currentDate"
            label="Current Date"
            value={currentDate}
            onChange={setCurrentDate}
            type="date"
            tooltip="The current date for the projection."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="currentNetWorth"
            label="Current Net Worth ($)"
            value={currentNetWorth}
            onChange={setCurrentNetWorth}
            tooltip="Your current net worth."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="annualExpenses"
            label="Annual Expenses ($)"
            value={annualExpenses}
            onChange={setAnnualExpenses}
            tooltip="Your estimated annual expenses in retirement."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        <div className="col-span-1">
          <InputField
            id="stockAllocation"
            label="Stock Allocation (%)"
            value={stockAllocation}
            onChange={setStockAllocation}
            tooltip="Percentage of your net worth invested in stocks."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="realEstateAllocation"
            label="Real Estate Allocation (%)"
            value={realEstateAllocation}
            onChange={setRealEstateAllocation}
            tooltip="Percentage of your net worth invested in real estate and other assets."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="reitAllocation"
            label="REIT Allocation (%)"
            value={reitAllocation}
            onChange={setReitAllocation}
            tooltip="Percentage of your net worth invested in REITs."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="cryptoAllocation"
            label="Crypto Allocation (%)"
            value={cryptoAllocation}
            onChange={setCryptoAllocation}
            tooltip="Percentage of your net worth invested in cryptocurrencies."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="bondAllocation"
            label="Bond Allocation (%)"
            value={bondAllocation}
            onChange={setBondAllocation}
            tooltip="Percentage of your net worth invested in bonds."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        <div className="col-span-1">
          <InputField
            id="stockCAGR"
            label="Stock CAGR (%)"
            value={stockCAGR}
            onChange={setStockCAGR}
            tooltip="The historical average annual return for the US S&P 500 is around 7-10%."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="reitCAGR"
            label="REIT CAGR (%)"
            value={reitCAGR}
            onChange={setReitCAGR}
            tooltip="The average annual return for REITs is around 8-12%."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="cryptoCAGR"
            label="Crypto CAGR (%)"
            value={cryptoCAGR}
            onChange={setCryptoCAGR}
            tooltip="You may consider using the historical average annual return for bitcoin, which on the next decade, can be around 25-30%, conservatively."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="bondCAGR"
            label="Bond CAGR (%)"
            value={bondCAGR}
            onChange={setBondCAGR}
            tooltip="Historically, bonds have an average annual return of around 3-5%."
          />
        </div>
        <div className="col-span-1">
          <InputField
            id="realEstateCAGR"
            label="Real Estate CAGR (%)"
            value={realEstateCAGR}
            onChange={setRealEstateCAGR}
            tooltip="The average annual return for real estate is around 6-8%."
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Net Worth and Asset Growth Over Time</h3>
        <LineChart data={lineChartData} options={lineChartOptions as any} />
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
        {fireDate && (
          <p className="font-bold">Estimated FIRE Date: {dayjs(fireDate).format('MMMM D, YYYY')}</p>
        )}
      </div>
    </div>
  );
};

export default RetirementCalculator;
