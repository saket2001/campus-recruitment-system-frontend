import React from "react";
import { Layout } from "../../../../components/UI/Layout/Layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AccountVerification() {
  const router = useRouter();
  const { id,token } = router.query;
  console.log(id,token);
  const [status, setStatus] = useState();

  useEffect(() => {
    const getStatus = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_DEV_SERVER}/user/account-verification/${id}/${token}`
          );

          console.log(response);
          if (response && response.data.isError) setStatus(false);
          else setStatus(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getStatus();
  }, [id]);

  return (
    <Layout showAuth={false}>
      <Head>
        <title>Virtual Campus Recruitment | User Email Verification</title>
      </Head>
      <div className="min-h-screen p-4 flex items-center justify-center bg-blue-100">
        <div className="lg:w-1/2 w-full h-full flex-col gap-2 shadow-md rounded-md bg-gradient-to-tr lg:px-5 px-3 py-8 text-center bg-gray-50">
          {/* logo */}
          <h1 className="font-bold lg:text-3xl text-xl text-gray-800 mt-2 mb-5">
            Virtual Campus Recruitment
          </h1>
          <h3 className="font-bold lg:text-xl text-lg text-gray-800 my-5">
            Thank you for registering with us
          </h3>
          <Image src="/icons8-mail-100.png" width="100%" height="100%" />
          {status && (
            <p className="text-base text-gray-700 my-3 text-center">
              Your account with entered email is successfully verified from us.
              Now you can avail various features of Virtual Campus Recruitment
              System.
            </p>
          )}
          {!status && (
            <p className="text-base text-gray-700 my-3 text-center">
              Your account with entered email is not verified from us.
              Please try again later or contact us.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
