import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { getWallet, deleteWallet } from "@/pages/api/walletApi";

const DetailDompet = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, isError, error } = useQuery(
    ["wallet", id],
    () => getWallet(id),
    { enabled: !!id }
  );

  const deleteMutation = useMutation(deleteWallet);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/dompet");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>{data.nama_dompet}</h1>
      <p>Saldo: {data.saldo}</p>
      <ul>
        {data.list_user.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DetailDompet;
