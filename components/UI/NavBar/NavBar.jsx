import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown } from "../Dropdown/Dropdown";
import logo from "../../../public/main-logo.svg";

const linkDivClass = "mx-1 my-2 lg:py-0 py-1 text-center list-none text-base";
const activeLinkClass =
  "p-2 mx-1 my-2 text-blue-800 font-semibold lg:text-base sm:text-base text-center list-none border-b-2 border-blue-800";
const unActiveLinkClass =
  `p-2 hover:text-blue-700 lg:text-base sm:text-base text-center text-neutral-700 font-medium list-none`;
const splClass =
  "w-100 py-3 px-6 mx-1 my-2 hover:bg-blue-900 lg:text-base text-lg text-center bg-blue-700 text-gray-100 rounded-md list-none";

const companyLinksArr = [
  { name: "Company Registration", href: "/auth/company/register" },
  { name: "Recruiter Sign in", href: "/auth/recruiter/sign-in" },
  { name: "Recruiter Registration", href: "/auth/recruiter/register" },
];

export const NavBar = ({
  showAuth = true,
  bgColor = "bg-white",
  textColor = "text-neutral-700",
}) => {
  const router = useRouter();
  const activeLink = router.route;
  const [menuState, setMenuState] = useState();
  const [screenSize, setScreenSize] = useState();

  useEffect(() => {
    // window.addEventListener("resize", () => {
    const screenSize = window && window.screen.availWidth;
    setScreenSize(screenSize);
    // });
  });

  const toggleMenuHandler = () => {
    setMenuState((prev) => !prev);
  };

  return (
    <>
      <div
        className={`py-3 w-full flex justify-between items-center lg:px-4 ${bgColor}`}
      >
        <div className="flex flex-col items-center hover:cursor-pointer">
          <Link href={"/"}>
            <img
              src={logo.src}
              className="mr-3 lg:h-8 h-6"
              alt="Campus Recruiter Logo"
            />
          </Link>
        </div>

        {/* large screens */}
        <NavbarLarge activeLink={activeLink} showAuth={showAuth} />

        {/* button */}
        <div className="lg:hidden flex">
          <button type="button" onClick={toggleMenuHandler}>
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* small screens */}
      {menuState && screenSize < 900 && (
        <>
          <div className="lg:hidden w-full py-3 flex flex-col justify-around px-4 z-10 absolute bg-blue-100">
            {menuState && (
              <NavBarSmall activeLink={activeLink} showAuth={showAuth} />
            )}
          </div>
          <div className="lg:hidden min-h-screen min-w-screen z-10 bg-slate-500 opacity-60"></div>
        </>
      )}
    </>
  );
};

const NavbarLarge = ({ activeLink, showAuth }) => {
  return (
    <>
      <ul className="hidden lg:flex items-center gap-5 px-4">
        <li className={linkDivClass}>
          <Link href="/">
            <a
              className={
                activeLink === "/" ? activeLinkClass : unActiveLinkClass
              }
            >
              Home
            </a>
          </Link>
        </li>
        <li className={linkDivClass}>
          <Link href="/about">
            <a
              className={
                activeLink === "/about" ? activeLinkClass : unActiveLinkClass
              }
            >
              About Us
            </a>
          </Link>
        </li>
        {/* <li className={unActiveLinkClass}>
          <Dropdown
            isActive={
              activeLink.split("/").includes("recruiter") ||
              activeLink.split("/").includes("company")
            }
            label="Company"
            linksArr={companyLinksArr}
          />
        </li> */}
        <li className={linkDivClass}>
          <Link href="/contact-us">
            <a
              className={
                activeLink === "/contact-us"
                  ? activeLinkClass
                  : unActiveLinkClass
              }
            >
              Contact Us
            </a>
          </Link>
        </li>
      </ul>
      {/* dynamic content */}
      {showAuth ? (
        <ul className="hidden lg:flex items-center gap-6 px-4">
          <li className={linkDivClass}>
            <Link href="/auth/user/sign-in">
              <a
                className={
                  activeLink === "/auth/user/sign-in"
                    ? activeLinkClass
                    : unActiveLinkClass
                }
              >
                Sign In
              </a>
            </Link>
          </li>
          <li className={linkDivClass}>
            <Link href="/auth/user/register">
              <a className={splClass}>Create Account</a>
            </Link>
          </li>
        </ul>
      ) : (
        " "
      )}
    </>
  );
};

const NavBarSmall = ({ activeLink, showAuth }) => {
  return (
    <div className="flex flex-col py-5 bg-blue-100">
      <ul className="lg:hidden flex flex-col justify-center gap-3">
        <li className={unActiveLinkClass}>
          <Link href="/">
            <a
              className={
                activeLink === "/" ? activeLinkClass : unActiveLinkClass
              }
            >
              Home
            </a>
          </Link>
        </li>
        <li className={unActiveLinkClass}>
          <Link href="/about">
            <a
              className={
                activeLink === "/about" ? activeLinkClass : unActiveLinkClass
              }
            >
              About Us
            </a>
          </Link>
        </li>
        <li className={unActiveLinkClass}>
          <Dropdown
            isActive={
              activeLink.split("/").includes("recruiter") ||
              activeLink.split("/").includes("company")
            }
            label="Company"
            linksArr={companyLinksArr}
          />
        </li>
        <li className={unActiveLinkClass}>
          <Link href="/contact-us">
            <a
              className={
                activeLink === "/contact-us"
                  ? activeLinkClass
                  : unActiveLinkClass
              }
            >
              Contact Us
            </a>
          </Link>
        </li>
      </ul>
      {/* dynamic content */}
      {showAuth ? (
        <ul className="lg:hidden flex flex-col items-center gap-2 px-4">
          <li className={linkDivClass}>
            <Link href="/auth/user/sign-in">
              <a
                className={
                  activeLink === "/auth/user/sign-in"
                    ? activeLinkClass
                    : unActiveLinkClass
                }
              >
                Sign In
              </a>
            </Link>
          </li>
          <li className={linkDivClass}>
            <Link href="/auth/user/register">
              <a
                className={
                  "w-100 py-2 px-3 mx-1 my-2 hover:bg-blue-900 lg:text-base text-lg text-center bg-blue-700 text-gray-100 rounded-md "
                }
              >
                Create Account
              </a>
            </Link>
          </li>
        </ul>
      ) : (
        ""
      )}
    </div>
  );
};
