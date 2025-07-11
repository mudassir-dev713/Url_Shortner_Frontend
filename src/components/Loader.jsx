import React from 'react';

const Loader = () => {
  return (
    <>
      <div className="flex justify-center items-center py-8 w-full h-screen">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    </>
  );
};

export default Loader;
