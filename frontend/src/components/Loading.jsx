import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[200px] gap-4">
      <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      <p className="text-gray-500">Loading...</p>
    </div>
  );
};

export default Loading;
