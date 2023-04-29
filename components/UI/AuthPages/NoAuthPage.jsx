import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const NoAuthPage = () => {
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
              401 Account Log In Required
            </h1>
            {/* <img src='/icons8-lock.png' alt='lock image' /> */}
            <Image src={"/icons8-lock.png"} width={200} height={200} />
            <p className="text-base text-grey-600">
              It looks like you haven&apos;t logged in to your account and
              trying to access protected page. Please log in to your account!
            </p>
            <Link href={"/"}>
              <a className="text-blue-700">Go to Home</a>
            </Link>
          </div>
        </div>
      </>
    );
}
