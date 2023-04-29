import React from "react";
import { DashboardLayout, Loader, Layout } from "../../components/UI/index";
import { useSelector } from "react-redux";
import Link from "next/link";
import { ProfileAlert } from "../../components/User/Profile/ProfileAlert";
import { NotificationIcon } from "../../components/User/Notification/NotificationIcon";
import { useScreenSize } from "../../hooks/useScreenSize";
import { NotificationIconAndDiv } from "../../components/User/Notification/NotificationIconAndDiv";
import { useQuery } from "react-query";
import fetchData from "../../helpers/fetchData";
import dateFormatter from "../../helpers/dateFormatter";
import NumberFormatter from "../../helpers/numberFormatter";
import { RoleStatistics } from "../../components/User/Dashboard/RoleStatistics";
import { PreviousYearStatistics } from "../../components/User/Dashboard/PreviousYearStatistics";

export default function Dashboard() {
  return <DashboardMain />;
}

const DashboardMain = () => {
  const { full_name } = useSelector((state) => state.auth);
  const screenSize = useScreenSize();

  const { data, isLoading } = useQuery({
    queryKey: ["user-analysis"],
    queryFn: async () => {
      const res = await fetchData("/user/dashboard-analysis");
      return res?.data;
    },
  });

  if (isLoading) return <Loader text="Analyzing your data..." />;

  return (
    <div>
      <Layout showNav={false}>
        <DashboardLayout authRole={["user"]} pageTitle={"Candidate Dashboard"}>
          <main className="min-h-screen flex flex-col gap-2 w-full p-3 bg-neutral-200">
            <ProfileAlert />
            {/* heading */}
            <div className="flex justify-between items-center py-3 px-4">
              <h2 className="flex flex-col font-semibold lg:text-3xl text-xl">
                User Dashboard
                <span className="text-lg text-gray-500">
                  Welcome, {full_name}
                </span>
              </h2>

              {/* notification icon */}
              {screenSize < 600 ? (
                <div className="w-fit lg:w-1/3 flex justify-end">
                  <NotificationIcon />
                </div>
              ) : (
                <div className="w-full lg:w-1/3 flex justify-end">
                  <NotificationIconAndDiv />
                </div>
              )}
            </div>

            {/* analysis part */}
            <DashboardAnalysis data={data} />
          </main>
        </DashboardLayout>
      </Layout>
    </div>
  );
};

const DashboardAnalysis = ({ data }) => {
  return (
    <section className="grid lg:grid-cols-2 grid-cols-1 w-full lg:gap-3 gap-1">
      {/* layer 1 */}
      <section className="flex flex-col lg:gap-5 gap-3 items-start justify-start py-3 w-full h-full">
        {/* graph */}
        <div className="flex w-full">
          <RoleStatistics data={data?.prevYearRoleDemand} />
        </div>
        <div className="flex w-full">
          <PreviousYearStatistics data={data?.prevYearPlacementsPerCompany} />
        </div>
      </section>
      {/* Layer 2 */}
      <section className="flex flex-col gap-4 w-full py-3">
        {/* applied jobs */}
        <div className="flex-col">
          <div className="shadow-md rounded-md p-4 h-full bg-gray-50">
            <h1 className="font-medium text-2xl text-neutral-800 my-1">
              Applied Jobs
            </h1>
            <p className="text-base text-neutral-500">
              Here you can view all your applied and ongoing placements
            </p>
            {/* <div className="border border-b border-gray-200 my-1"></div> */}
            <ul className="list-none flex flex-col gap-3 w-full my-2">
              {data?.appliedJobs &&
                data?.appliedJobs?.map((d) => (
                  <li
                    key={d?._id}
                    className="w-full flex flex-col p-3 bg-gray-200 rounded-md shadow"
                  >
                    {/* position */}
                    <h4 className="font-medium text-lg text-neutral-800 capitalize my-1">
                      {d.role} - {d.company_name}
                    </h4>
                    {/* other details */}
                    <div className="flex gap-2 my-1">
                      {/* <p className="text-base text-neutral-700 capitalize">
                      {d.company_name}
                    </p> */}
                      <p className="text-base text-gray-700">
                        {NumberFormatter(d?.salary)}
                      </p>
                      <p className="flex items-center text-base text-neutral-700 capitalize gap-1">
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
                        {d.location}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center my-1">
                      {/* date created */}
                      <p className="font-medium text-sm text-blue-700 flex items-center gap-1">
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
                        {dateFormatter(d?.created_at)}
                      </p>
                      {/* date closes */}
                      <p className="text-sm text-red-700 flex items-center gap-1 capitalize font-medium">
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
                        {new Date(d?.last_date).toDateString()}
                      </p>
                    </div>

                    {/* buttons- view and manage */}
                    <div className="flex items-center gap-3 my-2">
                      <button className="px-3 py-2 bg-blue-700 text-gray-100 rounded-md hover:bg-blue-900 transition-all ease-in text-sm">
                        <Link href={`/user/job/${d?._id ?? d.job_id}`}>
                          View More
                        </Link>
                      </button>
                      <button className="px-3 py-2 hover:bg-neutral-300 text-neutral-700 rounded-md transition-all ease-in text-sm">
                        <Link
                          href={`/user/job/myapplication/${d?._id ?? d.job_id}`}
                        >
                          Round Status
                        </Link>
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {/* new jobs */}
        <div className="bg-gray-50 shadow-md rounded-md p-4 h-fit">
          <h1 className="font-medium lg:text-2xl text-lg text-neutral-800 my-2">
            New Jobs
          </h1>
          <p className="text-base text-neutral-500 my-1">
            Stay updated with all the coming companies at the campus
          </p>
          <ul className="list-none flex flex-col gap-3 w-full my-2">
            {data?.newJobs &&
              data?.newJobs?.map((d) => (
                <li
                  key={d?._id}
                  className="w-full flex flex-col p-3 bg-gray-200 rounded-md shadow"
                >
                  {/* position */}
                  <h4 className="font-medium text-lg text-neutral-800 capitalize my-1">
                    {d.role} - {d.company_name}
                  </h4>
                  {/* other details */}
                  <div className="flex gap-2 my-1">
                    {/* <p className="text-base text-neutral-700 capitalize">
                      {d.company_name}
                    </p> */}
                    <p className="text-base text-gray-700">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumSignificantDigits: 3,
                      }).format(d?.salary)}{" "}
                      LPA
                    </p>
                    <p className="flex items-center text-base text-neutral-700 capitalize gap-1">
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
                      {d.location}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center my-1">
                    {/* date created */}
                    <p className="font-medium text-sm text-blue-700 flex items-center gap-1">
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
                      {dateFormatter(d?.created_at)}
                    </p>
                    {/* date closes */}
                    <p className="text-sm text-red-700 flex items-center gap-1 capitalize font-medium">
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
                      {new Date(d?.last_date).toDateString()}
                    </p>
                  </div>

                  {/* buttons- view and manage */}
                  <div className="flex items-center gap-3 my-2">
                    <button className="px-3 py-2 bg-blue-700 text-gray-100 rounded-md hover:bg-blue-900 transition-all ease-in text-sm">
                      <Link href={`/user/job/${d?._id ?? d.job_id}`}>
                        View More
                      </Link>
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </section>
  );
};
