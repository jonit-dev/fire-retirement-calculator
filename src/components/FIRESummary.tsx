import dayjs from 'dayjs';
import React from 'react';

interface FIRESummaryProps {
  initialNetWorth: number;
  monthlyContribution: number;
  years: number;
  yearsToFire: number | null;
  netWorthAtFire: number;
  withdrawalRate: number;
  annualExpenses: number;
  fireDate: Date | null;
  currentAge: number;
  formatCurrency: (value: any) => string;
}

const FIRESummary: React.FC<FIRESummaryProps> = ({
  initialNetWorth,
  monthlyContribution,
  years,
  yearsToFire,
  netWorthAtFire,
  withdrawalRate,
  annualExpenses,
  fireDate,
  currentAge,
  formatCurrency,
}) => {
  return (
    <div className="mt-8 p-4 bg-gray-700 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-2 text-white">Summary</h3>
      <p>
        Starting with <span className="text-yellow-400">{formatCurrency(initialNetWorth)}</span> and investing <span className="text-yellow-400">{formatCurrency(monthlyContribution)}</span> monthly,
        {fireDate ? (
          <>
            you'll reach your F.I.R.E. goal in approximately <span className="text-yellow-400">{yearsToFire} years</span> with a net worth of <span className="text-yellow-400">{formatCurrency(netWorthAtFire)}</span>.
          </>
        ) : (
          <>
            you'll have a net worth of <span className="text-yellow-400">{formatCurrency(netWorthAtFire)}</span> after <span className="text-yellow-400">{years} years</span>.
          </>
        )}
      </p>
      <p>
        Your annual withdrawal at a <span className="text-yellow-400">{withdrawalRate}%</span> rate would be <span className="text-yellow-400">{formatCurrency(netWorthAtFire * (withdrawalRate / 100))}</span>
        {!fireDate && <span className="text-red-500"> which is not enough to cover your annual expenses of {formatCurrency(annualExpenses)}</span>}
      </p>
      {fireDate && (
        <p>
          Based on your current age of <span className="text-yellow-400">{currentAge}</span>, you are projected to reach your <span className="text-yellow-400">F.I.R.E.</span> date by <span className="text-yellow-400">{dayjs(fireDate).format('MMMM D, YYYY')}</span>, at which point you will be approximately <span className="text-yellow-400">{currentAge + yearsToFire!} years</span> old.
        </p>
      )}
      <p className="text-gray-400 mt-4">
        Expected annual inflation rate is typically around 2-3% in the US (CPI). Alternative sources estimate higher rates, potentially up to 5-7%.
      </p>
    </div>
  );
};

export default FIRESummary;
