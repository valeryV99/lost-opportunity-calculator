'use client';

import { CoinGeckoResponse } from '@/services/coingecko';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const INIT_CHART_DATA: {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];
    borderColor: string;
    tension: number;
  }[];
} = {
  labels: [],
  datasets: [
    {
      label: 'Bitcoin Price (USD)',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

interface Props {
  initialData: CoinGeckoResponse;
}

interface InvestmentResult {
  totalInvested: number;
  finalValue: number;
  profitOrLoss: number;
}

interface InvestmentResult {
  totalInvested: number;
  finalValue: number;
  profitOrLoss: number;
}

// Constants
const millisecondsPerSecond = 1000;
const secondsPerMinute = 60;
const minutesPerHour = 60;
const hoursPerDay = 24;
const daysPerYear = 365; // This does not account for leap years

// Calculate milliseconds in two years
const twoYearsInMilliseconds =
  millisecondsPerSecond *
  secondsPerMinute *
  minutesPerHour *
  hoursPerDay *
  daysPerYear *
  2;

function calculateBitcoinInvestment(
  startDate: string | number,
  endDate: string | number,
  interval: 'daily' | 'weekly' | 'monthly',
  amount: number,
  prices: number[][]
): InvestmentResult {
  // Подготовка дат
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  let totalInvested = 0;
  let totalBitcoin = 0;

  for (
    let d = new Date(start);
    d.getTime() <= end;
    d.setDate(
      d.getDate() + (interval === 'daily' ? 1 : interval === 'weekly' ? 7 : 30)
    )
  ) {
    const timestamp = d.getTime();
    const priceData = prices.find(
      ([date]) => date >= timestamp && date < timestamp + 86400000
    ); // 86400000 - количество миллисекунд в одном дне

    if (priceData) {
      const [, price] = priceData;
      totalInvested += amount;
      totalBitcoin += amount / price;
    }
  }

  const finalPriceData = prices.find(([date]) => date >= end);
  const finalPrice = finalPriceData ? finalPriceData[1] : 0;
  console.log(finalPrice, 'finalPrice');
  const finalValue = totalBitcoin * finalPrice;

  return {
    totalInvested,
    finalValue,
    profitOrLoss: finalValue - totalInvested,
  };
}

export const Chart = ({ initialData }: Props) => {
  const [chartData, setChartData] = useState(INIT_CHART_DATA);
  const prices = initialData.prices || [];
  const setFormattedData = () => {
    setChartData({
      labels: prices?.map((p) => {
        let date = new Date(p[0] || 0);
        return date.toLocaleDateString();
      }),
      datasets: [
        {
          label: 'Bitcoin Price (USD)',
          data: prices?.map((p) => p[1]),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    });
  };

  useEffect(() => {
    setFormattedData();
  }, [initialData]);
  // const fetchHistory = async () => {
  //   try {
  //     const response = await fetchBitcoinHistory();
  //     setFormattedData(response);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  //
  // useEffect(() => {
  //   fetchHistory();
  // }, []);
  console.log(
    prices[prices.length - 1][0].toLocaleString(),
    'prices[prices.length - 1][0].toLocaleString()'
  );
  const result = calculateBitcoinInvestment(
    initialData.prices[initialData.prices.length - 1][0] -
      twoYearsInMilliseconds,
    initialData.prices[initialData.prices.length - 1][0],
    'weekly',
    150,
    prices
  );

  return (
    <div>
      <h2>Bitcoin Price Chart</h2>
      <div>
        Last update:
        {new Date(
          initialData.prices[initialData.prices.length - 1][0]
        ).toLocaleDateString()}
      </div>
      <div>
        Last price: {initialData.prices[initialData.prices.length - 1][1]}
      </div>
      <Line data={chartData} />

      <div>
        <div>
          from:{' '}
          {new Date(
            initialData.prices[initialData.prices.length - 1][0] -
              twoYearsInMilliseconds
          ).toLocaleDateString()}{' '}
          to{' '}
          {new Date(
            initialData.prices[initialData.prices.length - 1][0]
          ).toLocaleDateString()}{' '}
        </div>
        <div>investment 150$ Weekly</div>
        <div>Invested: {result.totalInvested?.toFixed(2)}</div>
        <div>Rewards: {result.profitOrLoss?.toFixed(2)}</div>
        <div>Final value: {result.finalValue?.toFixed(2)}</div>
      </div>
    </div>
  );
};
