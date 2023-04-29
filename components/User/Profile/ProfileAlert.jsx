import React from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import fetchData from "../../../helpers/fetchData";
import { Loader } from "../../UI/index";

export const ProfileAlert = ({ alertLimit = 100 }) => {
  // fetch user profile completion details
  const { data, isLoading } = useQuery({
    queryKey: ["profile-status"],
    queryFn: async () => await fetchData(`/user/profile-status`),
  }, {
    staleTime: 1000000,
    cacheTime:100000,
  });

  if (isLoading) return <Loader />;

  if (data?.data >= alertLimit) {
    return "";
  }

  const text =
    data?.data < 100 ? (
      <>
        Your basic profile details is {data?.data + "%" || "0%"} complete.
        <Link href={"/user/profile/edit"}>
          <p className="underline inline pl-1 cursor-pointer">Click here</p>
        </Link>{" "}
        to complete it to apply to various job easily
      </>
    ) : (
      <>Your basic profile details is {data?.data + "%" || "0%"} complete.</>
    );

  return (
    <div
      className={`flex gap-2 items-center px-4 py-3 rounded-md shadow m-2 ${
        +data?.data < 100 ? "bg-red-700" : "bg-blue-700"
      }`}
    >
      {+data?.data < 100 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}

      <h1 className="text-neutral-100 font-normal text-base">{text}</h1>
    </div>
  );
};
