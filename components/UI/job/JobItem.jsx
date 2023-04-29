import React, { useCallback } from "react";
import dateFormatter from "../../../helpers/dateFormatter";
import numberFormatter from "../../../helpers/numberFormatter";
import Link from "next/link";
import fetchData from "../../../helpers/fetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const JobItem = ({
  data: d,
  showBtn,
  showSave,
  isSaved,
  showRoundStatusBtn = false,
  viewLink = "user",
  percentSimilarity = null,
}) => {
  const notify = useCallback((msg) => toast(msg));

  const toggleSaveHandler = async () => {
    const res = await fetchData(
      `/user/toggle-save-job/${d?._id["$oid"] || d?._id}`,
      {
        method: "PUT",
      }
    );
    notify(res.message);
    window.location.reload();
  };

  const deleteHandler = useCallback(async (id) => {
    if (id) {
      const res = await fetchData(
        "/admin/delete-job",
        {
          method: "DELETE",
          body: JSON.stringify({ job_id: id }),
        },
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      );

      notify(res.message);

      setTimeout(() => {
        window?.location?.reload();
      }, 2000);
    }
  });

  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
      <li
        className="hover:shadow flex flex-col gap-1 px-4 py-3 bg-neutral-50 rounded-md shadow-sm my-2 capitalize transition-all ease-in duration-200"
        key={d?._id["$oid"] || d?._id}
      >
        {/* company */}
        <div className="flex justify-between items-center ">
          <p className="text-base text-neutral-700 font-medium">
            {d?.company_name}
          </p>
          {percentSimilarity !== null && (
            <p className="text-base text-blue-700 font-medium">
              {percentSimilarity === 0
                ? ` `
                : `${percentSimilarity} % Match`}
            </p>
          )}
        </div>
        {/* role */}
        <div className="flex justify-between">
          <h2 className="text-lg lg:text-xl font-semibold text-neutral-800 my-0">
            {d?.role}
          </h2>
        </div>
        {/* salary */}
        <p className="text-base text-neutral-700">
          {numberFormatter(d?.salary)} LPA
        </p>
        <div className="flex flex-wrap items-center gap-4 my-1 py-1">
          {/* mode */}
          <p className="text-base text-neutral-700 flex gap-1">
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
            {d?.mode}
          </p>
          {/* location */}
          <p className="text-base text-neutral-700 flex gap-1">
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
            {d?.location}
          </p>
          {/* form status */}
          <p className="text-base text-neutral-700 flex gap-1">
            {d?.is_active && new Date(d?.last_date) > new Date() ? (
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
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
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
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
            {d?.is_active && new Date(d?.last_date) > new Date()
              ? "Open"
              : "Closed"}
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
            {dateFormatter(d?.created_at["$date"] || d?.created_at)}
          </p>
          {/* last date */}
          <p className="text-base text-red-700 flex items-center gap-1 capitalize font-medium">
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
        {/* buttons */}
        <div className="flex flex-wrap items-center gap-2 my-2">
          {/* view */}
          <button className="px-3 py-2 bg-blue-700 text-neutral-100 rounded-md hover:bg-blue-900 transition-all ease-in">
            <Link
              href={`/${viewLink}/job/${d?._id["$oid"] || d?._id || d.job_id}`}
            >
              View More
            </Link>
          </button>
          {showRoundStatusBtn && (
            <button className="px-3 py-2 hover:bg-neutral-300 text-neutral-700 rounded-md transition-all ease-in text-sm">
              <Link
                href={`/user/job/myapplication/${
                  d?._id["$oid"] || d?._id || d.job_id
                }`}
              >
                Round Status
              </Link>
            </button>
          )}
          {/* edit */}
          {showSave && (
            <button
              className="px-3 py-2 border border-transparent  hover:bg-neutral-200 text-neutral-700 rounded-md transition-all ease-in"
              onClick={toggleSaveHandler}
            >
              {isSaved ? "Saved" : "Save"}
            </button>
          )}
          {showBtn && (
            <>
              <button className="px-3 py-2 border border-transparent  hover:bg-neutral-200 text-neutral-700 rounded-md transition-all ease-in">
                <Link
                  href={`/${viewLink}/job/managejob/${
                    d?._id["$oid"] || d?._id
                  }`}
                >
                  Manage
                </Link>
              </button>
              <button className="px-3 py-2 border border-transparent  hover:bg-neutral-200 text-neutral-700 rounded-md transition-all ease-in">
                <Link
                  href={`/${viewLink}/job/edit/${d?._id["$oid"] || d?._id}`}
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </Link>
              </button>
              <button
                className="px-3 py-2 border border-transparent hover:bg-red-800 hover:text-neutral-50 text-red-800 rounded-md transition-all ease-in"
                onClick={() => deleteHandler(d?._id["$oid"] || d?._id)}
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
            </>
          )}
        </div>
      </li>
    </>
  );
};
