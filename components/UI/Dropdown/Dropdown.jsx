import Link from "next/link";
import React from "react";
import { useRef } from "react";

const dropdownListStyle =
  "hidden bg-gray-50 text-base z-50 divide-y divide-gray-700 rounded shadow-lg my-1 absolute flex-col gap-1 h-auto text-left border";

export const Dropdown = ({
  label,
  linksArr,
  dropdownBtnStyle = "",
  dropdownStyle,
  isActive,
}) => {
  const dropdownList = useRef();
  const linkHandler = (e) => {
    const div = dropdownList.current;
    div.classList.toggle("hidden");
  };
  return (
    <>
      <button
        type="button"
        data-dropdown-toggle="dropdown"
        onClick={linkHandler}
        className={`lg:text-base text-base px-2 lg:py-2 py-1 text-center inline-flex items-center ${dropdownBtnStyle} ${
          isActive ? "text-blue-800 border-b-2 border-blue-800" : "text-gray-700"
        }`}
      >
        {label}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <div
        id="dropdown"
        aria-labelledby="dropdown"
        ref={dropdownList}
        className={dropdownStyle ? dropdownStyle : dropdownListStyle}
      >
        <ul className="p-3">
          {linksArr?.map((link, i) => (
            <li key={i} className="p-1 my-1 list-none">
              <Link href={link?.href}>
                <a className="px-2 text-base text-gray-500 hover:text-gray-800 font-normal duration-200 transition-all">
                  {link.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
