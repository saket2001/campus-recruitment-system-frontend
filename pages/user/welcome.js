import React from "react";
import Image from "next/image";
import WelcomeLogo from "../../public/welcome-screen.svg";
import Link from "next/link";
import Head from "next/head"

export default function Welcome() {
  return (
    <>
      <Head>
        <title>Virtual Campus Recruitment | User Welcome</title>
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
      <WelcomeScreen />
    </>
  );
}

const WelcomeScreen = () => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full h-screen place-items-center justify-center bg-neutral-200 lg:overflow-hidden">
      {/* left side with image */}
      <div className="h-full w-full flex flex-col items-start bg-neutral-100 py-5 px-3">
        <img
          src={"../main-logo.svg"}
          className="mr-3 lg:h-8 h-6"
          alt="Campus Recruiter Logo"
        />
        <div className="flex w-full justify-center">
          <Image
            src={WelcomeLogo}
            alt="welcome image"
            width={500}
            height={500}
          />
        </div>
        <div className="flex w-full justify-end mb-4 mr-4">
          <blockquote className="text-end text-neutral-800" style={{fontStyle:"italic",fontWeight:"400"}}>
            <span>"</span>
            Success isn't Always about Greatness. <br /> It's about Consistency
            <span>"</span>
          </blockquote>
        </div>
      </div>
      {/* right side with info */}
      <div className="h-full w-full flex flex-col items-center justify-center gap-1 px-4 py-3">
        <h1 className="text-neutral-800 text-xl lg:text-3xl font-bold">
          Welcome User
        </h1>
        <p className="text-neutral-600 text-base text-justify my-1 lg:w-1/2 w-3/4">
          Its great to see you here on{" "}
          <span className="text-blue-700 font-medium">
            Virtual recruitment system
          </span>
          . Next step after signing up is to fill your profile details with
          relevant and accurate information which will help you in your recruitment
          process.
        </p>
        {/* buttons */}
        <div className="flex lg:flex-row flex-col gap-3 my-2">
          <Link href={"/user/profile/edit"}>
            <button className="px-3 py-2 bg-blue-700 text-neutral-100 text-base rounded hover:bg-blue-800 ease-in transition-all">
              Complete Profile
            </button>
          </Link>
          <Link href={"/user/dashboard"}>
            <button className="px-3 py-2 border-neutral-700 text-neutral-700 text-base rounded ease-in transition-all hover:bg-neutral-300">
              Explore
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
