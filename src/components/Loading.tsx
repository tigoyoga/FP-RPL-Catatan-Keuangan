import React from "react";

const Loading = () => {
  return (
    <main>
      <div className='w-screen h-screen flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-t-4 border-gray-900 rounded-full animate-spin'></div>
        <h1>Loading...</h1>
      </div>
    </main>
  );
};

export default Loading;
