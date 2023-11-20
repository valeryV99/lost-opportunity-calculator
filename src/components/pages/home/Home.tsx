import { Chart } from '@/components/pages/home/components/chart/Chart';
import { CoinGeckoResponse } from '@/services/coingecko';

interface Props {
  coingeckoData: CoinGeckoResponse;
}

export const HomeComponent = ({ coingeckoData }: Props) => {
  console.log(coingeckoData, 'coingeckoData');
  return <Chart initialData={coingeckoData} />;
};
