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

function calculateBitcoinInvestment(
  startDate: string,
  endDate: string,
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

  const finalValue = totalBitcoin * finalPrice;

  return {
    totalInvested,
    finalValue,
    profitOrLoss: finalValue - totalInvested,
  };
}

export const Chart = ({ initialData }: Props) => {
  const [chartData, setChartData] = useState(INIT_CHART_DATA);

  const setFormattedData = (response: CoinGeckoResponse) => {
    const prices = response.prices || [];

    console.log(
      calculateBitcoinInvestment(
        '2021-11-09',
        '2023-11-20',
        'weekly',
        100,
        prices
      ),
      'calculateBitcoinInvestment'
    );
    console.log(prices, 'prices');
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
    setFormattedData(initialData);
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

  return (
    <div>
      <h2>Bitcoin Price Chart</h2>
      <Line data={chartData} />
    </div>
  );
};
