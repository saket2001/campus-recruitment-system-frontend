import Image from 'next/image'
import React from 'react'

export const DashboardHeader = ({ toggleSideBar }) => {
  return (
    <div className="lg:hidden w-full flex justify-between p-3 items-center bg-gray-200">
      <img
        src={"/main-logo.svg"}
        className="mr-3 lg:h-8 h-6"
        alt="Campus Recruiter Logo"
      />
      <span onClick={() => toggleSideBar()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M3 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 5.25zm0 4.5A.75.75 0 013.75 9h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9.75zm0 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}
