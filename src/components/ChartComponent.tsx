import { Chart, ChartOptions } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

Chart.register(zoomPlugin);

interface LineChartProps {
  data: any;
  options?: ChartOptions<'line'>;
}

export const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  const chartRef = useRef<Chart<'line'>>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const chart = chartRef.current;

    const handleDoubleClick = () => {
      if (chart && chart.canvas && document.body.contains(chart.canvas)) {
        chart.resetZoom();
      }
    };

    if (chart && chart.canvas && document.body.contains(chart.canvas)) {
      chart.canvas.addEventListener('dblclick', handleDoubleClick);
    }

    return () => {
      if (chart && chart.canvas) {
        chart.canvas.removeEventListener('dblclick', handleDoubleClick);
      }
    };
  }, [chartRef.current]);

  const handleZoom = debounce(({ chart }) => {
    if (!isZoomed) {
      setIsZoomed(true);
    }
  }, 200);

  const handleZoomComplete = debounce(({ chart }) => {
    if (isZoomed && chart.getZoomLevel() === 1) {
      chart.resetZoom();
      setIsZoomed(false);
    }
  }, 200);

  const defaultOptions: ChartOptions<'line'> = {
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
          onZoom: handleZoom,
          onZoomComplete: handleZoomComplete,
        },
      },
    },
  };

  return (
    <div className="relative h-64">
      <Line ref={chartRef} data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

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
