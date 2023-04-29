import Link from "next/link";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { NotificationList } from "./NotificationList";
import { socket } from "../../../helpers/socketOperation";
import { useQuery } from "react-query";
import fetchData from "../../../helpers/fetchData";
import { Loader } from "../../UI/index";
// import { requestAndShowPermission } from "../../../helpers/PushNotification";

// with openable div
export const NotificationIconAndDiv = () => {
  const [showBoard, setShowBoard] = useState(false);
  const [socketData, setSocketData] = useState([]);
  const [allNotificationsData, setAllNotificationsData] = useState([]);

  socket.on("application-update", (...data) => {
    setSocketData(data);
    // show push notification
    // requestAndShowPermission({ title: "Sample", body: data?.body });
  });

  socket.on("new-job", (...data) => {
    setSocketData(data);
  });

  socket.on("new-notice", (...data) => {
    setSocketData(data);
  });

  let { data, isLoading } = useQuery(
    {
      queryKey: ["user-notifications"],
      queryFn: async () => {
        const res = await fetchData(`/user/get-notifications`);
        return res?.data;
      },
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  useEffect(() => {
    // filtering data
    if (socketData) {
      const s = new Set(socketData);
      if (s.size === socketData?.length) {
        setAllNotificationsData((prev) => [...s, ...prev]);
      }
    }
  }, [socketData]);

  useEffect(() => {
    // filtering data
    if (data) {
      const today = data.filter(
        (d) =>
          new Date(d.created_at).toLocaleDateString() ===
            new Date().toLocaleDateString() && d?.status !== "seen"
      );

      setAllNotificationsData((prev) => {
        const unique = new Set([...prev, ...today]);
        return Array.from(unique);
      });
    }
  }, [data]);

  console.log(allNotificationsData);

  const newNotificationCount = useMemo(() => {
    return allNotificationsData?.filter(
      (d) =>
        new Date(d.created_at).toLocaleDateString() ===
          new Date().toLocaleDateString() && d?.status !== "seen"
    );
  }, [allNotificationsData]);

  const updateNotificationStatus = useCallback(async () => {
    const res = await fetchData(
      "/user/change-notification-status",
      {
        method: "POST",
        body: JSON.stringify({
          notifications: allNotificationsData?.map((d) => d?._id),
        }),
      },
      { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    );

    if (!res.isError) {
      console.log(res);
      const newData = await fetchData(`/user/get-notifications`);
      setAllNotificationsData(newData?.data);
    }
  });

  if (isLoading) return <Loader />;

  return (
    <div className="flex relative w-full justify-end gap-2">
      <div className="flex relative">
        <button
          onClick={() => {
            setShowBoard((prev) => !prev);
            !showBoard && updateNotificationStatus();
          }}
          className="p-2 rounded-full relative hover:bg-neutral-300 transition-all ease-in cursor-pointer self-end"
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
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
        </button>
        {newNotificationCount?.length > 0 && (
          <span className="flex absolute left-6 self-start py-1 px-2 bg-blue-700 text-neutral-100 rounded-full text-xs">
            {newNotificationCount?.length}
          </span>
        )}
      </div>
      {/* notification board */}
      {showBoard && (
        <div className="absolute top-10 right-0 w-full bg-white p-4 rounded shadow">
          <h1 className="text-lg text-neutral-700 my-2 font-medium">
            New Notifications
            <span className="text-sm mx-2 hover:underline text-neutral-500">
              <Link href={"/user/notifications"}>(View all)</Link>
            </span>
          </h1>
          <NotificationList
            data={allNotificationsData?.filter(
              (d) =>
                new Date(d.created_at).toLocaleDateString() ===
                new Date().toLocaleDateString()
            )}
          />
        </div>
      )}
    </div>
  );
};
