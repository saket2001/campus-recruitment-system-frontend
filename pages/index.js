import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Layout } from "../components/UI/Layout/Layout";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window?.sessionStorage?.clear();

    return ()=>{}
  },[])
  return (
    <Layout
      className={styles.container}
      navbarTransparent={true}
      showNav={false}
      showAuth={false}
      bgColor={"bg-blue-800"}
    >
      <Head>
        <title>Virtual Campus Recruitment</title>
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
      <main className="min-h-screen w-full homepage-bg flex flex-col gap-1 py-2 items-center justify-center">
        <section className="py-12 px-10 flex flex-col w-fit items-center bg-neutral-50 rounded-md">
          {/* heading */}
          <h1 className="font-extrabold lg:text-3xl text-neutral-800 text-xl py-1 text-center">
            Welcome To <span className="text-blue-800">Virtual</span> Campus
            Recruitment
          </h1>
          <p className="lg:text-lg text-neutral-600 text-base py-1">
            {" "}
            Select Your Type Of Identity
          </p>
          {/* type of user */}
          <div className="w-full flex lg:flex-row flex-col justify-center gap-3 py-3 items-center m-3">
            {/* card */}
            <Link href={"/auth/user/sign-in"}>
              <div className="lg:w-1/3 w-4/5 h-40 flex flex-col gap-3 justify-center items-center px-3 py-4 rounded border border-transparent hover:border-blue-600 hover:shadow transition-all ease-in duration-300 cursor-pointer">
                <Image
                  src={"/student.png"}
                  alt="Student Image"
                  width={70}
                  height={70}
                  className="object-contain"
                />
                <h2 className="font-medium text-lg lg:text-xl text-neutral-700">
                  Student
                </h2>
              </div>
            </Link>
            <Link href={"/auth/admin/sign-in"}>
              {/* card */}
              <div className="lg:w-1/3 w-4/5 h-40 flex flex-col gap-3 px-3 py-4 justify-center items-center rounded border border-transparent hover:shadow hover:border-blue-600 transition-all ease-in duration-300 cursor-pointer">
                <Image
                  src={"/system-administrator.png"}
                  alt="Student Image"
                  width={70}
                  height={70}
                  className="object-contain"
                />
                <h2 className="font-medium text-lg lg:text-xl text-neutral-700">
                  Admin
                </h2>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

{
  /* <main className="min-h-screen w-full bg-white flex flex-col gap-5 py-2">
        <br />
        <br />
        <header className="w-full flex gap-2 lg:p-10 lg:mb-7 p-3 items-center justify-center">
          <div className="flex-col items-center justify-center">
            <h1 className="lg:text-5xl text-3xl text-center text-gray-800 font-extrabold py-2">
              A <span className="text-blue-800">Centralized Application</span>{" "}
              <br />
              For Campus Placements
            </h1>
            <div className="flex gap-3 items-center justify-center py-2 lg:pt-4 ">
              <p className="lg:text-xl text-base text-center text-gray-500 font-light">
                Smart and better experience for students <br /> and less stress
                for recruiters
              </p>
            </div>
            <div className="flex lg:flex-row flex-col gap-3 items-center justify-center py-4">
              <button className="border-2 border-blue-800 lg:px-10 px-4 lg:py-3 py-1.5 rounded-md text-blue-800 font-medium hover:text-gray-100 hover:bg-blue-800 transition-all ease-in">
                <Link href="/auth/user/register">
                  <a>For Students</a>
                </Link>
              </button>
              <button className="border-2 border-blue-800 lg:px-10 px-4 lg:py-3 py-1.5 rounded-md text-blue-800 font-medium hover:text-gray-100 hover:bg-blue-800 transition-all ease-in">
                <Link href="/auth/company/register">
                  <a>For Organizations</a>
                </Link>
              </button>
            </div>
          </div>
        </header>
        <br />
        <br />
        <section className="bg-blue-200 w-full flex flex-col gap-3 p-2 my-2">
          <section className="p-3">
            <h2 className="lg:text-3xl text-2xl p-3 text-gray-800 font-medium lg:text-start text-center">
              Our Benefits
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 place-content-start gap-3 my-4">
              <div className="flex flex-col items-center p-4 hover:shadow-md rounded-md">
                <Image src={"/experience.svg"} width={"72px"} height={"72px"} />
                <h1 className="lg:text-lg text-base text-gray-700 font-medium py-2">
                  Better Recruitment Experience
                </h1>
                <p className="text-base text-justify text-gray-600 px-2">
                  Easy recruitment experience for all candidates and recruiters.
                  No hard work required now to conduct recruitment
                </p>
              </div>
              <div className="flex flex-col p-4 items-center hover:shadow-md rounded-md">
                <Image
                  src={"/secure-profile.svg"}
                  width={"72px"}
                  height={"72px"}
                />
                <h1 className="lg:text-lg text-base text-gray-700 font-medium py-2">
                  Fast and Secure Access
                </h1>
                <p className="text-base text-justify text-gray-600 px-2">
                  Your personal data is safe and secure with us. Even the recruitment process is safe from unwanted peepers
                </p>
              </div>
              <div className="flex flex-col p-4 items-center hover:shadow-md rounded-md">
                <Image
                  src={"/machine-learning.svg"}
                  width={"72px"}
                  height={"72px"}
                />
                <h1 className="lg:text-lg text-base text-gray-700 font-medium py-2">
                  AI Enabled System
                </h1>
                <p className="text-base text-justify text-gray-600 px-2">
                  Our AI will help recruiters get smart recommendation about candidates for their hiring. Candidates will also get job recommendation according to their skill sets
                </p>
              </div>
            </div>
          </section>
        </section>
      </main> */
}
