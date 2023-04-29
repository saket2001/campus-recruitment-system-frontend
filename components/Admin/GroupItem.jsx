import Link from "next/link";
import React from "react";
import { useCallback } from "react";
import fetchData from "../../helpers/fetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const GroupItem = ({
  data,
  viewLink = "user",
  showExit = false,
  showDelete = false,
}) => {
  const notify = useCallback((msg) => toast(msg));

  const leaveGroupHandler = useCallback(async (group_id) => {
    try {
      const res = await fetchData(
        `/user/leave-group`,
        {
          method: "DELETE",
          body: JSON.stringify({ group_id }),
        },
        { "Content-type": "application/json" }
      );

      notify(res.message);
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  }, []);

  const deleteGroupHandler = useCallback(async (group_id) => {
    try {
      const res = await fetchData(
        `/admin/delete-group`,
        {
          method: "DELETE",
          body: JSON.stringify({ group_id }),
        },
        { "Content-type": "application/json" }
      );

      notify(res.message);
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  }, []);

  return (
    <>
      <div className="lg:w-1/4 w-full flex flex-col rounded-lg hover:shadow">
        {/* head */}
        <div
          className={`px-5 py-4 bg-blue-700 text-base text-neutral-100 font-light hover:cursor-pointer flex flex-col gap-2 rounded-tr-lg rounded-tl-lg shadow`}
        >
          {/* title */}
          <Link href={`/${viewLink}/groups/${data?._id}`}>
            <p
              className="lg:text-xl text-lg font-medium hover:underline"
              title="click to open group"
            >
              {data?.title}
            </p>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            {/* creator name */}
            <p className="text-sm flex items-center gap-2">
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              {data?.creator_name}
            </p>
            {/* year */}
            <p className="text-sm flex items-center gap-2">
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
              {data?.year}
            </p>
            {/* code */}
            <p className="text-sm flex items-center gap-2">
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
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              {data?.code}
            </p>
            {/* {navigator?.clipboard?.writeText(data?.code)} */}
          </div>
        </div>
        <div className="w-full h-36 px-3 py-2 flex flex-col justify-end items-end bg-white rounded-bl-lg rounded-br-lg">
          <div className="w-full flex justify-between">
            <div>
              {/* open group */}
              <button
                type="button"
                className="px-3 py-1.5 rounded hover:bg-blue-100 text-base transition-all ease-linear duration-150"
              >
                <Link href={`/${viewLink}/groups/${data?._id}`}>
                  <p title="click to open group">Open</p>
                </Link>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/* total */}
              <Link href={`/${viewLink}/groups/members/${data?._id}`}>
                <p className="flex items-center gap-2 text-base hover:cursor-pointer">
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
                  {data?.members.length ?? 0}
                </p>
              </Link>
              {/* delete */}
              {showDelete && (
                <button
                  onClick={() => deleteGroupHandler(data?._id)}
                  className="hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
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
              )}
              {/* exit */}
              {showExit && (
                <button
                  onClick={() => leaveGroupHandler(data?._id)}
                  className="hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
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
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        {/* body */}
      </div>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
    </>
  );
};
