import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

export const NoRolePage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Virtual Campus Recruitment</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1,shrink-to-fit=no"
        />
      </Head>
      <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center">
        <div className="lg:w-1/2 w-full flex-col gap-3 text-center p-3">
          <h1 className="lg:text-4xl text-xl font-bold">
            403 Permission Denied
          </h1>
          {/* <img src='/icons8-lock.png' alt='lock image' /> */}
          <Image
            src={"/icons8-access-denied-64.png"}
            alt={"lock image"}
            width={150}
            height={150}
          />
          <p className="text-base text-grey-600">
            It looks like you aren&apos;t allowed to view this page and trying
            to access protected page.
          </p>

          <a
            onClick={() => router.back()}
            className="text-blue-700 cursor-pointer hover:text-blue-800 transition-all ease-in"
          >
            Go Back
          </a>
        </div>
      </div>
    </>
  );
};
