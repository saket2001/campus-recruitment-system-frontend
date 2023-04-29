import Head from "next/head";
import React from "react";
import { InputField } from "../components/UI/InputField/InputField";
import { Layout } from "../components/UI/Layout/Layout";
import { useFormik } from "formik";

export default function ResetPassword() {
  return <ResetPasswordForm/>
}


const ResetPasswordForm = () => {
  const passwordForm = useFormik({
    initialValues: {
      user_code: "",
      new_pass: "",
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <Layout>
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
          className="my-auto h-fit lg:w-1/3 mx-4 flex flex-col px-4 py-6 rounded shadow bg-gray-100 gap-2"
        >
          <h1 className="font-medium text-gray-900 lg:text-2xl text-lg">
            Password Reset
          </h1>
          <p className="text-gray-600 text-base text-justify">
            Enter the unique code sent to your email correctly and a new
            password. Upon submitting your password will be changed
          </p>
          <InputField
            type="text"
            required={true}
            bgColor="bg-gray-200"
            name="user_code"
            id="user_code"
            onChange={passwordForm.handleChange}
            onBlur={passwordForm.handleBlur}
            label="Code"
          />
          <InputField
            type="password"
            required={true}
            bgColor="bg-gray-200"
            name="new_pass"
            id="new_pass"
            onChange={passwordForm.handleChange}
            onBlur={passwordForm.handleBlur}
            label="New Password"
          />
          <button
            type="submit"
            className="bg-blue-800 text-gray-50 py-2 px-4 hover:bg-blue-700 transition-all ease-in-out rounded-md shadow"
          >
            Change Password
          </button>
        </form>
      </main>
    </Layout>
  );
}