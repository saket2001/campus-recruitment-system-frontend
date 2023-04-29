import React, { useCallback } from "react";
import { useRouter } from "next/router";
import {
  Layout,
  DashboardLayout,
  Loader,
  BackButton,
} from "../../../components/UI";
import fetchData from "../../../helpers/fetchData";
import Image from "next/image";
import dateFormatter from "../../../helpers/dateFormatter";
import { useQuery } from "react-query";
import Link from "next/link";
import { RenderMarkdown } from "../../../components/UI/RenderMarkdown/RenderMarkdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JobDetailPage() {
  const router = useRouter();
  const { job_id } = router.query;
  const notify = useCallback((msg) => toast(msg));
  const { data: jobData, isLoading } = useQuery({
    enabled: job_id !== undefined,
    queryKey: ["job-data", job_id],
    queryFn: async () => {
      const res = await fetchData(`/get-job/${job_id}`);
      console.log(res);

      return res.data;
    },
  });

  const toggleStatusHandler = useCallback(async (id) => {
    if (id) {
      const res = await fetchData(`/admin/toggle-job/${id}`);
      notify(res.message);
      setTimeout(() => {
        window?.location?.reload();
      }, 2000);
    }
  });

  if (isLoading) return <Loader />;

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["admin"]} pageTitle={"Job Detail Page"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          {/* top bar */}
          <div className="w-full flex items-center">
            <BackButton />
            <div className="flex w-full justify-center">
              {/* heading */}
              <h2 className="flex flex-col font-semibold lg:text-2xl text-xl lg:px-8 text-neutral-800 justify-self-center">
                View Job
              </h2>
            </div>
          </div>

          {/* page info */}
          <div className="p-5 flex flex-col rounded-md shadow bg-neutral-100 w-full h-full my-3">
            {/* error displaying */}
            {!jobData && (
              <div className="flex items-center justify-center text-center p-1 my-2 text-base lg:text-lg text-neutral-700 gap-5">
                <Image
                  src={"/Illustration.svg"}
                  width={"100px"}
                  height={"100px"}
                />
                Oops! No Job Data Found <br /> Please try again
              </div>
            )}

            {jobData && (
              <div
                className="flex flex-col gap-1 px-4 py-3 rounded-md shadow-sm my-2 text-neutral-600"
                key={jobData?.job?._id}
              >
                {/* company */}
                <p className="text-lg text-neutral-700 font-medium capitalize">
                  {jobData?.job?.company_name}
                </p>
                {/* role */}
                <div className="flex justify-between">
                  <h2 className="text-lg lg:text-2xl font-semibold text-neutral-800 my-0 capitalize">
                    {jobData?.job?.role}
                  </h2>
                </div>
                {/* salary */}
                <p className="text-lg text-neutral-700">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumSignificantDigits: 3,
                  }).format(jobData?.job?.salary)}{" "}
                  LPA
                </p>

                <span className="border-b border-neutral-300 my-1 w-4/5"></span>

                {/* job details */}
                <h2 className="text-lg text-neutral-800 font-medium">
                  Job Details
                </h2>
                <div className="flex flex-col gap-4 my-2 py-1">
                  {/* mode */}
                  <p className="text-base text-neutral-700 flex gap-1 capitalize">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {jobData?.job?.mode}
                  </p>
                  {/* location */}
                  <p className="text-base text-neutral-700 flex gap-1 capitalize">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    {jobData?.job?.location}
                  </p>
                  {/* stage */}
                  <p className="text-base text-neutral-700 flex items-center gap-1 capitalize">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                    {jobData?.job?.current_stage} Ongoing
                  </p>
                  {/* total applicants */}
                  <p className="text-base text-neutral-700 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                    {(jobData?.job_details &&
                      jobData?.job_details?.data?.length > 0 &&
                      jobData?.job_details?.data?.length) ||
                      0}{" "}
                    Applicants
                  </p>
                  {/* total hiring  */}
                  <p className="flex items-center gap-1 text-lg text-neutral-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                    Hiring {jobData?.job?.total_hiring}
                  </p>
                  {/* date */}
                  <p className="font-medium text-base text-blue-700 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                    {jobData?.job?.created_at &&
                      dateFormatter(jobData?.job?.created_at)}
                  </p>
                </div>

                {/* buttons */}
                <div className="flex flex-wrap items-center gap-3 my-2">
                  {/* manage */}
                  <button className="px-3 py-2 bg-blue-700 text-neutral-100 rounded-md hover:bg-blue-900 transition-all ease-in">
                    <Link href={`/admin/job/managejob/${job_id}`}>
                      Manage Job
                    </Link>
                  </button>
                  {/* // TODO Code this */}
                  {/* close form */}
                  <button
                    className="px-3 py-2 border border-neutral-700 text-neutral-800 rounded-md hover:shadow-lg transition-all ease-in"
                    onClick={() => toggleStatusHandler(job_id)}
                  >
                    {`${jobData?.job?.is_active ? "Close Form" : "Open Form"}`}
                  </button>
                </div>
                <span className="border-b border-neutral-300 my-1 w-4/5"></span>

                {/* skills */}
                <div className="my-1">
                  <h2 className="text-lg text-neutral-800 font-medium">
                    Skills
                  </h2>
                  {jobData.job?.skills?.length !== 0 ? (
                    <div className="flex flex-wrap gap-2 w-full">
                      {jobData.job?.skills?.map((skill) => (
                        <p className="text-neutral-600 capitalize">
                          {skill.split(" ").join(" ")}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-neutral-600">
                      Not mentioned by the recruiter
                    </p>
                  )}
                </div>

                {/* description and requirements */}
                <div className="my-1 flex flex-col gap-2">
                  <details>
                    <summary className="text-lg text-neutral-800 font-medium">
                      Description
                    </summary>
                    {jobData?.job?.description?.length > 0 ? (
                      <RenderMarkdown data={jobData?.job?.description} />
                    ) : (
                      <p className="text-base text-neutral-600">
                        Not mentioned by the recruiter
                      </p>
                    )}
                  </details>

                  <details>
                    <summary className="text-lg text-neutral-800 font-medium">
                      Requirements
                    </summary>
                    {jobData?.job?.requirements?.length > 0 ? (
                      <RenderMarkdown data={jobData?.job?.requirements} />
                    ) : (
                      <p className="text-base text-neutral-600">
                        Not mentioned by the recruiter
                      </p>
                    )}
                  </details>
                </div>

                {/* additional questions posted */}
                <div className="mb-2 flex flex-col gap-2">
                  <details open={true}>
                    <summary className="text-lg text-neutral-800 font-medium">
                      Additional Questions
                    </summary>
                    {jobData?.job?.additional_questions?.length > 0 ? (
                      jobData?.job?.additional_questions?.map((q) => (
                        <ul className="list-decimal">
                          <li
                            className="text-neutral-700 capitalize"
                            key={q.qid}
                          >
                            {q.question} ?
                          </li>
                        </ul>
                      ))
                    ) : (
                      <p className="text-base text-neutral-600">
                        Not mentioned by the recruiter
                      </p>
                    )}
                  </details>
                </div>

                {/* showing any file if present */}
                {jobData?.job?.job_details_file &&
                  jobData?.job?.job_details_file !== " " && (
                    <div className="flex flex-col mb-2">
                      <h2 className="text-lg text-neutral-800 font-medium">
                        Details File
                      </h2>
                      <Link
                        href={`${process.env.NEXT_PUBLIC_DEV_SERVER}/${jobData?.job?.job_details_file}`}
                      >
                        <a
                          className="text-base hover:underline hover:text-blue-700"
                          target="_blank"
                        >
                          View File
                        </a>
                      </Link>
                    </div>
                  )}

                {/* about */}
                <div className="border border-neutral-500 rounded-md p-3">
                  {/* about recruiter */}
                  <div className="my-3">
                    <h2 className="text-lg text-neutral-800 font-medium my-1">
                      About Recruiter
                    </h2>
                    <ul className="flex flex-col gap-1">
                      <li className="flex items-center gap-2 list-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                        {jobData?.job?.contact_email}
                      </li>
                    </ul>
                  </div>

                  {/* about company */}
                  <div className="my-3">
                    <h2 className="text-lg text-neutral-800 font-medium my-1">
                      About Company
                    </h2>
                    <ul className="flex flex-col gap-1">
                      <li className="flex items-center gap-2 font-medium text-neutral-700 list-none">
                        {jobData?.job?.company_name}
                      </li>
                      <li className="flex items-center gap-2 text-neutral-600 list-none text-justify">
                        {jobData?.job?.company_description}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          rtl={false}
          pauseOnFocusLoss
          theme="light"
        />
      </DashboardLayout>
    </Layout>
  );
}
