import Head from "next/head";
import React from "react";
import { RiLoader4Line } from "react-icons/ri";

function Loading() {
  return (
    <main>
      <div className='w-screen h-screen flex flex-col gap-2 items-center justify-center'>
        <div>
          <RiLoader4Line className='animate-spin text-5xl' />
        </div>
        <p>Loading...</p>
      </div>
    </main>
  );
}

export default Loading;
