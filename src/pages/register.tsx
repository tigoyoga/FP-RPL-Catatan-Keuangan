import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import useAuthStore from "@/store/useAuthStore";
import PasswordInput from "@/components/forms/PasswordInput";
import { useRouter } from "next/router";

import Input from "@/components/forms/Input";
import Button from "@/components/Button";

import { useMutation } from "@tanstack/react-query";
import { api, apiWithToken } from "@/lib/api";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import Head from "next/head";
import Loading from "@/components/Loading";

function Register() {
  const methods = useForm();
  const router = useRouter();

  const isAuthenticated = useAuthStore.useIsAuthenticated();
  const login = useAuthStore.useLogin();
  const logout = useAuthStore.useLogout();
  const stopLoading = useAuthStore.useStopLoading();

  const { handleSubmit } = methods;

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

  const { mutate, isLoading } = useMutation(
    async (data: any) => {
      const response = await api.post("/user", data);

      if (response.status === 200) {
        router.replace("/login");
      }

      return response;
    },
    {
      onError: (error) => {
        toast.error("Register gagal");
      },
      onSuccess: (data) => {
        toast.success("Register berhasil");
      },
    }
  );

  if (isAuthenticated) {
    if (router.isReady) router.push("/");
  }

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <>
      <Head>
        <title>Register</title>

        <meta name="description" content="Register page" />

        <link rel="icon" href="/favicon.ico" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main
        className="bg-cover h-screen w-screen overflow-hidden"
        style={{ backgroundImage: "url('/images/BG2.png')" }}
      >
        <Toaster />
        <div className="grid grid-cols-12 h-screen">
          <div className="col-span-5 md:col-span-7">
            <div className="flex flex-col justify-start h-full md:mt-4">
              <div className="flex flex-row justify-start items-start">
                <h1 className="text-2xl md:text-5xl font-medium font-serif text-[#5FB6F4] mt-10 md:mt-20 ml-12 md:ml-20">
                  Money Tracker
                </h1>
                <Link
                  href="/index"
                  className="text-[#FFFFFF80] text-xl md:text-4xl font-bold mt-10 md:mt-20 ml-12 md:ml-20"
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  className="text-[#FFFFFF80] text-xl md:text-4xl font-bold mt-10 md:mt-20 ml-12 md:ml-20"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 flex justify-center items-center">
            <div className="w-full bg-[#4b4e665b] rounded-3xl p-6 py-20 m-10 shadow-lg shadow-blue-500/30 backdrop-blur">
              <h1 className="text-5xl font-bold text-center text-white mb-11">
                Register
              </h1>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    id="name"
                    label="Username"
                    placeholder="Masukkan username"
                    validation={{
                      required: "Username tidak boleh kosong",
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
                  <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="Masukkan password"
                    validation={{
                      required: "Password tidak boleh kosong",
                      minLength: {
                        value: 6,
                        message: "Password minimal 6 karakter",
                      },
                    }}
                  />

                  <div className="w-fit mx-auto mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      className="text-white border-white"
                    >
                      Register
                    </Button>
                  </div>
                </form>
              </FormProvider>
              <div>
                <p className="text-center mt-4 text-white">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-[#4757cc] font-bold">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Register;
