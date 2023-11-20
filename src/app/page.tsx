import { HomeComponent } from '@/components/pages/home/Home';
import { fetchBitcoinHistory } from '@/services/coingecko';

export default async function Home() {
  const data = await fetchBitcoinHistory();
  return <HomeComponent coingeckoData={data} />;
}
