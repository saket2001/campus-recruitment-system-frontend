import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { Pagination } from "../../UI/Pagination/Pagination";
import Image from "next/image";
import { JobItem } from "./JobItem";

export const JobBoard = ({
  label,
  data,
  percentData = null,
  showBtn = false,
  showSave = false,
  filterData,
  savedJobData,
  viewLink,
  showRoundStatusBtn = false,
}) => {
  const totalPages = Math.ceil(data?.length / 3);
  const totalJobs = data?.length;
  const [showFilters, setShowFilters] = useState(false);
  const [filteredApplied, setFilteredApplied] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [pageState, setPageState] = useState({ current: 1, start: 0, end: 3 });

  const filterForm = useFormik({
    initialValues: {
      role: "",
      salary: "",
      company_name: "",
      location: "",
      date: "",
      open: "",
      category: "",
    },
    onSubmit: async () => {
      // filtering
      setFilteredData(filterDataFn());
      // switch tabs
      setShowFilters(false);
      // clearing the filters
      // filterForm.setValues({
      //   role: "",
      //   salary: "",
      //   company_name: "",
      //   location: "",
      //   date: "",
      //   open: "",
      // });
      setFilteredApplied(true);
    },
  });

  const filterDataFn = useCallback(() => {
    setFilteredApplied(true);
    // filtering data
    const { role, location, company_name, salary, open, category } =
      filterForm.values;
    let low, high;
    if (salary !== "") {
      [low, high] = salary.split("-");
    }
    // filter keys which need to be applied on data
    const temp = [
      ["role", role],
      ["location", location],
      ["company_name", company_name],
      ["salary", salary],
      ["open", open],
      ["category", category],
    ];
    const filters = temp.filter((val) => {
      if (val[1].length > 0) return val;
    });
    const results = [];

    // function to filter
    data?.forEach((d) => {
      let isTrueArr = [];
      filters.forEach((f) => {
        // special condition
        if (f[0] === "salary" && d?.salary.includes("-")) {
          return low <= d?.salary.slice(1, 2) && d?.salary.slice(1, 2) <= high
            ? isTrueArr.push("true")
            : isTrueArr.push("false");
        } else if (f[0] === "salary" && !d?.salary.includes("-")) {
          return low <= d?.salary.slice(0, 1) && d?.salary.slice(0, 1) <= high
            ? isTrueArr.push("true")
            : isTrueArr.push("false");
        }
        if (f[0] !== "salary" && d[f[0]].toLowerCase() === f[1].toLowerCase()) {
          return isTrueArr.push("true");
        } else {
          isTrueArr.push("false");
        }
      });
      if (isTrueArr.every((d) => d === "true")) results.push(d);
    });

    // const tempArr = data.filter((d) => {
    //   if (
    //     (role !== "" && d?.role.toLowerCase() === role.toLowerCase()) &&
    //     (category !== "" &&
    //       d?.category.toLowerCase() === category.toLowerCase()) &&
    //     (location !== "" &&
    //       d?.location.toLowerCase() === location.toLowerCase()) &&
    //     (company_name !== "" &&
    //       d?.company_name.toLowerCase() === company_name.toLowerCase()) &&
    //     (!d?.salary.includes("-") &&
    //       low <= d?.salary.slice(0, 1) &&
    //       d?.salary.slice(0, 1) <= high) &&
    //     (d?.salary.includes("-") &&
    //       low <= d?.salary.slice(1, 2) &&
    //       d?.salary.slice(1, 2) <= high) &&
    //     (open !== "" && open == "true"
    //       ? new Date(d?.last_date) >= new Date()
    //       : new Date(d?.last_date) < new Date())
    //   ) {
    //     return d;
    //   }
    // });
    return results;
  });

  useEffect(() => {
    if (data && data?.length > 0)
      setFilteredData(data?.slice(pageState.start, pageState.end));
  }, [pageState]);

  const pageHandler = useCallback((newPageNo) => {
    if (newPageNo === pageState.current) return;
    if (newPageNo === 1) {
      return setPageState({
        current: newPageNo,
        start: 0,
        end: 3,
      });
    }

    setPageState((prev) => {
      if (newPageNo > prev.current)
        return {
          current: newPageNo,
          start: prev.start + 3,
          end: prev.end + 3 > totalJobs ? totalJobs : prev.end + 3,
        };
      else {
        return {
          current: newPageNo,
          start: prev.start - 3,
          end: prev.end - 3 > totalJobs ? totalPages + 2 : prev.end - 3 + 2,
        };
      }
    });
  });

  const removeFilter = useCallback((filterKey) => {
    filterForm.values[filterKey] = "";
    setFilteredData(filterDataFn());

    // check if any filters are left or not
    const temp = Object.values(filterForm.values);
    if (temp.every((d) => d.length === 0)) {
      setFilteredApplied(false);
      setFilteredData(data?.slice(pageState.start, pageState.end));
    }
  });

  return (
    <>
      <div className="flex flex-col p-5 rounded-md bg-gray-100">
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
            {filterData && (
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-1">
                {/* by role */}
                <ul className="flex flex-col gap-1 p-2 text-gray-800">
                  <h3 className="text-lg font-medium">By Role</h3>
                  {filterData["role"]?.map((role, i) => (
                    <li key={i} className="flex items-center gap-2 capitalize">
                      <input
                        type="radio"
                        name="role"
                        className="rounded"
                        value={role}
                        onChange={filterForm.handleChange}
                      />
                      {role}
                    </li>
                  ))}
                </ul>

                {/* by salary */}
                <ul className="flex flex-col gap-1 p-2 text-gray-800">
                  <h3 className="text-lg font-medium">By Salary</h3>
                  <li className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="salary"
                      className="rounded"
                      value={"0-2"}
                      onChange={filterForm.handleChange}
                    />
                    0 LPA to 2 LPA
                  </li>
                  <li className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="salary"
                      className="rounded"
                      value={"2-4"}
                      onChange={filterForm.handleChange}
                    />
                    2 LPA to 4 LPA
                  </li>
                  <li className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="salary"
                      className="rounded"
                      value={"4-6"}
                      onChange={filterForm.handleChange}
                    />
                    4 LPA to 6 LPA
                  </li>
                  <li className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="salary"
                      className="rounded"
                      value={"6-8"}
                      onChange={filterForm.handleChange}
                    />
                    6 LPA to 8 LPA
                  </li>
                  <li className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="salary"
                      className="rounded"
                      value={"8-10"}
                      onChange={filterForm.handleChange}
                    />
                    8 LPA to 10 LPA
                  </li>
                  <li className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="salary"
                      className="rounded"
                      value={"10"}
                      onChange={filterForm.handleChange}
                    />
                    More then 10LPA
                  </li>
                </ul>

                {/* by company */}
                <ul className="flex flex-col gap-1 p-2 text-gray-800">
                  <h3 className="text-lg font-medium">By Company</h3>
                  {filterData &&
                    filterData["company_name"]?.map((company_name, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 capitalize"
                      >
                        <input
                          type="radio"
                          name="company_name"
                          className="rounded"
                          value={company_name}
                          onChange={filterForm.handleChange}
                        />
                        {company_name}
                      </li>
                    ))}
                </ul>

                {/* by location */}
                <ul className="flex flex-col gap-1 p-2 text-gray-800">
                  <h3 className="text-lg font-medium">By Location</h3>
                  {filterData &&
                    filterData["location"]?.map((location, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 capitalize"
                      >
                        <input
                          type="radio"
                          name="location"
                          className="rounded"
                          value={location}
                          onChange={filterForm.handleChange}
                        />
                        {location}
                      </li>
                    ))}
                </ul>

                {/* by category */}
                <ul className="flex flex-col gap-1 p-2 text-gray-800">
                  <h3 className="text-lg font-medium">By Category</h3>
                  {filterData &&
                    filterData["category"]?.map((category, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 capitalize"
                      >
                        <input
                          type="radio"
                          name="category"
                          className="rounded"
                          value={category}
                          onChange={filterForm.handleChange}
                        />
                        {category}
                      </li>
                    ))}
                </ul>

                {/* by job status */}
                <ul className="flex flex-col gap-1 p-2 text-gray-800">
                  <h3 className="text-lg font-medium">By Job Status</h3>
                  <li className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="open"
                      className="rounded"
                      value="true"
                      onChange={filterForm.handleChange}
                    />
                    Open
                  </li>
                  <li className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="open"
                      className="rounded"
                      value="false"
                      onChange={filterForm.handleChange}
                    />
                    Closed
                  </li>
                </ul>
              </div>
            )}

            {/* buttons */}
            <div className="flex justify-center items-center w-full my-3 gap-3 ">
              <button
                onClick={() => {
                  setFilteredApplied(false);
                  setShowFilters(false);
                  setFilteredData(data);
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

        {/* heading */}
        {!showFilters && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4">
              <h2 className="flex flex-col font-medium text-gray-800 lg:text-2xl text-xl">
                {label}
              </h2>
              {/* filter button */}
              {data?.length > 0 && (
                <div className="relative w-fit">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="px-3 py-2 text-neutral-800 rounded hover:bg-neutral-200 hover:shadow transition-all ease-in"
                  >
                    Filters
                  </button>
                </div>
              )}
            </div>
            {/* showing applied filters */}
            <div className="flex justify-start items-center px-4 py-2">
              {Object.entries(filterForm.values)?.map((val, i) => (
                <div key={i}>
                  {val[1].length > 0 ? (
                    <span className="flex items-center gap-1 mr-2 px-2 py-1 rounded-full bg-gray-200">
                      <p className="text-sm text-neutral-700 capitalize">
                        {val[0] + " : " + val[1]}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFilter(val[0])}
                        className="text-sm p-1 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* display region */}
        {!showFilters && (
          <>
            {filteredApplied && filteredData.length == 0 && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <Image
                  src={"/Illustration.svg"}
                  width={"100px"}
                  height={"100px"}
                />
                <h2 className="text-base text-neutral-700">
                  No jobs found for applied filters, please re-adjust the
                  filters and try again
                </h2>
              </div>
            )}

            {data && data.length == 0 && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <Image
                  src={"/Illustration.svg"}
                  width={"100px"}
                  height={"100px"}
                />
                <h2 className="text-base text-neutral-700">
                  No jobs found at the moment,please try again
                </h2>
              </div>
            )}

            <ul className="my-2">
              {filteredData?.length > 0 &&
                filteredData?.map((d, i) => (
                  <JobItem
                    key={d?._id["$oid"] || d?._id}
                    data={d}
                    showBtn={showBtn}
                    showSave={showSave}
                    showRoundStatusBtn={showRoundStatusBtn}
                    percentSimilarity={
                      percentData && Math.round(percentData[i] * 100)
                    }
                    isSaved={savedJobData?.data?.saved_jobs?.find(
                      (job) => job._id === d._id || job._id === d._id["$oid"]
                    )}
                    viewLink={viewLink}
                  />
                ))}
            </ul>
          </>
        )}

        {/*  pagination */}
        {!filteredApplied &&
          !showFilters &&
          filteredData?.length > 0 &&
          totalJobs > 3 && (
            <Pagination
              totalPages={totalPages}
              onClickHandler={pageHandler}
              pageState={pageState}
              activePage={pageState.current}
            />
          )}
      </div>
    </>
  );
};
