import React, { useCallback, useEffect, useState } from "react";
import { InputField } from "../../../components/UI/InputField/InputField";
import { Layout } from "../../../components/UI/Layout/Layout";
import Link from "next/link";
import Head from "next/head";
import { useFormik } from "formik";
import Image from "next/image";
import googleIcon from "../../../assets/icons/icons8-google.svg";
import { useRouter } from "next/router";
import validatorFunc from "../../../helpers/validatorFunc";
import { useSession, signIn } from "next-auth/react";
import { Loader } from "../../../components/UI/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  return <RegisterForm />;
}

const RegisterForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const [btnClicked, setBtnClicked] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      user_email: "",
      user_password: "",
      user_contact: "",
      user_name: "",
      college_name: "",
      college_branch: "",
      date_of_birth: "",
      gender: "",
    },
    validate: (values) => {
      let errors = validatorFunc(values);
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DEV_SERVER}/api/v1/user/register`,
          {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log(data)
        setIsLoading(false);

        notify(res.data?.message);

        if (!data?.isError) {
          notify("User account created successfully!")
          // session management
          window?.sessionStorage.setItem("auth-token", data?.token);
          window?.sessionStorage.setItem("refresh-token", data?.refreshToken);
          // TODO remove this code from session
          window?.sessionStorage.setItem("code", data?.code);
          window?.sessionStorage.setItem("full_name", data?.full_name);

          // setting store
          dispatch(authActions.updateCode(data.code));
          dispatch(authActions.updateName(data.full_name));
          dispatch(authActions.updateUserID(res.data.user_id));
          router.replace("/user/welcome");
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        notify("Failed to register your account! Please try again later");
        // return window?.location?.assign("/errorpage");
      }
    },
  });

  const notify = useCallback((msg) => toast(msg));

  // continue auth with our server db
  useEffect(() => {
    if (btnClicked && session && status === "authenticated") {
      // user details got from google
      const values = {
        user_email: session.user.email,
        user_name: session.user.name,
      };

      // server db call
      setIsLoading(true);
      fetch(process.env.NEXT_PUBLIC_DEV_SERVER + "/user/sign-up-google", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setIsLoading(false);

          if (res?.isError) {
            notify(res?.message);
          }
          if (res && !res?.isError) {
            notify(res?.message);
            // session management
            window?.sessionStorage.setItem("auth-token", res?.token);
            window?.sessionStorage.setItem("code", res?.code);
            window?.sessionStorage.setItem("full_name", res?.full_name);
            // setting store
            dispatch(authActions.updateCode(res.code));
            dispatch(authActions.updateName(res.full_name));
            // routing to different page
            router.replace("/user/welcome");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [status, btnClicked]);

  // no entry to signed in user
  if (isLoggedIn) router.replace("/user/dashboard");
  if (isLoading) return <Loader />;

  return (
    <Layout bgColor={"bg-blue-100"} showAuth={false}>
      <Head>
        <title>Virtual Campus Recruitment | User Registration</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full flex justify-center items-center py-10">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full mx-3 lg:w-1/2 grid grid-cols-1 place-content-center shadow-md rounded-md p-5 py-7 bg-gray-50"
        >
          <h1 className="font-bold text-lg lg:text-2xl mb-2 text-center">
            User Registration
          </h1>
          <p className="text-base text-gray-500 mb-4 text-center">
            Please fill correct details in the inputs below.
          </p>
          {/* google auth */}
          <div className="flex justify-center items-center w-full">
            <button
              onClick={() => {
                signIn(
                  "email",
                  {
                    redirect: false,
                    callbackUrl: "http://localhost:3000/auth/user/register",
                  },
                  { prompt: "login" }
                );
                setBtnClicked(true);
              }}
              type="button"
              className="flex items-center justify-center border border-blue-700 text-gray-700 font-semibold rounded-md w-full lg:text-lg text-base"
            >
              <span className="px-3 flex justify-center items-center">
                <Image
                  src={googleIcon}
                  width={"28px"}
                  height={"28px"}
                  alt="google icon"
                />
              </span>
              <span className="bg-blue-700 text-gray-100  px-4 py-2 w-full">
                Sign Up with Google
              </span>
            </button>
          </div>
          {/* divider */}
          <div className="border-b border-gray-500 py-2 mb-2"></div>
          <div className="flex lg:flex-row flex-col gap-2 items-start">
            <InputField
              type="text"
              label="Full Name"
              required={true}
              id="full name"
              name="user_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.user_name}
              didTouched={formik.touched.user_name}
            />
            <InputField
              type="email"
              label="Email"
              required={true}
              id="email"
              placeholder="name@gmail.com"
              name="user_email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.user_email}
              didTouched={formik.touched.user_email}
            />
          </div>
          <div className="flex lg:flex-row flex-col gap-2 items-start">
            <InputField
              type="password"
              label="Password"
              required={true}
              id="password"
              name="user_password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.user_password}
              didTouched={formik.touched.user_password}
            />
            <InputField
              type="number"
              label="Contact No"
              required={true}
              id="contact"
              name="user_contact"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.user_contact}
              didTouched={formik.touched.user_contact}
            />
          </div>
          <div className="flex lg:flex-row flex-col gap-2 items-start">
            <InputField
              type="text"
              label="College Name"
              required={true}
              name="college_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.college_name}
              didTouched={formik.touched.college_name}
            />
            <InputField
              type="text"
              label="College Branch"
              required={true}
              name="college_branch"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.college_branch}
              didTouched={formik.touched.college_branch}
            />
          </div>
          <div className="flex lg:flex-row flex-col gap-2 items-start">
            <InputField
              type="date"
              label="Date of Birth"
              required={true}
              name="date_of_birth"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.date_of_birth}
              didTouched={formik.touched.date_of_birth}
            />
            <InputField
              type="text"
              label="Gender"
              required={true}
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.date_of_birth}
              didTouched={formik.touched.date_of_birth}
            />
          </div>

          <div className="flex justify-center items-center w-full my-5">
            <button
              type="submit"
              className="bg-blue-700 text-gray-100 lg:text-lg w-full px-4 py-2 rounded-md border-0 hover:bg-violet-700 transition-all"
            >
              Get Started
            </button>
          </div>
          <span className="w-full justify-center items-center flex gap-1 text-gray-600">
            Already have an account?
            <Link href="/auth/user/sign-in">
              <a className="text-blue-800 font-medium lg:text-base text-sm hover:text-underline">
                Sign In
              </a>
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
    </Layout>
  );
};