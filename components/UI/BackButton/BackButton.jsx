import React from "react";
import { useRouter } from "next/router";

export const BackButton = ({ onClickHandler = null }) => {
  const router = useRouter();
  if (onClickHandler === null)
    onClickHandler = () => router.back();
  
  return (
    <button
      onClick={onClickHandler}
      className="px-3 py-1 hover:bg-gray-300 rounded-md w-fit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
        />
      </svg>
    </button>
  );
};
