// page detail dompet

import React from "react";
import { useRouter } from "next/router";
import { api, apiWithToken } from "@/lib/api";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import Input from "@/components/forms/Input";
import Head from "next/head";
import { toast } from "react-hot-toast";
import SelectInput from "@/components/forms/SelectInput";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { BiTransfer } from "react-icons/bi";
import { HiUserAdd } from "react-icons/hi";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const DetailDompet = () => {
  const router = useRouter();
  const { id } = router.query;

  const isAuthenticated = useAuthStore.useIsAuthenticated();
  const login = useAuthStore.useLogin();
  const logout = useAuthStore.useLogout();
  let [isOpenKolab, setIsOpenKolab] = React.useState(false);
  let [isOpenPemasukan, setIsOpenPemasukan] = React.useState(false);
  let [isOpenPengeluaran, setIsOpenPengeluaran] = React.useState(false);
  let [isOpenTransfer, setIsOpenTransfer] = React.useState(false);
  const user = useAuthStore.useUser();

  function closeModal(type: string) {
    if (type === "kolab") {
      setIsOpenKolab(false);
    } else if (type === "pemasukan") {
      setIsOpenPemasukan(false);
    } else if (type === "pengeluaran") {
      setIsOpenPengeluaran(false);
    } else if (type === "transfer") {
      setIsOpenTransfer(false);
    }
  }

  function openModal(type: string) {
    if (type === "kolab") {
      setIsOpenKolab(true);
    } else if (type === "pemasukan") {
      setIsOpenPemasukan(true);
    } else if (type === "pengeluaran") {
      setIsOpenPengeluaran(true);
    } else if (type === "transfer") {
      setIsOpenTransfer(true);
    }
  }

  const stopLoading = useAuthStore.useStopLoading();

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

  const { data: dataDompet, isLoading } = useQuery(
    ["dompet", id],
    async () => {
      const response = await apiWithToken().get(`/secured/dompet/${id}`);

      return response.data.data;
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        console.log(data);
      },
    }
  );

  const { data: dataKategoriPengeluaran } = useQuery(
    ["kategori-pengeluaran"],
    async () => {
      const response = await api.get(`/kategori/pengeluaran`);

      return response.data.data;
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        console.log(data);
      },
    }
  );
  const { data: dataKategoriPemasukan } = useQuery(
    ["kategori-pemasukan"],
    async () => {
      const response = await api.get(`/kategori/pemasukan`);

      return response.data.data;
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        console.log(data);
      },
    }
  );

  const { mutate: addKolab } = useMutation(
    async (data: any) => {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await toast.promise(
          apiWithToken().put(`/secured/collab/${id}`, data),
          {
            loading: "Loading",
            success: (data) => {
              return "Berhasil menambahkan kolaborator";
            },
            error: (error) => {
              return error.response.data.message;
            },
          }
        );

        return response.data.data;
      }
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        router.reload();
      },
    }
  );

  const { mutate: addPemasukan } = useMutation(
    async (data: any) => {
      data.pemasukan = Number(data.pemasukan);
      data.dompet_id = Number(id);

      const response = await toast.promise(
        apiWithToken().post(`/secured/pemasukan`, data),
        {
          loading: "Loading",
          success: (data) => {
            return "Berhasil menambahkan pemasukan";
          },
          error: (error) => {
            return "Error";
          },
        }
      );

      return response.data.data;
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        router.reload();
      },
    }
  );

  const { mutate: addPengeluaran } = useMutation(
    async (data: any) => {
      data.pengeluaran = Number(data.pengeluaran);
      data.dompet_id = Number(id);

      const response = await toast.promise(
        apiWithToken().post(`/secured/pengeluaran`, data),
        {
          loading: "Loading",
          success: (data) => {
            return "Berhasil menambahkan pengeluaran";
          },
          error: (error) => {
            return "Error";
          },
        }
      );

      return response.data.data;
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        router.reload();
      },
    }
  );

  const { mutate: addTransfer } = useMutation(
    async (data: any) => {
      data.nominal = Number(data.nominal);

      const response = await toast.promise(
        apiWithToken().post(`/secured/transfer/${id}`, data),
        {
          loading: "Loading",
          success: (data) => {
            return "Berhasil menambahkan transfer";
          },
          error: (error) => {
            return error.response.data.message;
          },
        }
      );

      return response.data.data;
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      onSuccess: (data: any) => {
        router.reload();
      },
    }
  );

  const onSubmit = (data: any) => {
    if (data.pemasukan) {
      if (data.pemasukan == 0) {
        toast.error("Pemasukan tidak boleh 0");
        return;
      }
      addPemasukan(data);
    } else if (data.pengeluaran) {
      if (data.pengeluaran > dataDompet.saldo) {
        toast.error("Saldo tidak cukup ");
        return;
      } else if (data.pengeluaran == 0) {
        toast.error("Pengeluaran tidak boleh 0");
        return;
      }
      addPengeluaran(data);
    } else if (data.user_email) {
      addKolab(data);
    } else if (data.nominal) {
      addTransfer(data);
    }
  };

  return (
    <>
      <Head>
        <title>Dompet {dataDompet?.nama_dompet} | Catatan Keuangan</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex overflow-hidden'>
        <Modal
          onSubmit={onSubmit}
          isOpen={isOpenKolab}
          type='kolab'
          closeModal={closeModal}
          title='Tambah Kolaborator'
        >
          <Input
            id='user_email'
            label='Email'
            placeholder='Masukkan Email'
            validation={{
              required: "Email tidak boleh kosong",
            }}
          />
        </Modal>

        <Modal
          onSubmit={onSubmit}
          isOpen={isOpenPemasukan}
          type='pemasukan'
          closeModal={closeModal}
          title='Tambah Pemasukan'
        >
          <Input
            id='deskripsi'
            label='Deskripsi'
            placeholder='Masukkan Deskripsi'
            validation={{
              required: "Deskripsi tidak boleh kosong",
            }}
          />
          <Input
            id='pemasukan'
            label='Pemasukan'
            placeholder='Masukkan Jumlah Pemasukan'
            validation={{
              required: "Jumlah Pemasukan tidak boleh kosong",
            }}
          />
          <SelectInput
            id='kategori'
            label='Kategori'
            placeholder='Pilih Kategori'
            validation={{
              required: "Kategori tidak boleh kosong",
            }}
          >
            <option value=''>Pilih Kategori</option>
            {dataKategoriPemasukan?.map(
              (item: { nama_kategori: string }, index: number) => (
                <option key={index} value={item.nama_kategori}>
                  {item.nama_kategori}
                </option>
              )
            )}
          </SelectInput>
        </Modal>
        <Modal
          onSubmit={onSubmit}
          isOpen={isOpenPengeluaran}
          type='pengeluaran'
          closeModal={closeModal}
          title='Tambah Pengeluaran'
        >
          <Input
            id='deskripsi'
            label='Deskripsi'
            placeholder='Masukkan Deskripsi'
            validation={{
              required: "Deskripsi tidak boleh kosong",
            }}
          />
          <Input
            id='pengeluaran'
            label='Pengeluaran'
            placeholder='Masukkan Jumlah Pengeluaran'
            validation={{
              required: "Jumlah Pengeluaran tidak boleh kosong",
            }}
          />
          <SelectInput
            id='kategori'
            label='Kategori'
            placeholder='Pilih Kategori'
            validation={{
              required: "Kategori tidak boleh kosong",
            }}
          >
            <option value=''>Pilih Kategori</option>

            {dataKategoriPengeluaran?.map(
              (item: { nama_kategori: string }, index: number) => (
                <option key={index} value={item.nama_kategori}>
                  {item.nama_kategori}
                </option>
              )
            )}
          </SelectInput>
        </Modal>
        <Modal
          onSubmit={onSubmit}
          isOpen={isOpenTransfer}
          type='transfer'
          closeModal={closeModal}
          title='Tambah Pengeluaran'
        >
          <SelectInput
            id='nama_dompet'
            label='Nama Dompet'
            placeholder='Pilih Dompet'
            validation={{
              required: "Nama Dompet tidak boleh kosong",
            }}
          >
            <option value=''>Pilih Dompet</option>
            {dataDompet &&
              user?.data.map((item: any, index: number) =>
                item.user_id === user?.id && dataDompet.id !== item.id ? (
                  <option key={index} value={item.nama_dompet}>
                    {item.nama_dompet}
                  </option>
                ) : null
              )}
          </SelectInput>
          <Input
            id='nominal'
            label='Nominal'
            placeholder='Masukkan Jumlah Transfer'
            validation={{
              required: "Jumlah Transfer tidak boleh kosong",
            }}
          />
          <Input
            id='deskripsi'
            label='Deskripsi'
            placeholder='Masukkan Deskripsi'
            validation={{
              required: "Deskripsi tidak boleh kosong",
            }}
          />
          <Input
            id='kategori'
            label='Kategori'
            placeholder='Masukkan Kategori'
            validation={{
              required: "Kategori tidak boleh kosong",
            }}
          />
        </Modal>
        {/* create sidebar with aside */}
        <aside className='w-[18%] h-screen bg-gray-800'>
          <div className='flex flex-col items-center justify-center h-32'>
            <h1 className='text-white text-2xl font-bold'>Catatan Keuangan</h1>
            <p className='text-xl text-white mt-4'>Hello, {user?.name}</p>
          </div>
          <div className='flex flex-col items-center justify-center gap-4 h-full'>
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

            {/* back button */}
            <button
              type='button'
              onClick={() => {
                router.back();
              }}
              className='rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
            >
              Back
            </button>
          </div>
        </aside>

        <section className='w-[82%] flex flex-col gap-12 h-screen overflow-auto pb-8 pt-12'>
          <div className='w-11/12 mx-auto h-12 flex items-center justify-between'>
            <div className='flex gap-3'>
              <div
                onClick={() => openModal("pemasukan")}
                className='h-12 w-12 border rounded-full flex items-center justify-center cursor-pointer'
              >
                <GiPayMoney className='text-2xl' />
              </div>

              <div
                onClick={() => openModal("pengeluaran")}
                className='h-12 w-12 border rounded-full flex items-center justify-center cursor-pointer'
              >
                <GiReceiveMoney className='text-2xl' />
              </div>
              <div
                onClick={() => openModal("transfer")}
                className='h-12 w-12 border rounded-full flex items-center justify-center cursor-pointer'
              >
                <BiTransfer className='text-2xl' />
              </div>
            </div>
            <h1 className=''>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(dataDompet?.saldo)}
            </h1>
            <div className='flex gap-3'>
              <div
                onClick={() => openModal("kolab")}
                className={`${
                  user?.id === dataDompet?.user_id ? "block" : "hidden"
                } h-12 w-12 border rounded-full flex items-center justify-center cursor-pointer`}
              >
                <HiUserAdd className='text-2xl' />
              </div>
            </div>
          </div>

          <table
            className='w-11/12 mx-auto border text-left border-collapse'
            style={{ borderSpacing: 0 }}
          >
            <thead>
              <tr>
                <th className='py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light'>
                  Deskripsi
                </th>
                <th className='py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light'>
                  Jumlah
                </th>
                <th className='py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light'>
                  Kategori
                </th>
                <th className='py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light'>
                  Jenis
                </th>
                <th className='py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light'>
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody>
              {dataDompet?.list_catatan_keuangan?.map((item: any) => (
                <tr
                  key={item.id}
                  className={`${
                    item.id % 2 === 0 ? "bg-gray-100" : ""
                  } hover:bg-gray-200`}
                >
                  <td className='py-4 px-6 border-b border-grey-light'>
                    {item.deskripsi}
                  </td>
                  <td className='py-4 px-6 border-b border-grey-light'>
                    {/* check if item is pengeluaran or pemasukan and then format to currency */}
                    {item.jenis === "Pengeluaran"
                      ? `Rp. ${new Intl.NumberFormat("id-ID").format(
                          item.pengeluaran
                        )}`
                      : `Rp. ${new Intl.NumberFormat("id-ID").format(
                          item.pemasukan
                        )}`}
                  </td>
                  <td className='py-4 px-6 border-b border-grey-light'>
                    {item.kategori}
                  </td>
                  <td className='py-4 px-6 border-b border-grey-light'>
                    {item.jenis}
                  </td>
                  <td className='py-4 px-6 border-b border-grey-light'>
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};

export default DetailDompet;
