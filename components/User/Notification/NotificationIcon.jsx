import Link from "next/link";
import React, { useState, useEffect } from "react";
import { socket } from "../../../helpers/socketOperation";
import { useQuery } from "react-query";
import fetchData from "../../../helpers/fetchData";
import { Loader } from "../../UI/index";
///////////////////////////////////
export const NotificationIcon = () => {
  const [showBoard, setShowBoard] = useState(false);
  const [socketData, setSocketData] = useState(null);
  const [notificationsData, setNotificationsData] = useState(null);
  socket.on("application-update", (...data) => {
    setSocketData(data);
  });
  socket.on("resume-parsed", (...data) => {
    setSocketData(data);
  });

  // console.log(notificationsData);

  let { data, isLoading } = useQuery(
    {
      queryKey: ["user-notifications"],
      queryFn: async () => {
        const res = await fetchData(`/user/get-notifications`);
        setNotificationsData(res.data);
      },
    },
    {
      staleTime: 500,
      refetchInterval: 100,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnMount: true,
    }
  );

  useEffect(() => {
    if (socketData) setNotificationsData((prev) => [...socketData, ...prev]);
  }, [socketData]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex relative w-full justify-end gap-2">
      <Link href={"/user/notifications"}>
        <div className="flex relative">
          <button className="p-2 rounded-full relative hover:bg-neutral-300 transition-all ease-in cursor-pointer self-end">
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
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </button>
          {notificationsData?.length > 0 && (
            <span className="flex absolute left-6 self-start py-1 px-2 bg-blue-700 text-neutral-100 rounded-full text-xs">
              {notificationsData?.length}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};
