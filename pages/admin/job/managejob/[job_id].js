import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Layout,
  DashboardLayout,
  Loader,
  InputField,
  BackButton,
  TextArea,
} from "../../../../components/UI/index";
import { Modal } from "../../../../components/UI/Modal/Modal";
import fetchData from "../../../../helpers/fetchData";
import { useFormik } from "formik";
import { useQuery } from "react-query";
import xlsx from "json-as-xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const filterData = {
  branch: [
    "Computer Science",
    "Information Technology",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Automobile Engineering",
    "Arts",
    "Science",
    "Commerce",
    "BSC",
    "MSC",
  ],
  college: [
    "Pillai College of Engineering",
    "Pillai College of arts,science and commerce",
  ],
};
/////////////////////////////////////

export default function managejob() {
  return <ManageJob />;
}

const ManageJob = () => {
  const router = useRouter();
  const { job_id } = router.query;
  const [currentView, setCurrentView] = useState("applicants");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [sortDir, setSortDir] = useState("desc");
  const [jobStagesData, setJobStagesData] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, user_id: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [filteredData, setFilteredData] = useState(null);

  const notify = useCallback((msg) => toast(msg));

  const filterForm = useFormik({
    initialValues: {
      branch: "",
      college: "",
      age: "",
      marks10th: "",
      marks12th: "",
      marksEng: "",
      user_skills: [],
    },
    onSubmit: async () => {
      setFiltersApplied((prev) => !prev);
      // filtering
      setFilteredData(filterDataFn());
      // switch tabs
      setShowFilters(false);
      // clearing the filters
      filterForm.setValues({
        branch: "",
        college: "",
        age: "",
        marks10th: "",
        marks12th: "",
        marksEng: "",
      });
    },
  });

  const filterDataFn = useCallback(() => {
    // filtering data
    const { branch, college, age, marks10th, marks12th, user_skills } =
      filterForm.values;
    const [marks10thLow, marks10thHigh] = marks10th.split("-");
    const [marks12thLow, marks12thHigh] = marks12th.split("-");

    let temp = {
      usersData: [],
    };

    // getting users skills if filter is selected
    if (user_skills?.length > 0) {
      temp.usersData.push(
        ...tableData?.usersData?.filter((d) => {
          const skills = d?.skills.data.map((s) => s.name);
          if (skills.includes(user_skills)) return d;
        })
      );
    }

    const data = tableData?.usersData?.filter((d) => {
      if (
        (branch !== "" && d?.basic_details?.branch === branch) ||
        (college !== "" && d?.basic_details?.college === college) ||
        (age !== "" && d?.basic_details?.age === age) ||
        (marks10th !== "" &&
          +marks10thLow <= +d?.education["10th"]["percentage"] &&
          +d?.education["10th"]["percentage"] <= +marks10thHigh) ||
        (marks12th !== "" &&
          +marks12thLow <= +d?.education["12th"]["percentage"] &&
          +d?.education["12th"]["percentage"] <= +marks12thHigh)
      )
        return d;
    });

    if (data?.length > 0) temp.usersData.push(...data);
    return temp;
  });

  const {
    data: fetchedData,
    isLoadingData,
    refetch,
  } = useQuery({
    enabled: job_id !== null,
    queryKey: ["job-data", job_id, currentView],
    queryFn: async () => {
      const res = await fetchData(
        `/admin/get-job-entries/${job_id}/${currentView}`
      );
      if (!res.isError) {
        setTableData(res.data);
        setFilteredData(res.data);
      }
      const res2 = await fetchData(`/admin/get-job-stages/${job_id}`);
      if (!res2.isError) setJobStagesData(res2.data);

      return res.data;
    },
  });

  useEffect(() => {
    setIsLoading(true);
    refetch();
    setIsLoading(false);
  }, [currentView]);

  const getResumeFileName = useCallback(async (user_id) => {
    const token = window.sessionStorage.getItem("auth-token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_SERVER}/api/v1/user/get-resume/${user_id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (!data.fileName) return "";
    else return `${process.env.NEXT_PUBLIC_DEV_SERVER}/${data?.fileName}`;
  });

  const resumeHandler = useCallback(
    async (user_id) => {
      setIsLoading(true);
      const token = window.sessionStorage.getItem("auth-token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DEV_SERVER}/api/v1/user/get-resume/${user_id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setIsLoading(false);
      if (!data.fileName) return notify("Unable to fetch resume");
      else
        window.open(`${process.env.NEXT_PUBLIC_DEV_SERVER}/${data?.fileName}`);
    },
    [router]
  );

  const modalHandler = useCallback((user_id) => {
    setShowModal((prev) => {
      return { show: !prev.show, user_id };
    });
  });

  const removeHandler = useCallback(async (user_id) => {
    const res = await fetchData(
      `/admin/remove-job-candidate/${job_id}`,
      {
        method: "DELETE",
        body: JSON.stringify({
          view: currentView,
          user_id,
        }),
      },
      {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    );

    notify(res?.message);
    router.reload();
  });

  const searchHandler = useCallback((key) => {
    if (key?.length === 0 || key === "") return setFilteredData(fetchedData);
    let searchedData = {
      usersData: null,
    };
    searchedData.usersData = tableData?.usersData?.filter((d) => {
      if (
        d?.basic_details["full_name"]?.toLowerCase().includes(key.toLowerCase())
      )
        return d;
    });
    if (searchedData) setFilteredData(searchedData);
  });

  const sortHandler = useCallback(() => {
    const names = tableData?.usersData?.map(
      (d) => d?.basic_details["full_name"]
    );

    if (sortDir === "desc") {
      names.sort((d1, d2) => (d1 < d2 ? 1 : d1 > d2 ? -1 : 0));
      setSortDir("asc");
    } else {
      names.sort((d1, d2) => (d1 > d2 ? 1 : d1 < d2 ? -1 : 0));
      setSortDir("desc");
    }
    const sortedTableData = {
      usersData: [],
    };

    names.forEach((name) => {
      sortedTableData?.usersData?.push(
        tableData["usersData"]?.find((data) => {
          if (data?.basic_details["full_name"] === name) return data;
        })
      );
    });
    return setFilteredData(sortedTableData);
  });

  const updateRoundHandler = useCallback(async (new_stage) => {
    setIsLoading(true);
    const res = await fetchData(
      "/admin/change-job-round-status",
      {
        method: "POST",
        body: JSON.stringify({ job_id: job_id, stage: new_stage }),
      },
      { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    );
    setIsLoading(false);
    notify(res?.message);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  });

  const downloadTableData = useCallback(() => {
    if (!fetchedData?.usersData?.length > 0) {
      notify("No data available to download yet!");
      return;
    }

    let resumes = [];
    let data = [
      {
        sheet: `${currentView}`,
        columns: [
          { label: "Id", value: "user_id" },
          { label: "Full name", value: "full_name" },
          { label: "Email", value: "email" },
          { label: "College", value: "college" },
          { label: "Branch", value: "branch" },
          { label: "Contact", value: "contact" },
          { label: "Address", value: "address" },
          { label: "Age", value: "age" },
          { label: "10th School", value: "10th name" },
          { label: "10th Marks", value: "10th marks" },
          { label: "10th Year", value: "10th year" },
          { label: "12th School", value: "12th name" },
          { label: "12th Marks", value: "12th marks" },
          { label: "12th Year", value: "12th year" },
          { label: "Degree Institute", value: "degree name" },
          { label: "Degree Marks", value: "degree marks" },
          { label: "Degree Year", value: "degree year" },
          { label: "Skills", value: "skills" },
          { label: "Resume Score", value: "resume_score" },
          { label: "Resume Link", value: "resume_link" },
        ],
        content: [],
      },
    ];

    // getting resume file
    fetchedData?.usersData?.forEach(async (u) => {
      const file = await getResumeFileName(u.user_id);
      resumes.push(file);
    });

    // converting data to required format
    if (fetchedData) {
      let obj = {};
      fetchedData?.usersData?.forEach((u, i) => {
        const arr = u.skills.data.map((s) => s.name);
        const skillsStr = arr.join(",");
        const resumeScore = fetchedData.users_resume_score[i] + "%";

        obj = {
          user_id: u.user_id,
          full_name: u.basic_details.full_name,
          email: u.basic_details.email,
          college: u.basic_details.college ?? "-",
          branch: u.basic_details.branch ?? "-",
          contact: u.basic_details.contact ?? "-",
          address: u.basic_details.address ?? "-",
          age: u.basic_details.age ?? "-",
          "10th name": u.education["10th"].name ?? "-",
          "10th year": u.education["10th"].year ?? "-",
          "10th marks": u.education["10th"].percentage ?? "-",
          "12th name": u.education["12th"].name ?? "-",
          "12th year": u.education["12th"].year ?? "-",
          "12th marks": u.education["12th"].percentage ?? "-",
          "degree name": u.education["engineering"].name ?? "-",
          "degree year": u.education["engineering"].year ?? "-",
          "degree marks": u.education["engineering"].percentage ?? "-",
          skills: skillsStr,
          resume_score: resumeScore,
          resume_link: resumes[i],
        };
        data[0]["content"].push(obj);
      });

      // settings of file
      let settings = {
        fileName: `${tableData?.job_info?.role}-${tableData?.job_info?.company_name}-${currentView}`, // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: "writeFile",
        RTL: true,
      };
      // download file
      if (data[0]?.content?.length > 0) {
        xlsx(data, settings);
        notify("Downloaded excel file successfully!");
      }
    }
  });

  const toggleDetailsPage = useCallback(() => {
    setShowDetailsPage((prev) => !prev);
  });

  if (isLoadingData || isLoading) return <Loader text="Getting job data" />;

  return (
    <Layout showNav={false}>
      {showModal.show && (
        <Modal
          heading={"Change Candidate Status"}
          content={
            <ChangeStatusForm
              stagesNames={jobStagesData}
              currentStage={currentView}
              user_id={showModal?.user_id}
              job_id={job_id}
            />
          }
          user_id={showModal?.user_id}
          onClick={modalHandler}
        />
      )}
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
      {!showModal.show && (
        <DashboardLayout authRole={["admin"]} pageTitle={"Manage Job"}>
          {!showDetailsPage && (
            <main className="relative min-h-screen h-full p-5 flex flex-col gap-2 py-4 overflow-hidden z-0">
              {/* heading */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <BackButton />
                  <h1 className="lg:text-2xl text-lg text-neutral-900 font-semibold mt-1 px-1">
                    Manage Job
                  </h1>
                </div>
              </div>
              <div className="flex flex-col p-4 rounded bg-neutral-50 gap-3">
                {/* job info */}
                {tableData?.job_info && (
                  <div className="flex flex-col gap-2 text-neutral-700">
                    <p className="text-neutral-600 text-base capitalize">
                      Role: {tableData?.job_info?.role}
                    </p>
                    <p className="text-neutral-600 text-base capitalize">
                      Company Name: {tableData?.job_info?.company_name}
                    </p>
                    <p className="text-neutral-600 text-base">
                      Created At:{" "}
                      {tableData?.job_info?.created_at &&
                        new Date(
                          tableData?.job_info?.created_at
                        ).toDateString()}
                    </p>
                    <p className="text-neutral-600 text-base capitalize">
                      Current Stage: {tableData?.job_info?.current_stage}
                    </p>
                    <p className="text-blue-700 text-base">
                      Last Edited: {tableData?.job_info?.last_edited}
                    </p>
                  </div>
                )}

                {/* dropdown */}
                <div className="w-full flex flex-col gap-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-neutral-700 text-base">
                    Update Current Round to:{" "}
                    <select
                      className="py-1.5 rounded-md border border-neutral-400 capitalize"
                      onChange={(e) => {
                        updateRoundHandler(e.target.value);
                      }}
                      value={
                        tableData?.job_info?.current_stage ?? "Registration"
                      }
                    >
                      {jobStagesData &&
                        jobStagesData?.map((d, i) => (
                          <option className="p-1 capitalize" value={d} key={i}>
                            {d}
                          </option>
                        ))}
                      <option value={"registration"}>Registration</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-neutral-700 text-base">
                    Change Current View to:{" "}
                    <select
                      className="py-1.5 rounded-md border border-neutral-400 capitalize"
                      name="table-view"
                      onChange={(e) => {
                        setCurrentView(e.target.value);
                      }}
                      value={currentView}
                    >
                      {jobStagesData &&
                        jobStagesData?.map((d, i) => (
                          <option className="p-1 capitalize" value={d} key={i}>
                            {d}
                          </option>
                        ))}
                      <option value={"recommended"}>Recommended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* table */}
              <div className="my-4 flex flex-col border-t-4 border-blue-800 bg-white shadow rounded-md py-3 overflow-auto">
                {/* feature rows */}
                <div className="flex flex-col">
                  {/* feature row 1 */}
                  <div className="flex flex-wrap gap-2 items-center justify-between w-full px-4 my-2">
                    <h3 className="font-semibold capitalize">
                      {currentView} View{" "}
                      <span className="text-neutral-500 text-sm">
                        ( Total {tableData?.usersData?.length} )
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2 lg:self-end">
                      {/* special view button */}
                      {(currentView.includes("test") ||
                        currentView.includes("interview")) && (
                        <button
                          className="px-2 py-1.5 text-neutral-600 hover:bg-neutral-300 hover:text-neutral-800 duration-200 transition-all rounded-md flex items-center gap-2"
                          onClick={toggleDetailsPage}
                        >
                          Round Details
                        </button>
                      )}
                      {/* filter */}
                      <div className="relative flex flex-col">
                        <button
                          className="px-2 py-1.5 text-neutral-600 hover:bg-neutral-300 hover:text-neutral-800 duration-200 transition-all rounded-md"
                          onClick={() => setShowFilters((prev) => !prev)}
                        >
                          Filter
                        </button>
                      </div>
                      {/* sort */}
                      <button
                        className="px-2 py-1.5 text-neutral-600 hover:bg-neutral-300 hover:text-neutral-800 duration-200 transition-all rounded-md flex items-center gap-2"
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
                  {/* feature row 2 */}
                  <div className="flex flex-row items-center p-2">
                    {/* search bar */}
                    <div className="w-full flex items-center rounded px-3">
                      <InputField
                        type="search"
                        bgColor="w-fit"
                        placeholder="Search by name"
                        onChange={(e) => {
                          searchHandler(e.target?.value);
                        }}
                      />
                    </div>
                    {/* download file */}
                    <div className="relative flex px-3">
                      <button
                        type="button"
                        className="hover:bg-gray-200 p-2 rounded-full hover:shadow transition-all flex items-center justify-center"
                        title="Download data as Excel"
                        onClick={downloadTableData}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="gray"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {fetchedData && fetchedData?.usersData?.length == 0 && (
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <Image
                      src={"/Illustration.svg"}
                      width={"100px"}
                      height={"100px"}
                    />
                    <h2 className="text-base text-neutral-700">
                      No entries found for the following job yet
                    </h2>
                  </div>
                )}

                {/* table data */}
                {(tableData?.length === 0 ||
                  filteredData?.usersData?.length === 0) &&
                  !showFilters &&
                  filtersApplied && (
                    <div className="p-4 flex justify-center">
                      <p className="text-neutral-700 lg:text-xl text-base">
                        No data found for selected filter
                      </p>
                    </div>
                  )}

                {tableData?.length !== 0 &&
                  tableData?.usersData?.length > 0 && (
                    <div className="py-2 flex flex-col">
                      {/* filters div */}
                      {showFilters && (
                        <form
                          onSubmit={filterForm.handleSubmit}
                          className="grid grid-cols-1 gap-2 px-4 py-2"
                        >
                          {/* go back */}
                          <div className="flex w-full my-1">
                            <BackButton
                              onClickHandler={() =>
                                setShowFilters((prev) => !prev)
                              }
                            />
                          </div>
                          {/* filter options */}
                          <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 px-4 py-2">
                            {filterData && (
                              <>
                                <div className="flex flex-col">
                                  {/* by branch */}
                                  <ul className="flex flex-col p-2 text-gray-800">
                                    <h3 className="text-lg font-medium">
                                      By Branch
                                    </h3>
                                    {filterData["branch"]?.map((b, i) => (
                                      <li
                                        key={i}
                                        className="flex items-center gap-2"
                                      >
                                        <input
                                          type="radio"
                                          name="branch"
                                          className="rounded"
                                          value={b}
                                          onChange={filterForm.handleChange}
                                        />
                                        {b}
                                      </li>
                                    ))}
                                  </ul>

                                  {/* by college */}
                                  <ul className="flex flex-col gap-1 p-2 text-gray-800">
                                    <h3 className="text-lg font-medium">
                                      By College
                                    </h3>
                                    {filterData["college"]?.map((c, i) => (
                                      <li
                                        key={i}
                                        className="flex items-center gap-2"
                                      >
                                        <input
                                          type="radio"
                                          name="college"
                                          className="rounded"
                                          value={c}
                                          onChange={filterForm.handleChange}
                                        />
                                        {c}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="flex flex-col">
                                  {/* by age */}
                                  <div className="flex flex-col gap-1 p-2 text-gray-800">
                                    <h3 className="text-lg font-medium">
                                      By Age
                                    </h3>
                                    <InputField
                                      type="text"
                                      name="age"
                                      placeholder="Enter Age"
                                      bgColor="w-fit"
                                      onChange={filterForm.handleChange}
                                    />
                                  </div>

                                  {/* by 10th marks */}
                                  <div className="flex flex-col gap-1 p-2 text-gray-800">
                                    <h3 className="text-lg font-medium">
                                      By 10th Marks
                                    </h3>
                                    <InputField
                                      type="text"
                                      name="marks10th"
                                      placeholder="Enter marks range"
                                      bgColor="w-fit"
                                      onChange={filterForm.handleChange}
                                    />
                                    <p className="text-sm text-neutral-500">
                                      Example 75-85
                                    </p>
                                  </div>

                                  {/* by 12th marks */}
                                  <div className="flex flex-col gap-1 p-2 text-gray-800">
                                    <h3 className="text-lg font-medium">
                                      By 12th Marks
                                    </h3>
                                    <InputField
                                      type="text"
                                      name="marks12th"
                                      placeholder="Enter marks range"
                                      bgColor="w-fit text-base"
                                      onChange={filterForm.handleChange}
                                    />
                                    <p className="text-sm text-neutral-500">
                                      Example 75-85
                                    </p>
                                  </div>

                                  <div className="flex flex-col gap-1 p-2 text-gray-800">
                                    <h3 className="text-lg font-medium">
                                      By Skills
                                    </h3>
                                    <InputField
                                      type="text"
                                      name="user_skills"
                                      placeholder="Enter Skills"
                                      bgColor="w-fit text-base"
                                      onChange={filterForm.handleChange}
                                    />
                                    <p className="text-sm text-neutral-500">
                                      Example C++,C,Java
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          {/* buttons */}
                          <div className="flex justify-center items-center w-full my-3 gap-3 ">
                            <button
                              onClick={() => {
                                setShowFilters(false);
                                setFilteredData(fetchedData);
                              }}
                              type="submit"
                              className="w-1/5 px-3 py-2 border border-gray-700 text-gray-700 rounded-md transition-all ease-in"
                            >
                              Clear
                            </button>
                            <button
                              type="submit"
                              className="lg:w-1/4 w-1/2 px-3 py-2 bg-blue-700 text-gray-100 rounded-md hover:bg-blue-600 transition-all ease-in"
                            >
                              Apply
                            </button>
                          </div>
                        </form>
                      )}
                      {!showFilters && filteredData?.usersData?.length > 0 && (
                        <table className="overflow-x-auto border-t-2 border-neutral-300 text-sm">
                          <thead className="w-full">
                            <tr className="w-full bg-white">
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Sr No
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                ID
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Full Name
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Email
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                College
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Branch
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Age
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Contact
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Current Status
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                10th Details
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center w-fit py-2">
                                12th Details
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Degree Details
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Skills
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Resume Score
                              </th>
                              <th className="text-sm font-medium text-neutral-900 px-4 text-center py-2">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData?.usersData?.map((data, i) => (
                              <tr
                                key={data?.user_id}
                                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 w-fit"
                              >
                                <td className="px-4 py-2 text-sm font-medium text-neutral-700 whitespace-wrap w-fit">
                                  {i + 1}
                                </td>
                                <td className="px-4 py-2 text-sm font-medium text-neutral-800 whitespace-wrap w-fit">
                                  {data?.user_id}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 capitalize whitespace-nowrap w-fit">
                                  {data?.basic_details?.full_name}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2  whitespace-nowrap">
                                  {data?.basic_details?.email}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 whitespace-wrap">
                                  {data?.basic_details?.college || "NA"}{" "}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 whitespace-wrap text-justify">
                                  {data?.basic_details?.branch || "NA"}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2">
                                  {data?.basic_details?.age}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 whitespace-nowrap">
                                  {data?.basic_details?.contact}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 capitalize whitespace-nowrap">
                                  {fetchedData?.usersStatus?.find(
                                    (d) => d._id === data?.user_id
                                  )?.current_status || "Not available"}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 whitespace-pre text-justify">
                                  {data?.education["10th"]["name"]}
                                  <br />
                                  {data?.education["10th"]["percentage"]} %
                                  <br />
                                  {data?.education["10th"]["year"]}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 whitespace-pre text-justify">
                                  {data?.education["12th"]["name"]}
                                  <br />
                                  {data?.education["12th"]["percentage"]} %
                                  <br />
                                  {data?.education["12th"]["year"]}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 whitespace-pre text-justify">
                                  {data?.education["engineering"]["name"]}
                                  <br />
                                  {
                                    data?.education["engineering"]["percentage"]
                                  }{" "}
                                  %
                                  <br />
                                  {data?.education["engineering"]["year"]}
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 capitalize whitespace-pre">
                                  <details>
                                    <summary>View all</summary>
                                    <p>
                                      {data?.skills?.data
                                        .map((s) => s.name)
                                        .join(", ")}
                                    </p>
                                  </details>
                                </td>
                                <td className="text-sm text-neutral-700 font-light px-4 py-2 capitalize text-center">
                                  {filteredData?.users_resume_score[i] + "%" ??
                                    "0%"}
                                </td>
                                <td className="w-full flex gap-2 px-4 py-2">
                                  <button
                                    onClick={() => modalHandler(data?.user_id)}
                                    className="w-full px-2 py-1.5 duration-200 transition-all rounded hover:bg-neutral-200"
                                    title="Change Application Status"
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
                                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => resumeHandler(data?.user_id)}
                                    title="View Resume"
                                    className="w-full px-2 py-1.5 duration-200 transition-all rounded hover:bg-neutral-200"
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
                                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    className="w-full px-2 py-1.5 duration-200 transition-all rounded hover:bg-neutral-200"
                                    title="Mail to user"
                                  >
                                    <a
                                      href={`mailto:${data?.basic_details?.email}`}
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
                                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                        />
                                      </svg>
                                    </a>
                                  </button>
                                  <button
                                    className="w-full px-2 py-1.5 duration-200 transition-all rounded hover:bg-neutral-200"
                                    title="Delete User"
                                    onClick={() => removeHandler(data?.user_id)}
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
                                {/* <td className="text-sm text-neutral-700 font-light px-4 py-2 flex w-full gap-2">
                                  <button
                                    onClick={() => modalHandler(data?.user_id)}
                                    className="w-full px-2 py-1.5 duration-200 transition-all rounded hover:bg-neutral-200"
                                    title="Change Application Status"
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
                                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => resumeHandler(data?.user_id)}
                                    title="View Resume"
                                    className="w-full px-2 py-1.5 duration-200 transition-all rounded hover:bg-neutral-200"
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
                                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    className="w-full px-2 py-1.5 duration-200 transition-all rounded hover:bg-neutral-200"
                                    title="Mail to user"
                                  >
                                    <a
                                      href={`mailto:${data?.basic_details?.email}`}
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
                                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                        />
                                      </svg>
                                    </a>
                                  </button>
                                  <button
                                    className="w-full px-2 py-1.5 duration-200 transition-all rounded hover:bg-neutral-200"
                                    title="Delete User"
                                    onClick={() => removeHandler(data?.user_id)}
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
                                </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                {/* pagination */}
                {/* <div className="my-3"></div> */}
              </div>
            </main>
          )}
          {showDetailsPage && (
            <RoundDetailsPage
              currentView={currentView}
              onClickHandler={toggleDetailsPage}
              candidatesData={fetchedData?.usersData}
              job_id={job_id}
              role={tableData?.job_info?.role}
              company_name={tableData?.job_info?.company_name}
            />
          )}
        </DashboardLayout>
      )}
    </Layout>
  );
};

const ChangeStatusForm = ({ currentStage, stagesNames, user_id, job_id }) => {
  const [resMsg, setResMsg] = useState("");
  const formik = useFormik({
    initialValues: {
      user_id: user_id,
      currStage: currentStage,
      newStage: "",
      dateOfChange: new Date(),
    },
    onSubmit: async (values) => {
      const res = await fetchData(
        `/admin/change-candidate-status/${job_id}`,
        {
          method: "POST",
          body: JSON.stringify(values),
        },
        {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      );
      setResMsg(res?.message);
      notify(res?.message);
    },
  });

  const notify = useCallback((msg) => toast(msg));

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-2 py-1 px-5"
    >
      <p className="text-neutral-600 text-base my-1">
        Select new stage for selected candidate to update his application status
        and the candidate will receive a mail regarding changes in the
        application{" "}
      </p>
      {/* candidate name and id */}
      <p className="text-neutral-600 text-base">
        Selected:{" "}
        <span className="text-neutral-700 font-medium px-1">{user_id}</span>
      </p>
      {/*  */}
      <div className="w-full flex lg:flex-row flex-col lg:items-center gap-2">
        <InputField
          name="currStage"
          required={true}
          onChange={formik.handleChange}
          value={currentStage}
          bgColor="capitalize"
        />
        to
        <select
          className="py-2 rounded-md border-0 shadow-md capitalize"
          name="newStage"
          required={true}
          onChange={formik.handleChange}
        >
          {stagesNames &&
            stagesNames?.map((d, i) => (
              <option className="p-1 capitalize" value={d} key={i}>
                {d}
              </option>
            ))}
        </select>
      </div>
      <div className="w-full flex my-2">
        <button
          type="submit"
          className="px-4 py-1.5 rounded-md shadow bg-blue-800 text-white"
        >
          Submit Change
        </button>
      </div>
      {/* //! TODO change the way of showing response later */}
      {/* showing response */}
      <p className="font-medium text-neutral-700 lg:text-base text-sm">
        {resMsg}
      </p>
    </form>
  );
};

const RoundDetailsPage = ({
  currentView,
  role,
  company_name,
  onClickHandler,
  candidatesData,
  job_id,
}) => {
  const roundDetailsForm = useFormik({
    initialValues: {
      job_id: job_id,
      round_name: currentView,
      round_description: "",
      round_date: new Date(),
      round_link: "",
      round_candidates: [],
    },
    onSubmit: async (values) => {
      let url = "/admin/add-job-round-details";
      if (fetchedData) url = "/admin/save-job-round-details";
      const res = await fetchData(
        url,
        {
          method: "POST",
          body: JSON.stringify(values),
        },
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      );

      notify(res.message);
      if (!res.isError) onClickHandler();
    },
  });

  const downloadFormData = useCallback(() => {
    if (!roundDetailsForm?.values?.round_candidates?.length > 0) {
      notify("No data available to download yet!");
      return;
    }
    let data = [
      {
        sheet: `${currentView}`,
        columns: [
          { label: "Round title", value: "round_name" },
          { label: "Round Date & Time", value: "round_date" },
          { label: "Description", value: "round_description" },
          { label: "Round Link", value: "round_link" },
          { label: "User Id", value: "user_id" },
          { label: "Full Name", value: "full_name" },
          { label: "Email", value: "email" },
          { label: "Contact", value: "contact" },
          { label: "College", value: "college_name" },
          { label: "Branch", value: "college_branch" },
          { label: "Age", value: "age" },
        ],
        content: [],
      },
    ];
    // converting data to required format
    if (roundDetailsForm?.values?.round_candidates) {
      let obj = {};
      roundDetailsForm?.values?.round_candidates?.forEach((u) => {
        obj = {
          round_name: roundDetailsForm?.values?.round_name,
          round_date: new Date(
            roundDetailsForm?.values?.round_date
          ).toLocaleString(),
          round_description: roundDetailsForm?.values?.round_description ?? "",
          round_link: roundDetailsForm?.values?.round_name ?? "",
          user_id: u.user_id,
          full_name: u.full_name,
          email: u.email,
          contact: u.contact,
          college_name: u.college_name,
          college_branch: u.college_branch,
          age: u.age,
        };
        data[0]["content"].push(obj);
      });
    }

    // settings of file
    let settings = {
      fileName: `${role}-${company_name}-${currentView}`, // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile",
      RTL: true,
    };
    // download file
    xlsx(data, settings);
    notify("Download file successfully!");
  });

  const notify = useCallback((msg) => toast(msg));

  // fetch details first
  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["job-round-details", job_id],
    queryFn: async () => {
      const res = await fetchData(
        `/admin/get-job-round-details/${job_id}/${currentView}`
      );
      // set fetchedData to values of form
      console.log(res.data);
      if (!res.isError)
        for (const key in res.data) {
          roundDetailsForm.values[key] = res.data[key];
        }
      return res.data;
    },
  });

  const addUserToList = useCallback((user, type) => {
    if (type === 1) {
      roundDetailsForm.values.round_candidates = [
        { ...user },
        ...roundDetailsForm.values.round_candidates,
      ];
    } else {
      roundDetailsForm.values.round_candidates =
        roundDetailsForm.values.round_candidates?.filter(
          (u) => u.user_id !== user.user_id
        );
    }
  });

  const findUserInList = useCallback((user_id) => {
    const isPresent = roundDetailsForm.values["round_candidates"].find(
      (user) => user.user_id === user_id
    );
    return isPresent ? true : false;
  });

  const deleteHandler = useCallback(async (currentView, job_id) => {
    const res = await fetchData(
      `/admin/delete-job-round-details/${job_id}/${currentView}`,
      {
        method: "DELETE",
      }
    );
    alert(res.message);
    onClickHandler();
  });

  if (isLoading) return <Loader />;

  return (
    <main className="relative min-h-screen h-full p-5 flex flex-col gap-2 py-4 overflow-hidden z-0">
      {/* header */}
      <div className="flex items-center gap-1">
        <BackButton onClickHandler={onClickHandler} />
        <h1 className="lg:text-2xl text-lg text-neutral-800 font-semibold mt-1 px-1 capitalize">
          Round Details - {currentView}
        </h1>
      </div>
      {/* form */}
      <form onSubmit={roundDetailsForm.handleSubmit}>
        <div className="w-full lg:w-1/2 h-fit flex flex-col px-4 py-4 bg-neutral-50 rounded-md shadow my-2">
          <InputField
            label="Round Name"
            name="round_name"
            value={currentView}
            onChange={roundDetailsForm.handleChange}
          />
          <InputField
            label="Round Date"
            type="datetime-local"
            name="round_date"
            value={roundDetailsForm.values["round_date"]}
            onChange={roundDetailsForm.handleChange}
          />
          <p className="text-neutral-700 lg:text-lg text-base font-medium">
            Round Candidates
          </p>

          {fetchedData?.round_candidates?.length === 0 ||
            (candidatesData?.length === 0 && (
              <p>No candidates found for this round!</p>
            ))}

          <ul
            className="list-none rounded outline-none my-1 border-gray-300 h-fit max-h-56 w-full overflow-y-scroll"
            name="round_candidates"
          >
            {fetchedData &&
              fetchedData?.round_candidates?.length > 0 &&
              candidatesData?.map((d) => (
                <li className="flex gap-2 items-center" key={d?.user_id}>
                  <input
                    type="checkbox"
                    className="border border-gray-400 rounded-none"
                    checked={findUserInList(d?.user_id)}
                    onChange={(e) => {
                      if (e.target.checked)
                        addUserToList(
                          {
                            user_id: d?.user_id,
                            full_name: d?.basic_details.full_name,
                            email: d?.basic_details.email,
                            contact: d?.basic_details.contact,
                            age: d?.basic_details.age,
                            college_name: d?.basic_details.college_name,
                            college_branch: d?.basic_details.college_branch,
                          },
                          1
                        );
                      else {
                        addUserToList(
                          {
                            user_id: d?.user_id,
                            full_name: d?.basic_details.full_name,
                            email: d?.basic_details.email,
                            contact: d?.basic_details.contact,
                            age: d?.basic_details.age,
                            college_name: d?.basic_details.college_name,
                            college_branch: d?.basic_details.college_branch,
                          },
                          2
                        );
                      }
                    }}
                  />
                  {d?.basic_details?.email}
                </li>
              ))}

            {!fetchedData &&
              candidatesData?.map((d) => (
                <li className="flex gap-2 items-center" key={d?.user_id}>
                  <input
                    type="checkbox"
                    className="border border-gray-400 rounded-none"
                    onChange={(e) => {
                      if (e.target.checked)
                        addUserToList(
                          {
                            user_id: d?.user_id,
                            full_name: d?.basic_details.full_name,
                            email: d?.basic_details.email,
                            contact: d?.basic_details.contact,
                            age: d?.basic_details.age,
                            college_name: d?.basic_details.college_name,
                            college_branch: d?.basic_details.college_branch,
                          },
                          1
                        );
                      else {
                        addUserToList(
                          {
                            user_id: d?.user_id,
                            full_name: d?.basic_details.full_name,
                            email: d?.basic_details.email,
                            contact: d?.basic_details.contact,
                            age: d?.basic_details.age,
                            college_name: d?.basic_details.college_name,
                            college_branch: d?.basic_details.college_branch,
                          },
                          2
                        );
                      }
                    }}
                  />
                  {d?.basic_details?.email}
                </li>
              ))}
          </ul>

          {/*  */}
          <InputField
            label="Round Link"
            name="round_link"
            placeholder="Optional"
            value={roundDetailsForm.values["round_link"]}
            onChange={roundDetailsForm.handleChange}
          />
          <TextArea
            label="Description"
            placeholder="(Optional)"
            name="round_description"
            value={roundDetailsForm.values["round_description"]}
            onChange={roundDetailsForm.handleChange}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-3 py-1.5 rounded shadow bg-blue-700 text-neutral-100 hover:bg-blue-800 transition-all ease-in"
            >
              Save Details
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded shadow text-red-700 font-medium hover:bg-red-800 hover:text-neutral-100 transition-all ease-in"
              onClick={() => deleteHandler(currentView, job_id)}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={downloadFormData}
              className="px-3 py-1.5 rounded shadow text-neutral-700 hover:bg-gray-200 transition-all ease-in"
              title="Download as Excel"
            >
              Download
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
