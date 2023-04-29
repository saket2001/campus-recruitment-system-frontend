import React, { useCallback, useState } from "react";
import fetchData from "../../../helpers/fetchData";
import { Loader } from "../../UI/index";

export const NotificationItem = ({
  data,
  showBody = false,
  showDelete = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteHandler = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchData(`/user/delete-notification/${data?._id}`, {
      method: "DELETE",
    });

    alert(res.message);
    setIsLoading(false);
  });

  if (isLoading) return <Loader />;

  return (
    <div
      key={data?._id}
      className="flex flex-col gap-1 w-full border-l-4 border-blue-700 px-3 py-2 my-1"
    >
      {/* sender and date */}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h2 className="text-base text-neutral-700 font-medium">
            {data?.title}
          </h2>
          <p className="text-sm text-neutral-500">
            {new Date(data?.created_at).toLocaleString()},{" "}
            {/* {new Date(data?.created_at).toLocaleTimeString("IN", {
              hour:'numeric',
              minute: 'numeric'
            })} */}
          </p>
        </div>
        {showDelete && (
          <button
            className="p-2 hover:text-neutral-800 text-neutral-500 cursor-pointer rounded-full"
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
          </button>
        )}
      </div>
      {/* body and icon */}
      {showBody && (
        <div className="flex my-1 items-center justify-between">
          <p className="text-sm text-neutral-600">{data?.body}</p>
        </div>
      )}
    </div>
  );
};
