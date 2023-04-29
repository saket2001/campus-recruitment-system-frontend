import React, { useEffect } from "react";
import { useState } from "react";
import { useScreenSize } from "../../../hooks/useScreenSize";
import { SideBar } from "../SideBar/SideBar";
import { DashboardHeader } from "./DashboardHeader";
import { useSelector } from "react-redux";
import { NoAuthPage } from "../AuthPages/NoAuthPage";
import { NoRolePage } from "../AuthPages/NoRolePage";
import ROLES_LIST from "../../../constants/roles_list";
import { useSession } from "../../../hooks/useSession";
import Head from "next/head";
import { socketIoOperations } from "../../../helpers/socketOperation";

export const DashboardLayout = ({ children, authRole = null,pageTitle }) => {
  useSession();
  const { isLoggedIn} = useSelector((state) => state.auth);
  const screenSize = useScreenSize();
  const [showSideBar, setShowSideBar] = useState(false);
  const code =  globalThis.window?.sessionStorage.getItem('code');
  const user_id =  globalThis.window?.sessionStorage.getItem('user_id');

  useEffect(() => {
    // connecting to socket on server
    socketIoOperations.emitFn("user-login", {
      user_id: user_id,
      role: code,
    });
  })

  if (!isLoggedIn) return <NoAuthPage />;

  // if (ROLES_LIST[code] !== authRole) return <NoRolePage />;
  if (!Array.from(authRole)?.includes(ROLES_LIST[code])) return <NoRolePage />;

  const toggleSideBar = () => {
    setShowSideBar((prev) => !prev);
  };

  return (
    <div className="flex lg:flex-row flex-col min-w-screen relative z-0 bg-blue-800">
      {/* mobile nav or header */}
      {/* only shown in mobile layout */}
      {screenSize <= 600 && (
        <DashboardHeader toggleSideBar={toggleSideBar} />
      )}
      {showSideBar && screenSize <= 600 && (
        <SideBar toggleSideBar={toggleSideBar} />
      )}

      {/* for large screens */}
      {screenSize >= 600 && (
        <div className="lg:w-1/5 w-full">
          <SideBar toggleSideBar={toggleSideBar} />
        </div>
      )}

      <div className="min-h-screen max-w-full w-full h-full overflow-hidden bg-blue-100 lg:rounded-tl-3xl">
        <Head>
          <title>Virtual Campus Recruitment | {pageTitle} </title>
          <link rel="icon" href="/favicon.ico" />
          <meta httpEquiv="content-language" content="en" />
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          ></meta>
        </Head>
        {children}
      </div>
    </div>
  );
};
