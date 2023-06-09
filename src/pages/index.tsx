import Head from "next/head";

import React from "react";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";

import { api, apiWithToken } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";

import Input from "@/components/forms/Input";

export default function Home() {
  const isAuthenticated = useAuthStore.useIsAuthenticated();
  const login = useAuthStore.useLogin();
  const logout = useAuthStore.useLogout();
  const isLoading = useAuthStore.useIsLoading();
  const stopLoading = useAuthStore.useStopLoading();

  const user = useAuthStore.useUser();

  let [isOpen, setIsOpen] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);

  function closeModal(type: string) {
    if (type === "dompet") {
      setIsOpen(false);
    } else {
      setDeleteModal(false);
    }
  }

  function openModal(type: string) {
    if (type === "add") {
      setIsOpen(true);
    } else {
      setDeleteModal(true);
    }
  }

  const router = useRouter();

  const checkAuth = React.useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      isAuthenticated && logout();
      stopLoading();
      return;
    }
    const loadUser = async () => {
      try {
        const res = await apiWithToken().get("/secured/me");

        login({
          id: res.data.data.id,
          name: res.data.data.name,
          email: res.data.data.email,
          token: token,
          data: res.data.data.list_dompet,
        });
      } catch (err) {
        localStorage.removeItem("token");
      } finally {
        stopLoading();
      }
    };

    if (!isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated, login, logout, stopLoading]);

  React.useEffect(() => {
    checkAuth();

    window.addEventListener("focus", checkAuth);
    return () => {
      window.removeEventListener("focus", checkAuth);
    };
  }, [checkAuth]);

  // usequery to fetch /me
  const { data: dataUtama, isLoading: isFetching } = useQuery(
    ["dompet"],
    async () => {
      const res = await apiWithToken().get("/secured/me");
      return res.data.data.list_dompet;
    },
    {
      enabled: isAuthenticated,
    }
  );

  // mutate delete dompet
  const { mutate: deleteDompet } = useMutation(
    async (id: string) => {
      const response = await toast.promise(
        apiWithToken().delete(`/secured/dompet/${id}`),
        {
          loading: "Loading",
          success: "Success",
          error: "Error",
        }
      );

      return response.data.data;
    },
    {
      onSuccess: () => {
        router.reload();
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  if (!isAuthenticated) {
    if (router.isReady) router.push("/login");
  }

  // usemutation for add dompet
  const { mutate: addDompet } = useMutation(
    async (data: any) => {
      data.saldo = Number(data.saldo);

      const response = await toast.promise(
        apiWithToken().post("/secured/dompet", data),
        {
          loading: "Loading",
          success: "Success",
          error: "Error",
        }
      );

      return response.data.data;
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        closeModal("add");
        router.reload();
      },
    }
  );

  const onSubmit = (data: any) => {
    if (data.nama_dompet) {
      addDompet(data);
    } else {
      deleteDompet(deleteId.toString());
    }
  };

  if (isLoading || !router.isReady || isFetching) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Catatan Keuangan</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main
        className='flex overflow-hidden bg-cover bg-[#252635] h-full w-full'
        style={{ backgroundImage: "url('/images/Dashboard Utama.png')" }}
      >
        {/* create sidebar with aside */}
        <aside className='w-[18%] h-screen bg-gray-800'>
          <div className='flex flex-col items-center justify-center h-32'>
            <h1 className='text-white text-2xl font-bold'>Catatan Keuangan</h1>
            <p className='text-xl text-white mt-4'>Hello, {user?.name}</p>
          </div>
          <div className='flex flex-col items-center justify-center gap-4 h-full'>
            <button
              type='button'
              onClick={() => openModal("add")}
              className='rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
            >
              Tambah Dompet
            </button>
            <button
              type='button'
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className='rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
            >
              Logout
            </button>
          </div>
        </aside>

        <section className='w-[82%] flex flex-col gap-12 h-screen overflow-auto pb-8'>
          <Modal
            onSubmit={onSubmit}
            isOpen={deleteModal}
            type='hapusModal'
            closeModal={closeModal}
            title='Konfirmasi'
          >
            <p className='text-center text-lg font-semibold'>
              Apakah anda yakin ingin menghapus dompet ini?
            </p>
          </Modal>

          <Modal
            onSubmit={onSubmit}
            isOpen={isOpen}
            type='dompet'
            closeModal={closeModal}
            title='Buat Dompet'
          >
            <Input
              id='nama_dompet'
              label='Nama Dompet'
              placeholder='Masukkan nama'
              validation={{
                required: "Nama tidak boleh kosong",
              }}
            />

            <Input
              id='saldo'
              label='Saldo'
              placeholder='Masukkan saldo'
              type='number'
              validation={{
                required: "Saldo tidak boleh kosong",
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Saldo harus berupa angka",
                },
              }}
            />
          </Modal>

          <div className='w-11/12 mx-auto p-4 rounded-xl space-y-2 min-h-[18rem]'>
            <h1 className='text-2xl font-bold text-white'>Dompet Pribadi</h1>
            <div className='grid justify-center items-center grid-cols-5 gap-2'>
              {/* map the list dompet */}
              {dataUtama &&
                dataUtama?.map(
                  (item: any) =>
                    item.user_id === user?.id && (
                      <div
                        onClick={() => router.push(`/dompet/${item.id}`)}
                        key={item.id}
                        className='w-auto h-40 p-4 bg-gradient-to-b from-[#43B6E9] to-[#5F4A8B] rounded-xl border-2 border-gray-500 flex hover:cursor-pointer flex-col justify-center items-center'
                      >
                        <h1 className='text-white text-2xl font-bold'>
                          {item.nama_dompet}
                        </h1>
                        <h1 className='text-white text-2xl font-bold'>
                          {/* format balance to rupiah */}
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.saldo)}
                        </h1>

                        {/* delet dompet */}
                        <button
                          type='button'
                          onClick={(event) => {
                            event.stopPropagation();
                            setDeleteId(item.id);
                            openModal("delete");
                            // deleteDompet(item.id);
                          }}
                          className='mt-4 rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
                        >
                          Hapus
                        </button>
                      </div>
                    )
                )}
            </div>
          </div>
          <div className='w-11/12 mx-auto p-4 rounded-xl space-y-2 min-h-[18rem] bg-transparent'>
            <h1 className='text-2xl font-bold text-white'>Dompet Kolaborasi</h1>
            <div className='grid justify-center items-center grid-cols-5 gap-2'>
              {/* map the list dompet */}
              {dataUtama &&
                dataUtama?.map(
                  (item: any) =>
                    item.user_id !== user?.id && (
                      <div
                        onClick={() => router.push(`/dompet/${item.id}`)}
                        key={item.id}
                        className='w-auto h-40 p-4 bg-gradient-to-b from-[#E943BB] to-[#5F4A8B] rounded-xl border-2 border-gray-500 flex hover:cursor-pointer flex-col justify-center items-center'
                      >
                        <h1 className='text-2xl font-bold'>
                          {item.nama_dompet}
                        </h1>
                        <h1 className='text-2xl font-bold'>
                          {/* format balance to rupiah */}
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.saldo)}
                        </h1>

                        {/* delet dompet */}
                      </div>
                    )
                )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
