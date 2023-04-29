import React from "react";
import Head from "next/head"
export default function RateLimitPage() {
  return <RateLimitComponent />;
}

const RateLimitComponent = () => {
  return (
    <>
       <Head>
        <title>Virtual Campus Recruitment | Reset Password</title>
        <meta httpEquiv="content-language" content="en" />
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div className="h-screen w-full flex flex-col justify-center items-center bg-blue-100">
      <img src="./error-cloud.png" alt="Error image" loading="lazy" />
      <h1 className="lg:text-3xl text-xl font-bold text-neutral-800">
        Request Timeout
      </h1>

      <p className="text-neutral-600 text-center my-2 w-1/2">
        It looks like you requested the same resources more times than required,
        sorry for the inconvenience. Please try again after 15 minutes.
      </p>

      <div className="flex gap-3 items-center">
        <button
          className="my-2 px-4 py-2 bg-blue-700 text-neutral-100 rounded transition-all ease-in hover:bg-blue-800"
          onClick={() => {
            window?.sessionStorage?.clear();
            window?.location?.replace("/")
          }}
        >
          Logout
        </button>
      </div>
    </div>
    </>
  );
};
