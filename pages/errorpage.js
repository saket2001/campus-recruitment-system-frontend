import Link from "next/link";
import React from "react";
import Head from "next/head"

export default function errorpage() {
  return <ErrorPage />;
}

const ErrorPage = () => {
  return (
    <>
      <Head>
        <title>Virtual Campus Recruitment | Error Page</title>
        <meta
          name="description"
          content="Virtual Campus Recruitment is special website created for the needs of any campus students looking for securing jobs during their placements."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="content-language" content="en" />
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <div className="h-screen w-full flex flex-col justify-center items-center bg-blue-100">
        <img src="./error-cloud.png" alt="Error image" loading="lazy" />
        <h1 className="lg:text-3xl text-xl font-bold text-neutral-800">
          Error Occurred
        </h1>

        <p className="text-neutral-600 text-center my-2 w-1/2">
          It looks like something went wrong on our server, sorry for the
          inconvenience. <br /> Please try again refreshing the page.
        </p>

        <div className="flex gap-3 items-center">
          <button
            className="my-2 px-4 py-1.5 bg-blue-800 text-white rounded-md"
            onClick={() => window?.history?.back()}
          >
            Go Back
          </button>
          <Link
            href={"/"}
            className="my-2 px-4 py-1.5 text-neutral-700 hover:underline cursor-pointer"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
};
