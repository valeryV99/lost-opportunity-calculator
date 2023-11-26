import bitcoinHistory from '@/services/responseBitcoinHistory.json';
import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/';
const cacheDuration = 1800 * 1000; // 0.5 hour in milliseconds

export interface CoinGeckoResponse {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

interface CacheType {
  bitcoinHistory: any | null;
  timestamp: number | null;
}

let cache: CacheType = {
  bitcoinHistory: null,
  timestamp: null,
};

export const fetchBitcoinHistory = async (days = 'max', currency = 'usd') => {
  const now = new Date().getTime();

  // Check if cache is valid
  if (
    cache.bitcoinHistory &&
    cache.timestamp &&
    now - cache.timestamp < cacheDuration
  ) {
    return cache.bitcoinHistory;
  }
  try {
    const response = await axios.get(
      `${COINGECKO_BASE_URL}api/v3/coins/bitcoin/market_chart`,
      {
        params: {
          vs_currency: currency,
          days: days,
        },
      }
    );

    // Update cache
    cache = {
      bitcoinHistory: response.data,
      timestamp: now,
    };

    return response.data;
  } catch (error) {
    if (cache.bitcoinHistory) {
      // Return cached data if it exists in case of an error
      return cache.bitcoinHistory;
    } else {
      // Fallback to the static bitcoinHistory
      return bitcoinHistory;
    }
  }
};
