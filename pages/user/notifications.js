import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  DashboardLayout,
  BackButton,
  Loader,
} from "../../components/UI/index";
import fetchData from "../../helpers/fetchData";
import { NotificationList } from "../../components/User/Notification/NotificationList";
import { useQuery } from "react-query";
import { socket } from "../../helpers/socketOperation";
/////////////////////////////
export default function notifications() {
  return <UserNotificationPage />;
}

const UserNotificationPage = () => {
  const [socketData, setSocketData] = useState(null);
  const [todaysNotifications, setTodaysNotification] = useState([]);
  const [oldNotifications, setOldNotification] = useState([]);

  socket.on("application-update", (...data) => {
    setSocketData(data);
  });

  const { data: dbNotifications, isLoading } = useQuery(
    {
      queryKey: ["user-notifications"],
      queryFn: async () => {
        const res = await fetchData(`/user/get-notifications`);
        return res?.data;
      },
    },
    {
      cacheTime: 100000,
      staleTime: 100000,
    }
  );

  useEffect(() => {
    const separateNotifications = () => {
      let allNotifications = [];
      let today = [];
      let old = [];

      if (dbNotifications && dbNotifications !== undefined) {
        allNotifications = [...dbNotifications];
      }
      if (socketData && socketData !== undefined) {
        allNotifications = [...socketData, ...allNotifications];
      }
      // calc
      allNotifications?.forEach((d) => {
        if (
          new Date(d?.created_at).toLocaleDateString() ==
          new Date().toLocaleDateString()
        ) {
          today.push(d);
        } else old.push(d);
      });

      setTodaysNotification(today);
      setOldNotification(old);
    };

    separateNotifications();
  }, [socketData, dbNotifications]);

  if (isLoading) return <Loader />;

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["user"]} pageTitle="User Notifications">
        <main className="min-h-screen h-full flex flex-col gap-4 w-full p-3 bg-blue-100">
          {/* heading */}
          <div className="flex gap-2 items-center py-3 px-4">
            <BackButton />
            <h2 className="flex flex-col font-semibold lg:text-2xl text-xl text-neutral-800">
              All Notifications
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {/* today */}

            <div className="w-full px-3 flex flex-col gap-2">
              <h3 className="flex flex-col font-semibold lg:text-2xl text-xl text-neutral-700">
                Today
              </h3>
              <div className="rounded-md bg-white p-6">
                <NotificationList
                  showBody={true}
                  showDelete={true}
                  data={todaysNotifications}
                />
              </div>
            </div>
            {/* all notifications */}

            <div className="w-full px-3 flex flex-col gap-2">
              <h3 className="flex flex-col font-semibold lg:text-2xl text-xl text-neutral-700">
                Old Notifications
              </h3>
              <div className="rounded-md bg-white p-6">
                <NotificationList
                  showBody={true}
                  showDelete={true}
                  data={oldNotifications}
                />
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    </Layout>
  );
};
