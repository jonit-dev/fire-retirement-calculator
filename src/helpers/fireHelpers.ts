import dayjs from 'dayjs';

export const getNetWorthAtFireDate = (projectionData: any, fireDate: Date) => {
  const fireDateFormatted = dayjs(fireDate).format('YYYY-MM-DD');
  const fireData: { date: Date; netWorth: number } | undefined = projectionData.find((data: { date: Date }) => dayjs(data.date).format('YYYY-MM-DD') === fireDateFormatted);
  return fireData ? fireData.netWorth : projectionData[projectionData.length - 1]?.netWorth;
};

export const getYearsToFire = (initialDate: Date, fireDate: Date) => {
  return dayjs(fireDate).diff(dayjs(initialDate), 'year', true);
};
