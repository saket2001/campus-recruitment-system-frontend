import React from "react";
import { Layout, DashboardLayout } from "../../../components/UI";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ApplicationSubmitted() {
  return <ApplicationSubmittedComponent/>  
}

const ApplicationSubmittedComponent = () => {
  const router = useRouter();
  const { email } = router.query;

  return (
    <Layout showNav={false}>
      <DashboardLayout
        authRole={["user"]}
        pageTitle="User application submitted"
      >
        <div className="flex justify-center items-center w-full h-screen bg-blue-100">
          <div className="flex flex-col gap-2 w-1/2 my-5 shadow rounded border border-neutral-200 px-4 py-5 bg-neutral-50">
            {/* image */}
            <Image
              src="/paper-plane.png"
              alt="paper plane image"
              width={100}
              height={100}
              className="object-contain"
            />
            <h1 className="text-lg lg:text-xl font-bold text-neutral-800 text-center">
              Your application has been submitted!
            </h1>
            <ul className="list-decimal list-inside mb-2">
              <li className="list-item text-base text-neutral-700">
                {email} will be getting all email updates for this application.
              </li>
              <li className="list-item text-base text-neutral-700">
                This employer typically responds to applications within 10 days
              </li>
            </ul>
            <hr />
            <h1 className="mt-2 text-lg lg:text-xl font-bold text-neutral-700">
              Keep track of your applications
            </h1>
            <p className="text-base text-neutral-500">
              You will receive a status update in an email from Indeed within a
              few weeks of submitting your application. In the meantime, you can
              view and track all your applications in the Indeed My jobs section
              at any time. View your applications on My jobs
            </p>
            {/* button */}
            <Link href={"/user/job"}>
              <button
                type="button"
                className="my-2 px-3 py-2 rounded shadow border border-neutral-200 hover:border-blue-700 text-blue-700 transition-all ease-in duration-150"
              >
                Return to Job Board
              </button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </Layout>
  );
}