import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import {
  BackButton,
  DashboardLayout,
  Layout,
  Loader,
  InputField,
} from "../../../../components/UI/index";
import fetchData from "../../../../helpers/fetchData";
import Link from "next/link";
import Image from "next/image";

export default function MyApplicationStatus() {
  return <MyApplicationStatusComponent />;
}

const MyApplicationStatusComponent = () => {
  const router = useRouter();
  const { job_id } = router.query;
  const [tableData, setTableData] = useState(null);

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["user-application-status", job_id],
    queryFn: async () => {
      const res = await fetchData(`/user/get-application-status/${job_id}`);
      console.log({ res });
      setTableData(res.data);
      return res.data;
    },
  });

  const searchHandler = useCallback((key) => {
    if (key?.length === 0 || key === "") return setTableData(fetchedData);
    let searchedData = {
      roundDetails: null,
    };
    searchedData.roundDetails = tableData?.roundDetails?.filter((d) => {
      if (d?.full_name?.toLowerCase().includes(key.toLowerCase())) return d;
    });
    if (searchedData) setTableData(searchedData);
  });

  console.log(fetchedData);
  if (isLoading) return <Loader text="Loading" />;

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["user"]} pageTitle="User Application Status">
        {fetchedData && (
          <main className="min-h-screen h-full lg:px-8 flex flex-col gap-1 p-4">
            {/* heading */}
            <h2 className="flex items-center gap-2 font-semibold lg:text-2xl text-neutral-800 text-lg my-1 capitalize">
              <BackButton />
              Recruitment Process - {tableData?.jobDetails?.current_stage}
            </h2>
            {/* info */}
            <div className="flex flex-col gap-1">
              <p className="text-neutral-600 text-base">
                List of candidates and their status through current job
                recruitment process
              </p>

              {/* your application */}
              <div className="bg-white rounded shadow p-3 my-2 ">
                <h2 className="font-semibold text-neutral-700 text-lg">
                  Your Application Status
                </h2>
                <div className="flex flex-col overflow-auto">
                  {fetchedData?.userDetails && (
                    <div className="py-2 flex flex-col">
                      {true && (
                        <table className="overflow-x-auto table-fixed">
                          <thead className="border-b">
                            <tr className="">
                              <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                              >
                                Full Name
                              </th>
                              <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                              >
                                Email
                              </th>
                              <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                              >
                                College
                              </th>
                              <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                              >
                                Branch
                              </th>
                              <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                              >
                                Job Role
                              </th>
                              <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                              >
                                Company
                              </th>
                              <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                              >
                                Resume
                              </th>
                              <th
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-4 py-4 text-left capitalize"
                              >
                                Stage
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {fetchedData?.userDetails && (
                              <tr
                                key={fetchedData?.userDetails?._id}
                                className="bg-white py-1 border-b transition duration-300 ease-in-out hover:bg-gray-100"
                              >
                                <td className="text-sm text-neutral-800 font-light px-4 py-2 capitalize whitespace-nowrap">
                                  {fetchedData?.userDetails?.full_name}
                                </td>
                                <td className="text-sm text-neutral-800 font-light px-4 py-2  whitespace-normal">
                                  {fetchedData?.userDetails?.email}
                                </td>
                                <td className="text-sm text-neutral-800 font-light px-4 py-2 whitespace-normal">
                                  {fetchedData?.userDetails?.college_name ||
                                    "-"}{" "}
                                </td>
                                <td className="text-sm text-neutral-800 font-light px-4 py-2 whitespace-normal capitalize">
                                  {fetchedData?.userDetails?.college_branch ||
                                    "-"}
                                </td>
                                <td className="text-sm text-neutral-800 font-light px-4 py-2 whitespace-normal capitalize">
                                  {fetchedData?.jobDetails?.role || "-"}
                                </td>
                                <td className="text-sm text-neutral-800 font-light px-4 py-2 whitespace-normal capitalize">
                                  {fetchedData?.jobDetails?.company_name || "-"}
                                </td>
                                <td className="text-sm text-neutral-800 font-light px-4 py-2 whitespace-normal">
                                  {fetchedData?.userResume && (
                                    <Link
                                      href={`${process.env.NEXT_PUBLIC_DEV_SERVER}/${fetchedData?.userResume}`}
                                    >
                                      <a target="_blank">View</a>
                                    </Link>
                                  )}
                                </td>
                                <td className="text-sm">
                                  <p className="text-blue-800 first-letter font-bold px-4 py-2 capitalize">
                                    {fetchedData?.userStatus}
                                  </p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* round details */}
              {Object.keys(fetchedData?.roundInformation).length > 0 && (
                <div className="bg-white rounded shadow p-3 my-2 ">
                  <h2 className="font-semibold text-neutral-700 text-lg">
                    Round Details
                  </h2>
                  <div className="flex flex-col overflow-auto">
                    {fetchedData?.userDetails && (
                      <div className="py-2 flex flex-col">
                        {true && (
                          <table className="overflow-x-auto table-fixed">
                            <thead className="border-b">
                              <tr className="">
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                >
                                  Date & Time
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                >
                                  Description
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                >
                                  Candidates
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                >
                                  Link
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {fetchedData?.userDetails && (
                                <tr
                                  key={fetchedData?.userDetails?._id}
                                  className="bg-white py-1 border-b transition duration-300 ease-in-out hover:bg-gray-100"
                                >
                                  <td className="text-sm text-neutral-800 font-light px-4 py-2 capitalize whitespace-nowrap">
                                    {fetchedData?.roundInformation?.round_name}
                                  </td>
                                  <td className="text-sm text-neutral-800 font-light px-4 py-2  whitespace-nowrap">
                                    {new Date(
                                      fetchedData?.roundInformation?.round_date
                                    ).toDateString()}
                                    ,{" "}
                                    {new Date(
                                      fetchedData?.roundInformation?.round_date
                                    ).toTimeString()}
                                  </td>
                                  <td className="text-sm text-neutral-800 font-light px-4 py-2 whitespace-pre w-1/2">
                                    {fetchedData?.roundInformation
                                      ?.round_description || "-"}{" "}
                                  </td>
                                  <td className="text-sm text-neutral-800 font-light px-4 py-2 whitespace-normal">
                                    <ul className="list-none">
                                      {fetchedData?.roundInformation
                                        ?.round_candidates &&
                                        fetchedData?.roundInformation?.round_candidates?.map(
                                          (u) => <li>{u.email}</li>
                                        )}
                                    </ul>
                                  </td>
                                  <td className="text-sm text-neutral-800 font-light px-4 py-2 whitespace-normal capitalize">
                                    {fetchedData?.roundInformation
                                      ?.round_link || "-"}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* other applications */}
              <div className="my-2 flex flex-col bg-white shadow rounded overflow-auto p-3">
                <div className="w-full flex justify-between">
                  <h2 className="font-semibold text-neutral-700 text-lg my-2">
                    Candidates in this Round
                  </h2>
                  {/* search bar */}
                  <div className="flex justify-center rounded px-3">
                    <InputField
                      type="search"
                      bgColor="w-fit"
                      placeholder="Search by name"
                      onChange={(e) => {
                        searchHandler(e.target?.value);
                      }}
                    />
                  </div>
                </div>

                {/* table */}
                {tableData === null ||
                  (tableData?.roundDetails?.length === 0 && (
                    <div className="flex flex-col gap-2 justify-center items-center">
                      <Image
                        src={"/Illustration.svg"}
                        width={"100px"}
                        height={"100px"}
                      />
                      <h2 className="text-base text-neutral-700">
                        No candidates found for current job round. Keep checking
                        to view new updates.
                      </h2>
                    </div>
                  ))}

                {tableData?.roundDetails?.length > 0 && (
                  <div className="flex flex-col">
                    {true && (
                      <table className="overflow-x-auto table-fixed">
                        <thead className="border-b">
                          <tr className="">
                            <th
                              scope="col"
                              className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                            >
                              Sr
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                            >
                              Full Name
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                            >
                              College
                            </th>
                            <th
                              scope="col"
                              className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                            >
                              Branch
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData["roundDetails"]?.map((data, i) => (
                            <tr
                              key={data?._id}
                              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                            >
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                {i + 1}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-4 py-2 capitalize whitespace-nowrap">
                                {data?.full_name}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-4 py-2  whitespace-normal">
                                {data?.email}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-normal">
                                {data?.college_name || "NA"}{" "}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-normal">
                                {data?.college_branch || "NA"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
        {!fetchedData && (
          <main className="min-h-screen h-full lg:px-8 flex flex-col justify-center items-center gap-1 p-4">
            <div className="flex flex-col justify-center items-center w-1/2">
              <img
                src={"/unauthorized.png"}
                alt="error image"
                width={"100px"}
                height={"100px"}
              />
              <p className="lg:text-lg text-neutral-600 text-lg my-1 text-center">
                It looks like you haven&apos;t applied to this job post and
                trying to access the job round result!
              </p>
              <button
                onClick={() => window?.history.back()}
                className="px-4 py-1.5 rounded hover:shadow hover:bg-neutral-300"
              >
                Go Back
              </button>
            </div>
          </main>
        )}
      </DashboardLayout>
    </Layout>
  );
};
