import Head from "next/head";
import React from "react";
import { InputField } from "../components/UI/InputField/InputField";
import { Layout } from "../components/UI/Layout/Layout";
import { useFormik } from "formik";

export default function ForgetPassword() {
  return <ForgetPasswordForm/>
}


const ForgetPasswordForm = () => {
  const passwordForm = useFormik({
    initialValues: {
      user_email: "",
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <Layout bgColor={"bg-transparent"} showAuth={false}>
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
      <main className="min-h-screen w-full bg-blue-100 flex justify-center">
        {/* form */}
        <form
          onSubmit={passwordForm.handleSubmit}
          className="lg:my-10 h-fit lg:w-1/3 mx-4 flex flex-col px-4 py-6 rounded-md shadow bg-gray-100 gap-3"
        >
          <h1 className="font-medium text-neutral-900 lg:text-2xl text-lg text-center">
            Password Reset
          </h1>
          <p className="text-neutral-600 text-base text-justify">
            Forgotten your password? Enter your e-mail address below, and
            we&apos;ll send you an e-mail allowing you to reset it.
          </p>
          <InputField
            type="email"
            required={true}
            bgColor="bg-gray-200"
            name="user_email"
            id="user_email"
            onChange={passwordForm.handleChange}
            onBlur={passwordForm.handleBlur}
            label="Email"
          />
          <button
            type="submit"
            className="bg-blue-800 text-gray-50 py-2 px-4 hover:bg-blue-700 transition-all ease-in-out rounded-md shadow"
          >
            Send Email
          </button>
        </form>
      </main>
    </Layout>
  );
}