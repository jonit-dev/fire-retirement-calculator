import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Input } from './components/Input';
import { Label } from './components/Label';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RetirementCalculator = () => {
  const [initialNetWorth, setInitialNetWorth] = useState(900000);
  const [monthlyIncome, setMonthlyIncome] = useState(18000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(4500);
  const [years, setYears] = useState(10);
  const [stockAllocation, setStockAllocation] = useState(35);
  const [reitAllocation, setReitAllocation] = useState(15);
  const [cryptoAllocation, setCryptoAllocation] = useState(30);
  const [bondAllocation, setBondAllocation] = useState(20);
  const [stockCAGR, setStockCAGR] = useState(20);
  const [reitCAGR, setReitCAGR] = useState(8);
  const [cryptoCAGR, setCryptoCAGR] = useState(40);
  const [bondCAGR, setBondCAGR] = useState(3);
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
  }, [initialNetWorth, monthlyIncome, monthlyExpenses, years, stockAllocation, reitAllocation, cryptoAllocation, bondAllocation, stockCAGR, reitCAGR, cryptoCAGR, bondCAGR]);

  const calculateProjection = () => {
    const monthlyInvestment = monthlyIncome - monthlyExpenses;
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
        stockValue = (stockValue + monthlyInvestment * stockAllocation / 100) * (1 + stockCAGR / 100 / 12);
        reitValue = (reitValue + monthlyInvestment * reitAllocation / 100) * (1 + reitCAGR / 100 / 12);
        cryptoValue = (cryptoValue + monthlyInvestment * cryptoAllocation / 100) * (1 + cryptoCAGR / 100 / 12);
        bondValue = (bondValue + monthlyInvestment * bondAllocation / 100) * (1 + bondCAGR / 100 / 12);
        currentNetWorth = stockValue + reitValue + cryptoValue + bondValue;
      }

      if (i % 12 === 0) {
        data.push({
          date: date.toISOString().split('T')[0],
          netWorth: currentNetWorth,
          stocks: stockValue,
          reit: reitValue,
          crypto: cryptoValue,
          bonds: bondValue
        });
      }
    }

    setProjectionData(data);
    setAssetGrowth([
      { name: 'Stocks', value: stockValue },
      { name: 'REIT', value: reitValue },
      { name: 'Crypto', value: cryptoValue },
      { name: 'Bonds', value: bondValue }
    ]);
  };

  const formatCurrency = (value: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const lineChartData = {
    labels: projectionData.map(d => d.date),
    datasets: [
      {
        label: 'Net Worth',
        data: projectionData.map(d => d.netWorth),
        borderColor: '#8884d8',
        backgroundColor: '#8884d8',
      },
      {
        label: 'Stocks',
        data: projectionData.map(d => d.stocks),
        borderColor: COLORS[0],
        backgroundColor: COLORS[0],
      },
      {
        label: 'REIT',
        data: projectionData.map(d => d.reit),
        borderColor: COLORS[1],
        backgroundColor: COLORS[1],
      },
      {
        label: 'Crypto',
        data: projectionData.map(d => d.crypto),
        borderColor: COLORS[2],
        backgroundColor: COLORS[2],
      },
      {
        label: 'Bonds',
        data: projectionData.map(d => d.bonds),
        borderColor: COLORS[3],
        backgroundColor: COLORS[3],
      },
    ],
  };

  const pieChartData = {
    labels: assetGrowth.map(a => a.name),
    datasets: [
      {
        data: assetGrowth.map(a => a.value),
        backgroundColor: COLORS,
      },
    ],
  };

  const barChartData = {
    labels: assetGrowth.map(a => a.name),
    datasets: [
      {
        label: 'Asset Value',
        data: assetGrowth.map(a => a.value),
        backgroundColor: COLORS,
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-800 text-gray-200 shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Enhanced Interactive Retirement Calculator</h2>
      </div>
      {allocationError && (
        <div className="mb-4 p-4 bg-red-600 text-white border border-red-800 rounded">
          {allocationError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="initialNetWorth">Initial Net Worth ($)</Label>
          <Input id="initialNetWorth" type="number" value={initialNetWorth} onChange={(e) => setInitialNetWorth(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
          <Input id="monthlyIncome" type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="monthlyExpenses">Monthly Expenses ($)</Label>
          <Input id="monthlyExpenses" type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="years">Projection Years</Label>
          <Input id="years" type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="stockAllocation">Stock Allocation (%)</Label>
          <Input id="stockAllocation" type="number" value={stockAllocation} onChange={(e) => setStockAllocation(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="reitAllocation">REIT Allocation (%)</Label>
          <Input id="reitAllocation" type="number" value={reitAllocation} onChange={(e) => setReitAllocation(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="cryptoAllocation">Crypto Allocation (%)</Label>
          <Input id="cryptoAllocation" type="number" value={cryptoAllocation} onChange={(e) => setCryptoAllocation(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="bondAllocation">Bond Allocation (%)</Label>
          <Input id="bondAllocation" type="number" value={bondAllocation} onChange={(e) => setBondAllocation(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="stockCAGR">Stock CAGR (%)</Label>
          <Input id="stockCAGR" type="number" value={stockCAGR} onChange={(e) => setStockCAGR(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="reitCAGR">REIT CAGR (%)</Label>
          <Input id="reitCAGR" type="number" value={reitCAGR} onChange={(e) => setReitCAGR(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="cryptoCAGR">Crypto CAGR (%)</Label>
          <Input id="cryptoCAGR" type="number" value={cryptoCAGR} onChange={(e) => setCryptoCAGR(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
        <div>
          <Label htmlFor="bondCAGR">Bond CAGR (%)</Label>
          <Input id="bondCAGR" type="number" value={bondCAGR} onChange={(e) => setBondCAGR(Number(e.target.value))} className="mt-1 p-2 border rounded bg-gray-700 text-white" />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Net Worth and Asset Growth Over Time</h3>
        <div className="relative h-64">
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2">Final Asset Allocation</h3>
          <div className="relative h-64">
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Asset Growth Comparison</h3>
          <div className="relative h-64">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-bold">Final Net Worth: {formatCurrency(projectionData[projectionData.length - 1]?.netWorth || 0)}</p>
      </div>
    </div>
  );
};

export default RetirementCalculator;
