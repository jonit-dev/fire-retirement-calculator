 
import React from 'react';
import { Card, CardContent, CardHeader } from './Card';
import InputField from './InputField';

 

 

interface InputFieldsProps {
  values: any;
  setValues: any;
}

const InputFields: React.FC<InputFieldsProps> = ({ values, setValues }) => {
  const fieldGroups = [
    {
      title: "General Information",
      fields: [
        { id: 'initialNetWorth', label: 'Initial Net Worth ($)', value: values.initialNetWorth, onChange: setValues.setInitialNetWorth, tooltip: 'Initial amount of money you have for retirement.' },
        { id: 'monthlyContribution', label: 'Monthly Contribution ($)', value: values.monthlyContribution, onChange: setValues.setMonthlyContribution, tooltip: 'Amount you contribute monthly towards retirement.' },
        { id: 'years', label: 'Total Projection Years', value: values.years, onChange: setValues.setYears, tooltip: 'Number of years you plan to keep contributing.' },
        { id: 'annualInflationRate', label: 'Annual Inflation Rate (%)', value: values.annualInflationRate, onChange: setValues.setAnnualInflationRate, tooltip: 'Expected annual inflation rate, typically around 2-3% in the US.' },
        { id: 'initialDate', label: 'Initial Date', value: values.initialDate, onChange: setValues.setInitialDate, type: 'date', tooltip: 'The start date for the projection.' },
        { id: 'currentDate', label: 'Current Date', value: values.currentDate, onChange: setValues.setCurrentDate, type: 'date', tooltip: 'The current date for the projection.' },
        { id: 'currentNetWorth', label: 'Current Net Worth ($)', value: values.currentNetWorth, onChange: setValues.setCurrentNetWorth, tooltip: 'Your current net worth.' },
        { id: 'annualExpenses', label: 'Annual Expenses ($)', value: values.annualExpenses, onChange: setValues.setAnnualExpenses, tooltip: 'Your estimated annual expenses in retirement.' },
        { id: 'withdrawalRate', label: 'Withdrawal Rate (%)', value: values.withdrawalRate, onChange: setValues.setWithdrawalRate, tooltip: 'The percentage of your portfolio you plan to withdraw annually in retirement. Default is 4% based on the \'4% rule\'.' },
      ]
    },
    {
      title: "Asset Allocation",
      fields: [
        { id: 'stockAllocation', label: 'Stock Allocation (%)', value: values.stockAllocation, onChange: setValues.setStockAllocation, tooltip: 'Percentage of your net worth invested in stocks.' },
        { id: 'realEstateAllocation', label: 'Real Estate Allocation (%)', value: values.realEstateAllocation, onChange: setValues.setRealEstateAllocation, tooltip: 'Percentage of your net worth invested in real estate and other assets.' },
        { id: 'reitAllocation', label: 'REIT Allocation (%)', value: values.reitAllocation, onChange: setValues.setReitAllocation, tooltip: 'Percentage of your net worth invested in REITs.' },
        { id: 'cryptoAllocation', label: 'Crypto Allocation (%)', value: values.cryptoAllocation, onChange: setValues.setCryptoAllocation, tooltip: 'Percentage of your net worth invested in cryptocurrencies.' },
        { id: 'bondAllocation', label: 'Bond Allocation (%)', value: values.bondAllocation, onChange: setValues.setBondAllocation, tooltip: 'Percentage of your net worth invested in bonds.' },
      ]
    },
    {
      title: "Growth Rates",
      fields: [
        { id: 'stockCAGR', label: 'Stock CAGR (%)', value: values.stockCAGR, onChange: setValues.setStockCAGR, tooltip: 'The historical average annual return for the US S&P 500 is around 7-10%.' },
        { id: 'reitCAGR', label: 'REIT CAGR (%)', value: values.reitCAGR, onChange: setValues.setReitCAGR, tooltip: 'The average annual return for REITs is around 8-12%.' },
        { id: 'cryptoCAGR', label: 'Crypto CAGR (%)', value: values.cryptoCAGR, onChange: setValues.setCryptoCAGR, tooltip: 'You may consider using the historical average annual return for bitcoin, which on the next decade, can be around 25-30%, conservatively.' },
        { id: 'bondCAGR', label: 'Bond CAGR (%)', value: values.bondCAGR, onChange: setValues.setBondCAGR, tooltip: 'Historically, bonds have an average annual return of around 3-5%.' },
        { id: 'realEstateCAGR', label: 'Real Estate CAGR (%)', value: values.realEstateCAGR, onChange: setValues.setRealEstateCAGR, tooltip: 'The average annual return for real estate is around 6-8%.' },
      ]
    }
  ];

  return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      {fieldGroups.map((group, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <h3 className="text-xl font-semibold text-white">{group.title}</h3>
          </CardHeader>
          <CardContent>
            {group.fields.map((field) => (
              <InputField key={field.id} {...field} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InputFields;
