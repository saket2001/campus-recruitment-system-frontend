import Link from "next/link";
import React, { useCallback, useState } from "react";
import dateFormatter from "../../helpers/dateFormatter";
import fetchData from "../../helpers/fetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NoticeItem = ({ data, showTabs = true, viewLink = "admin" }) => {
  const [noticeTabs, setNoticeTabs] = useState(false);
  const notify = useCallback((msg) => toast(msg));
  const deleteHandler = useCallback(async () => {
    try {
      const res = await fetchData(`/admin/delete-notice/${data?._id}`, {
        method: "DELETE",
      });
      notify(res?.message);
      window.location.reload();
    } catch (err) {
      notify(err);
    }
  });

  return (
    <>
      <div
        key={data?._id}
        className="bg-white px-4 py-3 gap-2 flex flex-col rounded-md shadow hover:shadow-md transition-all ease-in"
      >
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          rtl={false}
          pauseOnFocusLoss
          theme="light"
        />
        {/* header with Creator Name, date and icon */}
        <div className="flex py-2 border-b border-neutral-400">
          <span className="flex flex-col w-full">
            <span className="relative flex justify-between items-center w-full">
              <h3 className="text-neutral-700 font-medium text-lg">Admin</h3>
              {showTabs && (
                <button
                  onClick={() => setNoticeTabs((prev) => !prev)}
                  className="hover:bg-neutral-100 rounded-full p-1"
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
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                </button>
              )}
              {/* tab */}
              {showTabs && noticeTabs && (
                <ul className="list-none absolute right-0 top-10 border bg-white text-neutral-600 text-sm">
                  <Link href={`/admin/groups/edit/${data?._id}`}>
                    <li className="py-2 px-3 hover:bg-neutral-200 text-base flex items-center gap-2 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Edit Notice
                    </li>
                  </Link>
                  <li
                    className="py-2 px-3 hover:bg-neutral-200 text-base flex items-center gap-2 cursor-pointer"
                    onClick={deleteHandler}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete Notice
                  </li>
                </ul>
              )}
            </span>
            <p className="text-sm text-neutral-500">
              {dateFormatter(data?.created_at)}
            </p>
          </span>
        </div>
        {/* title */}
        <h3 className="capitalize text-neutral-800 font-semibold text-lg">
          {data?.title}
        </h3>
        {/* body with short */}
        <p className="text-base text-neutral-600 text-ellipsis whitespace-nowrap overflow-hidden">
          {data?.body}
        </p>
        {/* view more button */}
        <div className="flex my-2">
          <button className="px-2 py-1.5 rounded bg-blue-100 hover:bg-blue-300 transition-all ease-linear duration-150 text-sm lg:text-base">
            <Link href={`/${viewLink}/groups/notice/${data?._id}`}>
              Read more
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};
