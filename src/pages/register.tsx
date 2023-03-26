import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import useAuthStore from "@/store/useAuthStore";
import PasswordInput from "@/components/forms/PasswordInput";
import { useRouter } from "next/router";

import Input from "@/components/forms/Input";
import Button from "@/components/Button";

import { useMutation } from "react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import Head from "next/head";
import { checkAuth } from "@/lib/checkAuth";

function Register() {
  const isAuthenticated = useAuthStore.useIsAuthenticated();

  const methods = useForm();
  const router = useRouter();

  const { handleSubmit } = methods;

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

  React.useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated) {
    router.replace("/");
  }

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <>
      <Head>
        <title>Register</title>

        <meta name='description' content='Register page' />

        <link rel='icon' href='/favicon.ico' />

        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <main>
        <Toaster />
        <div className='flex items-center justify-center h-screen'>
          <div className='w-96 bg-white rounded-lg p-6'>
            <h1 className='text-2xl font-medium text-center'>Register</h1>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  id='name'
                  label='Username'
                  placeholder='Masukkan username'
                  validation={{
                    required: "Username tidak boleh kosong",
                  }}
                />
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
                  <Button type='submit' variant='primary' isLoading={isLoading}>
                    Register
                  </Button>
                </div>
              </form>
            </FormProvider>
            <div>
              <p className='text-center mt-4'>
                Sudah punya akun?{" "}
                <Link href='/login' className='text-blue-500'>
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Register;
