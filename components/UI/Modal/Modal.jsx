import React from "react";
import Head from "next/head"

export const Modal = ({
  heading,
  content,
  onClick,
  width = "lg:w-1/2",
}) => {
  return (
    <>
      <Head>
        <title>Campus Recruitment Assistance | Modal </title>
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="content-language" content="en" />
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <div>
        <Overlay />
        <div className="absolute top-0 lg:left-52 lg:right-52 h-screen flex items-center justify-center z-10">
          {/* modal */}
          <div
            className={`bg-white ${width} w-4/5 h-fit rounded-md shadow-md flex flex-col items-start gap-2 z-20 pt-3 mx-2`}
          >
            {/* heading */}
            <div className="flex justify-between items-center border-b-2 border-gray-600 py-2 w-full">
              <h1 className="w-full text-lg lg:text-xl font-semibold px-5 text-left">
                {heading}
              </h1>
              <button className="px-3" onClick={onClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            {/* body */}
            <div className="w-full">{content}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const Overlay = () => {
  return (
    <div
      className="sticky top-0 left-0 min-h-screen overflow-hidden z-10"
      style={{ backgroundColor: "#868585f1" }}
    ></div>
  );
};
