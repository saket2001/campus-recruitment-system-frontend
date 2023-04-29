import React, { useEffect, useCallback, useState } from "react";
import {
  Layout,
  DashboardLayout,
  InputField,
  BackButton,
  Loader,
} from "../../../components/UI/index";
import fetchData from "../../../helpers/fetchData";
import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import Image from "next/image";

const BranchesData = [
  "Information Technology",
  "Computer Science",
  "Mechanical",
  "Automobile",
  "Electronics",
  "Electronics and Telecommunication",
  "Chemical Engineering",
  "Biochemical Engineering",
  "Marine Engineering",
  "Civil Engineering",
  "Marine Engineering",
];

/////////////////////////////////////////
export default function Users() {
  const [tableData, setTableData] = useState([]);
  const [setYear, setSetYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  const [sortDir, setSortDir] = useState("desc");
  const [filteredApplied, setFilteredApplied] = useState(false);

  const filterForm = useFormik({
    initialValues: {
      profileStatus: "",
      placementStatus: "",
      branch:"",
    },
    onSubmit: async () => {
      // filtering
      setFilteredData(filterDataFn());
      filterForm.setValues({
        profileStatus: "",
        placementStatus: "",
      });
      // switch tabs
      setShowFilters(false);
      setFilteredApplied(true);
    },
  });

  const filterDataFn = useCallback(() => {
    setFilteredApplied(true);
    // filtering data
    const { profileStatus, placementStatus,branch } = filterForm.values;
    // filter keys which need to be applied on data
    const temp = [
      ["is_verified", profileStatus],
      ["current_status", placementStatus],
      ["college_branch", branch],
    ];
    const filters = temp.filter((val) => {
      if (val[1]?.length > 0 || val[1]) return val;
    });
    const results = [];

    // function to filter
    fetchedData?.forEach((d) => {
      let isTrueArr = [];
      filters.forEach((f) => {
        // for profile status
        if (f[0] === "is_verified" && d[f[0]] === (f[1] === "true")) {
          return isTrueArr.push("true");
        }
        // for branches
        else if (f[0] === "college_branch" && d[f[0]]?.includes(f[1].toLowerCase())) {
          return isTrueArr.push("true");
        } else if (d[f[0]]?.toLowerCase() === f[1].toLowerCase()) {
          return isTrueArr.push("true");
        } else {
          isTrueArr.push("false");
        }
      });
      if (isTrueArr.every((d) => d === "true")) results.push(d);
    });

    return results;
  });

  const {
    data: fetchedData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-users", setYear],
    queryFn: async () => {
      const res = await fetchData(`/admin/get-candidates/${setYear}`);
      console.log(res);
      if (!res.isError) {
        setTableData(res.data);
        setFilteredData(res.data);
      }
      return res.data;
    },
  });

  useEffect(() => {
    refetch();
  }, [setYear]);

  const notify = useCallback((msg) => toast(msg));

  const removeHandler = useCallback(async (user_id) => {
    const res = await fetchData(
      `/admin/remove-candidate/${user_id}`,
      {
        method: "DELETE",
      },
      {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    );

    notify(res?.message);

    setTimeout(() => {
      window?.location?.reload();
    }, [2000]);
  });

  const searchHandler = useCallback((key) => {
    if (key?.length === 0 || key === "") return setFilteredData(fetchedData);
    const temp = tableData?.filter((d) => {
      if (d?.full_name?.toLowerCase().includes(key.toLowerCase())) return d;
    });
    if (temp) setFilteredData(temp);
  });

  const sortHandler = useCallback(() => {
    const names = tableData?.map((d) => d?.full_name);

    if (sortDir === "desc") {
      names.sort((d1, d2) => (d1 < d2 ? 1 : d1 > d2 ? -1 : 0));
      setSortDir("asc");
    } else {
      names.sort((d1, d2) => (d1 > d2 ? 1 : d1 < d2 ? -1 : 0));
      setSortDir("desc");
    }

    const temp = [];
    names.forEach((name) => {
      temp.push(
        tableData?.find((data) => {
          if (data?.full_name === name) return data;
        })
      );
    });
    return setFilteredData(temp);
  });

  const verificationHandler = useCallback(async (user_id) => {
    const res = await fetchData(`/admin/verify-user/${user_id}`);

    notify(res?.message);

    setTimeout(() => {
      window?.location?.reload();
    }, [2000]);
  });

  if (isLoading) return <Loader />;

  return (
    <Layout showNav={false}>
      <DashboardLayout pageTitle={"Manage Users"} authRole={["admin"]}>
        <main className="min-h-screen flex flex-col gap-2 w-full px-5 py-3 bg-blue-100">
          {/* heading */}
          <h2 className="flex items-center gap-2 font-semibold lg:text-2xl text-xl text-neutral-800">
            <BackButton />
            Manage Users
          </h2>

          <div className="my-4 flex flex-col bg-white rounded-md p-3 overflow-auto">
            {/* filters */}
            {showFilters && (
              <form onSubmit={filterForm.handleSubmit}>
                {/* go back */}
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="px-3 py-1 hover:bg-gray-300 rounded-md w-fit"
                >
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
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>
                </button>

                {/* filter options */}
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-1">
                  {/* by profile status */}
                  <ul className="flex flex-col gap-1 p-2 text-gray-800">
                    <h3 className="text-lg font-medium">By Profile Status</h3>
                    <ul className="list-none">
                      <li className="flex items-center gap-2 capitalize">
                        <input
                          type="radio"
                          name="profileStatus"
                          className="rounded"
                          value={"true"}
                          onChange={filterForm.handleChange}
                        />
                        Verified
                      </li>
                      <li className="flex items-center gap-2 capitalize">
                        <input
                          type="radio"
                          name="profileStatus"
                          className="rounded"
                          value={"false"}
                          onChange={filterForm.handleChange}
                        />
                        Unverifed
                      </li>
                    </ul>
                  </ul>
                  {/* by placement status */}
                  <ul className="flex flex-col gap-1 p-2 text-gray-800">
                    <h3 className="text-lg font-medium">By Placement Status</h3>
                    <ul className="list-none">
                      <li className="flex items-center gap-2 capitalize">
                        <input
                          type="radio"
                          name="placementStatus"
                          className="rounded"
                          value={"placed"}
                          onChange={filterForm.handleChange}
                        />
                        Placed
                      </li>
                      <li className="flex items-center gap-2 capitalize">
                        <input
                          type="radio"
                          name="placementStatus"
                          className="rounded"
                          value={"not placed"}
                          onChange={filterForm.handleChange}
                        />
                        Not placed
                      </li>
                    </ul>
                  </ul>
                  {/* by branch */}
                  <ul className="flex flex-col gap-1 p-2 text-gray-800">
                    <h3 className="text-lg font-medium">By Branch</h3>
                    <ul className="list-none">
                      {BranchesData?.map((data) => (
                        <li className="flex items-center gap-2 capitalize">
                          <input
                            type="radio"
                            name="branch"
                            className="rounded capitalize"
                            value={data}
                            onChange={filterForm.handleChange}
                          />
                          {data}
                        </li>
                      ))}
                    </ul>
                  </ul>
                </div>

                {/* buttons */}
                <div className="flex justify-center items-center w-full my-3 gap-3 ">
                  <button
                    onClick={() => {
                      setFilteredApplied(false);
                      setShowFilters(false);
                      setFilteredData(fetchedData);
                    }}
                    type="submit"
                    className="w-1/5 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-neutral-700 rounded-md transition-all ease-in"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="lg:w-1/4 w-1/2 px-3 py-2 bg-blue-700 text-neutral-100 rounded-md hover:bg-blue-600 transition-all ease-in"
                  >
                    Apply
                  </button>
                </div>
              </form>
            )}

            {/* buttons */}
            {!showFilters && (
              <div className="flex lg:justify-between flex-wrap w-full items-center gap-2">
                {/* row 1 */}
                <div className="flex justify-end items-center gap-2">
                  {/* search bar */}
                  <div className="w-fit flex items-center rounded px-3">
                    <InputField
                      type="search"
                      bgColor="w-fit"
                      placeholder="Search by name"
                      onChange={(e) => {
                        searchHandler(e.target?.value);
                      }}
                    />
                  </div>
                  {/* year */}
                  <button className="py-2 w-fit border-0 capitalize text-neutral-700">
                    <InputField
                      bgColor="transparent"
                      type={"month"}
                      onChange={(input) => {
                        const year = input.target.value.split("-")[0];
                        setSetYear(year);
                      }}
                    />
                  </button>
                </div>

                {/* row 2 */}
                <div className="flex items-center gap-2">
                  {/* filter */}
                  <button
                    className="px-3 py-1.5 bg-neutral-50 text-neutral-700 rounded-md hover:bg-neutral-200 ease-in transition-all hover:shadow"
                    onClick={() => setShowFilters((prev) => !prev)}
                  >
                    Filters
                  </button>
                  {/* sort */}
                  <button
                    className="px-3 py-1.5 bg-neutral-50 text-neutral-700 rounded-md flex gap-2 items-center hover:bg-neutral-200 ease-in transition-all hover:shadow"
                    onClick={() => sortHandler()}
                  >
                    Sort
                    {sortDir === "asc" ? (
                      <span className="">
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
                            d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="">
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
                            d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* table */}
            {!showFilters &&
              (tableData === null || tableData?.length === 0) && (
                <div className="flex flex-col gap-2 justify-center items-center">
                  <Image
                    src={"/Illustration.svg"}
                    width={"100px"}
                    height={"100px"}
                  />
                  <h2 className="text-base text-neutral-700">
                    No data found for selected year
                  </h2>
                </div>
              )}

            {!showFilters && filteredApplied && filteredData.length == 0 && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <Image
                  src={"/Illustration.svg"}
                  width={"100px"}
                  height={"100px"}
                />
                <h2 className="text-base text-neutral-700">
                  No users found for applied filters, please re-adjust the
                  filters and try again
                </h2>
              </div>
            )}

            {!showFilters && filteredData && filteredData?.length !== 0 && (
              <table className="overflow-x-auto table-fixed">
                <thead className="">
                  <tr className="border-b border-blue-500 rounded-tl-md rounded-tr-md">
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
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                    >
                      Profile Status
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData &&
                    filteredData?.map((data, i) => (
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
                        <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-normal capitalize">
                          {data?.college_name || "-"}{" "}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-normal capitalize">
                          {data?.college_branch || "-"}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-4 py-2">
                          {data?.contact_no || "-"}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-4 py-2 capitalize">
                          {data?.is_verified ? "Verified" : "Unverified"}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-4 py-2 capitalize">
                          {data?.current_status ?? "Not available"}
                        </td>
                        {/* actions */}
                        <td className="text-sm text-gray-900 font-light px-4 py-2 flex gap-2 whitespace-pre">
                          <button
                            className="px-2 py-1.5 border border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-gray-100 duration-200 transition-all rounded-md"
                            onClick={() => verificationHandler(data?._id)}
                          >
                            {data?.is_verified ? "Unverify" : "Verify"}
                          </button>
                          <button className="px-2 py-1.5 border border-transparent hover:border-neutral-700 text-neutral-700 hover:bg-neutral-700 hover:text-neutral-100 duration-200 transition-all rounded-md">
                            <a target={"_blank"} href={`mailto:${data?.email}`}>
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
                            </a>
                          </button>
                          <button
                            className="px-2 py-1.5 text-neutral-50 bg-red-600 hover:text-red-100 duration-200 transition-all rounded-md"
                            onClick={() => removeHandler(data?._id)}
                          >
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
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {!showFilters && (
              <h3 className="text-end w-full px-4 my-2 text-neutral-500 text-base">
                Showing for year {setYear}
              </h3>
            )}
          </div>
        </main>
      </DashboardLayout>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
    </Layout>
  );
}
