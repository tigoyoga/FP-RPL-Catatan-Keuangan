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

function Login() {
  const isAuthenticated = useAuthStore.useIsAuthenticated();
  const login = useAuthStore.useLogin();
  const logout = useAuthStore.useLogout();
  const stopLoading = useAuthStore.useStopLoading();

  const methods = useForm();
  const router = useRouter();

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

  const { mutate, isLoading } = useMutation(async (data: any) => {
    const response = await api.post("/user/login", data);
    const token = response.data?.data;
    if (token) {
      localStorage.setItem("token", token);
      const user = await toast.promise(apiWithToken().get("/secured/me"), {
        loading: "Loading",
        success: "Success",
        error: "Error",
      });
      login({
        id: user.data.data.id,
        name: user.data.data.name,
        email: user.data.data.email,
        token: token,
        data: response.data.data.list_dompet,
      });
    }
  });

  if (isLoading || !router.isReady) return <Loading />;

  if (isAuthenticated) {
    router.push("/");
  }

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <>
      <Head>
        <title>Login</title>

        <meta name='description' content='Register page' />

        <link rel='icon' href='/favicon.ico' />

        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <main>
        <Toaster />
        <div className='grid grid-cols-12 h-screen'>
          <div className='col-span-7'></div>
          <div className='col-span-5 flex justify-center items-center'>
            <div className='w-96 bg-white rounded-lg p-6'>
              <h1 className='text-2xl font-medium text-center'>Login</h1>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    id='email'
                    label='Email'
                    placeholder='Masukkan email'
                    validation={{
                      required: "Email tidak boleh kosong",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email tidak valid",
                      },
                    }}
                  />
                  <PasswordInput
                    id='password'
                    label='Password'
                    placeholder='Masukkan password'
                    validation={{
                      required: "Password tidak boleh kosong",
                      minLength: {
                        value: 6,
                        message: "Password minimal 6 karakter",
                      },
                    }}
                  />

                  <div className='w-fit mx-auto mt-4'>
                    <Button
                      type='submit'
                      variant='primary'
                      isLoading={isLoading}
                    >
                      Login
                    </Button>
                  </div>
                </form>
              </FormProvider>
              <div>
                <p className='text-center mt-4'>
                  Belum punya akun?{" "}
                  <Link href='/register' className='text-blue-500'>
                    Register
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

export default Login;
