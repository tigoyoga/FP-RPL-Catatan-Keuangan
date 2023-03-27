// walletApi.ts
export const getWallet = async (id: any) => {
    const response = await fetch(`/secured/dompet/:id`);
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return response.json();
  };

  export const getWallets = async () => {
    const response = await fetch('/api/wallet');
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return response.json();
  };
  
  export const deleteWallet = async (id: any) => {
    const response = await fetch(`/secured/dompet/:id`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
  };
  