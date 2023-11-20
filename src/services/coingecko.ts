import bitcoinHistory from '@/services/responseBitcoinHistory.json';
import axios from 'axios';
import { cache } from 'react';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/';

export interface CoinGeckoResponse {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

export const revalidate = 3600;
export const fetchBitcoinHistory = cache(
  async (
    days: number | string = 'max',
    currency: string = 'usd'
  ): Promise<CoinGeckoResponse> => {
    try {
      const response = await axios.get<CoinGeckoResponse>(
        `${COINGECKO_BASE_URL}api/v3/coins/bitcoin/market_chart`,
        {
          params: {
            vs_currency: currency,
            days: days,
          },
        }
      );

      return response.data;
    } catch (error) {
      return bitcoinHistory;
      // console.error('Error fetching data from CoinGecko:', error);
      // throw error;
    }
  }
);
