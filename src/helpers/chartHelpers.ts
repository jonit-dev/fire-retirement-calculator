import dayjs from 'dayjs';
import { CHART_COLORS } from '../constants/ChartConstants';

export const getLineChartOptions = (fireDate: Date | null) => ({
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
            size: 10,
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
        },
      } : {},
    },
  },
});


 
export const getLineChartData = (projectionData: any, fireDate: Date | null) => ({
  labels: projectionData.map((d: any) => d.date),
  datasets: [
    {
      label: 'Net Worth',
      data: projectionData.map((d: any) => d.netWorth),
      borderColor: '#8884d8',
      backgroundColor: '#8884d8',
      hidden: false,
    },
    {
      label: 'Stocks',
      data: projectionData.map((d: any) => d.stocks),
      borderColor: CHART_COLORS[0],
      backgroundColor: CHART_COLORS[0],
    },
    {
      label: 'REIT',
      data: projectionData.map((d: any) => d.reit),
      borderColor: CHART_COLORS[1],
      backgroundColor: CHART_COLORS[1],
    },
    {
      label: 'Crypto',
      data: projectionData.map((d: any) => d.crypto),
      borderColor: CHART_COLORS[2],
      backgroundColor: CHART_COLORS[2],
    },
    {
      label: 'Bonds',
      data: projectionData.map((d: any) => d.bonds),
      borderColor: CHART_COLORS[3],
      backgroundColor: CHART_COLORS[3],
    },
    {
      label: 'Real Estate',
      data: projectionData.map((d: any) => d.realEstate),
      borderColor: CHART_COLORS[4],
      backgroundColor: CHART_COLORS[4],
    },
    {
      label: 'Current Progress',
      data: projectionData.map((d: any) => d.currentProgress || null),
      borderColor: 'red',
      backgroundColor: 'red',
      pointRadius: projectionData.map((d: any) => (d.currentProgress ? 6 : 0)),
      pointHoverRadius: projectionData.map((d: any) => (d.currentProgress ? 8 : 0)),
      pointStyle: projectionData.map((d: any) => (d.currentProgress ? 'circle' : 'circle')),
      showLine: false,
      order: -1,
      pointBackgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
});

export const getPieChartData = (assetGrowth: any) => ({
  labels: assetGrowth.map((a: any) => a.name),
  datasets: [
    {
      data: assetGrowth.map((a: any) => a.value),
      backgroundColor: CHART_COLORS,
    },
  ],
});

export const getBarChartData = (assetGrowth: any) => ({
  labels: assetGrowth.map((a: any) => a.name),
  datasets: [
    {
      label: 'Asset Value',
      data: assetGrowth.map((a: any) => a.value),
      backgroundColor: CHART_COLORS,
    },
  ],
});
