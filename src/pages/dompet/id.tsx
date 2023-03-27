import Link from "next/link";
import { useQuery } from "react-query";
import { getWallets } from "@/pages/api/walletApi";

const Dompet = () => {
  const { data, isLoading, isError, error } = useQuery("wallets", getWallets);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Daftar Dompet</h1>
      <ul>
        {data.map((wallet: any) => (
          <li key={wallet.id}>
            <Link href={`/dompet/${wallet.id}`}>
              <a>{wallet.nama_dompet}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dompet;
