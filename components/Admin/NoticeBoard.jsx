import React, { useCallback, useState } from "react";
import Link from "next/link";
import fetchData from "../../helpers/fetchData";
import { InputField, TextArea } from "../UI";
import { NoticeItem } from "./NoticeItem";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

////////////////////////////////////
export const NoticeBoard = ({
  viewLink = "user",
  groupDetails = undefined,
  noticesArr = [],
  group_id,
  showTabs = true,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const toggleForm = useCallback(() => {
    setIsFormOpen((prev) => !prev);
  });

  return (
    <div className="flex flex-col gap-3 p-2 w-full">
      {/* board header */}
      <div className="p-6 h-1/2 bg-blue-700 text-white rounded-md w-full flex flex-col lg:gap-2 shadow-sm">
        {/* title */}
        <p className="lg:text-3xl text-lg font-medium">{groupDetails?.title}</p>
        <div className="flex flex-wrap gap-3 items-center my-1">
          {/* creator name */}
          <span className="flex gap-2 items-center">
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <p className="text-sm">{groupDetails?.creator_name}</p>
          </span>
          {/* code */}
          <span className="flex gap-2 items-center">
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
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>

            <p className="text-sm">{groupDetails?.code}</p>
          </span>
          {/* date created at */}
          <span className="flex gap-2 items-center">
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
            <p className="text-sm">
              {new Date(groupDetails?.date_created).toDateString()}
            </p>
          </span>
          {/* total members */}
          <Link href={`/${viewLink}/groups/members/${groupDetails?._id}`}>
            <div
              className="flex gap-2 items-center cursor-pointer"
              title="view all members"
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
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              <p className="text-sm">{groupDetails?.members?.length}</p>
            </div>
          </Link>
        </div>
        {/* {navigator?.clipboard?.writeText(data?.code)} */}
      </div>
      {/* board content */}
      <div className="h-full flex flex-col relative">
        <div className="flex items-center justify-between my-2">
          <h2 className="font-semibold lg:text-xl text-lg text-neutral-800 my-1">
            All Notices
          </h2>
          {/* create notice button */}
          {showTabs && (
            <button
              onClick={toggleForm}
              className="px-2 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2 transition-all ease-in"
            >
              New Notice
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex flex-col">
          {noticesArr.length === 0 && (
            <div className="flex flex-col gap-2 text-center justify-center items-center p-4">
              <img
                loading="lazy"
                src={"/icons8-notice.png"}
                alt="Notice board image"
                width={"50px"}
              />
              <h1 className="text-neutral-700">
                It looks like the notice board is empty for now
              </h1>
            </div>
          )}
          {noticesArr.length > 0 && (
            <ul className="grid lg:grid-cols-2 grid-cols-1 gap-3">
              {noticesArr?.map((data) => (
                <NoticeItem
                  viewLink={viewLink}
                  key={data?._id}
                  data={data}
                  showTabs={showTabs}
                />
              ))}
            </ul>
          )}
        </div>
        {/* create form */}
        {isFormOpen && (
          <AdminNoticeForm cancelHandler={toggleForm} group_id={group_id} />
        )}
      </div>
    </div>
  );
};

const AdminNoticeForm = ({ cancelHandler, group_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const notify = useCallback((msg) => toast(msg));
  const groupForm = useFormik({
    initialValues: {
      title: "",
      body: "",
      // isAlertOn: "",
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        values["group_id"] = group_id;

        const res = await fetchData(
          `/admin/create-notice`,
          {
            method: "POST",
            body: JSON.stringify(values),
          },
          {
            "Content-type": "application/json",
          }
        );
        setIsLoading(false);
        notify(res?.message);
        setStatus(res.message);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    },
  });

  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
      <form
        onSubmit={groupForm.handleSubmit}
        className="flex flex-col bg-gray-50 shadow-sm rounded-md absolute top-10 my-4 right-0 z-10 p-3 lg:w-1/2 w-full h-fit py-5"
      >
        <InputField
          label="Title"
          name="title"
          bgColor="bg-gray-100"
          required={true}
          onChange={groupForm.handleChange}
        />
        <TextArea
          label="Content"
          name="body"
          bgColor="bg-gray-100"
          required={true}
          onChange={groupForm.handleChange}
        />
        {/* <label className="text-neutral-700 lg:text-lg text-base font-medium">
        Alert Everyone
      </label> */}
        {/* <div className="flex items-center gap-2">
        <InputField
          name="isAlertOn"
          type="radio"
          value="true"
          bgColor="bg-gray-100 w-fit"
          required={true}
          onChange={groupForm.handleChange}
        />
        Yes
        <InputField
          name="isAlertOn"
          type="radio"
          value="false"
          bgColor="bg-gray-100 w-fit"
          required={true}
          onChange={groupForm.handleChange}
        />
        No
      </div> */}

        <div className="flex items-center justify-center gap-3">
          <button
            className="w-fit bg-blue-700 text-gray-100 px-4 py-2 rounded shadow hover:bg-blue-600 transition-all ease-in flex items-center gap-2 my-2"
            type="submit"
          >
            Create Notice
          </button>
          <button
            className="w-fit text-neutral-700 px-4 py-2 rounded hover:bg-neutral-200 hover:text-neutral-800 transition-all ease-in flex items-center gap-2 my-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
        {/* status */}
        {isLoading && <p>Creating the group...</p>}
        {status && <p className="text-neutral-700">{status}</p>}
      </form>
    </>
  );
};
