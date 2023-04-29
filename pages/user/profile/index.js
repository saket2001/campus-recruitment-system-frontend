import React, { useState } from "react";
import { Layout, DashboardLayout, Loader } from "../../../components/UI/index";
import { AccountSettings } from "../../../components/User/Profile/AccountSettings";
import fetchData from "../../../helpers/fetchData";
import { useQuery } from "react-query";
import { ProfileAlert } from "../../../components/User/Profile/ProfileAlert";
import Image from "next/image";

const sameTabs = ["skills", "hobbies", "languages", "extra_curricular"];
const profileTabs = [
  "basic_details",
  "certificates",
  "experience",
  "education",
  "skills",
  "extra_curricular",
  "projects",
  "languages",
  "hobbies",
];
const labelStyle = "font-medium text-gray-700 text-lg py-1 capitalize";
const inputStyle =
  "text-gray-700 text-lg py-1.5 border-b border-gray-300 capitalize";

export default function MyProfile() {
  const [currTab, setCurrTab] = useState("basic_details");
  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["user-profile-data"],
    queryFn: async () => {
      const data = await fetchData("/user/profile");
      console.log(data);
      return data.data;
    },
  });

  if (isLoading) return <Loader text="Loading your profile data" />;

  return (
    <Layout showNav={false}>
      {fetchedData && (
        <DashboardLayout authRole={["user"]} pageTitle={"User Profile"}>
          <ProfileAlert alertLimit={200} />
          <main className="p-6 h-full flex lg:flex-row flex-col gap-3 m-5">
            {/* tabs */}
            <ul className="lg:w-1/2 w-full flex flex-col border border-gray-300 rounded-md shadow-md bg-gray-100">
              {/* profile pic */}
              <div className="flex-col flex items-center justify-center py-3 px-2">
                {fetchedData["details"]["basic_details"]?.profile_picture ? (
                  <div className="w-fit flex relative bg-neutral-300 rounded-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_DEV_SERVER}/${fetchedData["details"]["basic_details"]?.profile_picture}`}
                      alt="user profile picture"
                      loading="lazy"
                      width={150}
                      height={150}
                      className="mb-2 rounded-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-fit flex relative bg-neutral-300 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-20 h-20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                )}
                <h2 className="font-medium text-lg rounded-full px-3 py-1 bg-blue-600 text-neutral-100 my-2">
                  {!fetchData?.is_verified ? "Verified" : "Unverified"}
                </h2>
              </div>
              {profileTabs?.map((data, i) => (
                <li
                  className={`py-4 px-5 flex items-center justify-between capitalize hover:cursor-pointer hover:bg-gray-200 text-gray-700 transition-all ease-in font-medium ${
                    currTab === data ? "bg-gray-200" : ""
                  }`}
                  id={data}
                  key={i}
                  onClick={() => setCurrTab(data)}
                >
                  {data.includes("_")
                    ? `${data.split("_")[0] + " " + data.split("_")[1]}`
                    : data}
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
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </li>
              ))}
              {/* settings */}
              <li
                className={`py-4 px-5 flex items-center justify-between capitalize hover:cursor-pointer hover:bg-gray-200 text-gray-700 transition-all ease-in font-medium ${
                  currTab === "settings" ? "bg-gray-200" : ""
                }`}
                id="settings"
                onClick={() => setCurrTab("settings")}
              >
                Settings
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
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </li>
            </ul>
            {/* data */}
            <div className="w-full h-fit flex flex-col p-4 border border-gray-300 rounded-md shadow-md bg-gray-100 relative">
              {/* basic details */}
              {currTab === "basic_details" && (
                <div className="flex flex-col gap-1 px-2">
                  <h2 className="font-medium text-lg lg:text-xl capitalize">
                    Your Basic Details
                  </h2>
                  <div className="flex flex-col">
                    <p className={labelStyle}>Full Name</p>
                    <p className={inputStyle}>
                      {fetchedData["details"]["basic_details"]?.full_name}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className={labelStyle}>Contact</p>
                    <p className={inputStyle}>
                      +91 {fetchedData["details"]["basic_details"]?.contact}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className={labelStyle}>Email</p>
                    <p className={inputStyle + "".concat("normal-case")}>
                      {fetchedData["details"]["basic_details"]?.email}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className={labelStyle}>Age</p>
                    <p className={inputStyle}>
                      {fetchedData["details"]["basic_details"]?.age}
                    </p>
                  </div>
                  <div className="flex flex-col"></div>
                  <div className="flex flex-col">
                    <p className={labelStyle}>College</p>
                    <p className={inputStyle}>
                      {fetchedData["details"]["basic_details"]?.college}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className={labelStyle}>Branch</p>
                    <p className={inputStyle}>
                      {fetchedData["details"]["basic_details"]?.branch}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className={labelStyle}>Admission Number</p>
                    <p className={inputStyle}>
                      {
                        fetchedData["details"]["basic_details"]
                          ?.admission_number
                      }
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className={labelStyle}>Address</p>
                    <p className={inputStyle + "".concat("normal-case")}>
                      {fetchedData["details"]["basic_details"]?.address}
                    </p>
                  </div>
                  <div className="flex flex-col"></div>
                  <div className="flex flex-col w-full">
                    <p className={labelStyle}>Summary</p>
                    <p
                      className={
                        inputStyle +
                        "".concat("normal-case text-base text-justify")
                      }
                    >
                      {fetchedData["details"]["basic_details"]?.summary}
                    </p>
                  </div>
                </div>
              )}
              {/* skills */}
              {sameTabs.includes(currTab) && (
                <div className="flex flex-col gap-3">
                  <h2 className="font-medium text-lg lg:text-xl capitalize">
                    Your{" "}
                    {currTab.includes("_")
                      ? `${currTab.split("_")[0] + " " + currTab.split("_")[1]}`
                      : currTab}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3">
                    {fetchedData["details"][currTab]?.data?.map((d, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 bg-blue-800 rounded-md shadow text-gray-100"
                      >
                        {d.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* certificates */}
              {currTab === "certificates" && (
                <div className="flex flex-col gap-3">
                  <h2 className="font-medium text-lg lg:text-xl capitalize">
                    Your {currTab}
                  </h2>
                  <ul className="list-disc list-inside py-2">
                    {fetchedData["details"].certificates?.data?.map((d, i) => (
                      <li key={i} className="text-gray-700 text-lg">
                        <span className="font-bold text-gray-800">
                          {d.name}
                        </span>{" "}
                        , {d.year}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* projects */}
              {currTab === "projects" && (
                <div className="flex flex-col">
                  <h2 className="font-medium text-lg lg:text-xl capitalize">
                    Your {currTab}
                  </h2>
                  <ul className="list-disc list-inside py-2">
                    {fetchedData["details"]?.projects?.data?.map((d, i) => (
                      <li key={i} className="text-gray-700 text-lg">
                        <span className="font-bold text-gray-800">
                          {d.name}
                        </span>
                        <br />
                        {d?.summary}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* experience */}
              {currTab === "experience" && (
                <div className="flex flex-col">
                  <h2 className="font-medium text-lg lg:text-xl capitalize">
                    Your {currTab}
                  </h2>
                  <ul className="list-disc list-inside py-2">
                    {fetchedData["details"]?.experience?.data?.map((d, i) => (
                      <li key={i} className="text-gray-700 text-lg my-2">
                        <span className="font-bold text-gray-800 mb-2 capitalize">
                          {d.name} , {d.year}
                        </span>
                        <br />
                        <p className="text-base text-justify">{d?.summary}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* education */}
              {currTab === "education" && (
                <div className="flex flex-col">
                  <h2 className="font-medium text-lg lg:text-xl capitalize">
                    Your {currTab}
                  </h2>
                  <ul className="list-roman py-2">
                    <li className="text-gray-700 text-lg my-2">
                      <span className="font-bold text-gray-800 mb-2 capitalize">
                        {fetchedData["details"]?.education["10th"].name}
                      </span>
                      <br />
                      <p className="text-base text-justify">
                        Passing year -{" "}
                        {fetchedData["details"]?.education["10th"].year}
                      </p>
                      <p className="text-base text-justify">
                        Percentage -{" "}
                        {fetchedData["details"]?.education["10th"].percentage} %
                      </p>
                    </li>
                    <li className="text-gray-700 text-lg my-2">
                      <span className="font-bold text-gray-800 mb-2 capitalize">
                        {fetchedData["details"]?.education["12th"].name}
                      </span>
                      <br />
                      <p className="text-base text-justify">
                        Passing year -{" "}
                        {fetchedData["details"]?.education["12th"].year}
                      </p>
                      <p className="text-base text-justify">
                        Percentage -{" "}
                        {fetchedData["details"]?.education["12th"].percentage} %
                      </p>
                    </li>
                    <li className="text-gray-700 text-lg my-2">
                      <span className="font-bold text-gray-800 mb-2 capitalize">
                        {fetchedData["details"]?.education["engineering"].name}
                      </span>
                      <br />
                      <p className="text-base text-justify">
                        Passing year -{" "}
                        {fetchedData["details"]?.education["engineering"].year}
                      </p>
                      <p className="text-base text-justify">
                        Percentage -{" "}
                        {
                          fetchedData["details"]?.education["engineering"]
                            .percentage
                        }{" "}
                        %
                      </p>
                    </li>
                  </ul>
                </div>
              )}

              {/* settings */}
              {currTab === "settings" && <AccountSettings />}
            </div>
          </main>
        </DashboardLayout>
      )}
    </Layout>
  );
}
