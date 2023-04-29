import React from "react";
import Head from "next/head";

export const Loader = ({ text = "Loading your data from server" }) => {
  return (
    <>
      <Head>
        <title>Loading Campus Recruitment Assistance </title>
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="content-language" content="en" />
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center p-5">
        <div className="flex flex-col items-center justify-center">
          <img
            src="/spinner.svg"
            alt="loader-image"
            style={{ margin: 0, height: "8rem" }}
          />
          <h1 className="lg:text-xl text-lg font-medium text-center text-gray-800">
            {text}
          </h1>
        </div>
      </div>
    </>
  );
};
