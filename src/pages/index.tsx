import Head from "next/head";

import React from "react";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";

import { Dialog, Transition } from "@headlessui/react";
import { apiWithToken } from "@/lib/api";
import Loading from "@/components/Loading";
import PasswordInput from "@/components/forms/PasswordInput";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/components/forms/Input";
import Button from "@/components/Button";
import { Route, Router, Routes } from "react-router-dom";
import DetailDompet from "./detail_dompet";

type dataProps = {
  id: number;
  name: string;
  email: string;
};

const datas: dataProps[] = [];
export default function Home() {
  const isAuthenticated = useAuthStore.useIsAuthenticated();
  const login = useAuthStore.useLogin();
  const logout = useAuthStore.useLogout();
  let [isOpen, setIsOpen] = React.useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const router = useRouter();

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (token) {
        apiWithToken(token)
          .get("/secured/me")
          .then((response) => {
            login({
              name: response.data.data.name,
              email: response.data.data.email,
              data: token,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    checkAuth();
  }, []);

  // if (!router.isReady) {
  //   return <Loading />;
  // }

  if (!isAuthenticated) {
    if (router.isReady) router.push("/login");
  }

  // array for store dummy data

  const onSubmit = (data: any) => {
    // insert data to array
    datas.push(data);
    // close modal
    closeModal();
    console.log(datas);
  };

  return (
    <>
      <Head>
        <title>Catatan Keuangan</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col items-center justify-center gap-12 h-screen">
          <h1 className="text-center">Dashboard</h1>
          <button
            type="button"
            onClick={openModal}
            className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            Open dialog
          </button>

          {/* add modal component with children */}
          <Modal
            onSubmit={onSubmit}
            isOpen={isOpen}
            closeModal={closeModal}
            title="Buat Dompet"
          >
            <Input
              id="name"
              label="Name"
              placeholder="Masukkan nama"
              validation={{
                required: "Nama tidak boleh kosong",
              }}
            />
            <Input
              id="email"
              label="Email"
              placeholder="Masukkan email"
              validation={{
                required: "Email tidak boleh kosong",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email tidak valid",
                },
              }}
            />
          </Modal>
          <Router location={"/secured/me"} navigator={undefined}>
            <Routes>
              <Route path="/dompet/:id" Component={DetailDompet} />
            </Routes>
          </Router>
          <button onClick={logout}>logout</button>
          <div className="w-full mx-24 flex gap-2 flex-wrap">
            {/* map the data and show with div */}
            {/* {datas.map((data, index) => (
              <div
                key={index}
                className='w-64 h-32 rounded-lg border border-gray-700'
              >
                <p>{data.name}</p>
                <p>{data.email}</p>
              </div>
            ))} */}
          </div>
        </div>
      </main>
    </>
  );
}
