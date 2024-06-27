import { Bar, Line, Pie } from 'react-chartjs-2';


export const LineChart = ({ data }: Record<string, any>) => (
  <div className="relative h-64">
    <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
  </div>
);

export const PieChart = ({ data }: Record<string, any>) => (
  <div className="relative h-64">
    <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
  </div>
);

export const BarChart = ({ data }: Record<string, any>) => (
  <div className="relative h-64">
    <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
  </div>
);
