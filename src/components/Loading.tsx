import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <main>
      <div className='w-screen h-screen flex flex-col gap-2 items-center justify-center'>
        <FaSpinner className='animate-spin text-5xl' />
        <h1>Loading...</h1>
      </div>
    </main>
  );
};

export default Loading;
