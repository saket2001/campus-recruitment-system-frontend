import React, { useState, useCallback } from "react";
import { GroupBoard } from "../../../components/Admin/GroupBoard";
import {
  Layout,
  DashboardLayout,
  InputField,
  Loader,
} from "../../../components/UI/index";
import { useFormik } from "formik";
import fetchData from "../../../helpers/fetchData";
import { useQuery } from "react-query";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

////////////////////////////////
export default function index() {
  return <GroupsIndex />;
}

const GroupsIndex = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading2 } = useQuery(["user-group"], async () => {
    return await fetchData(`/user/get-my-group`);
  });

  if (isLoading2) return <Loader />;

  const toggleForm = useCallback(() => {
    setIsFormOpen((prev) => !prev);
  });

  return (
    <Layout showNav={false}>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
      <DashboardLayout authRole={["user"]} pageTitle="User Groups">
        <main className="min-h-screen h-full flex flex-col gap-2 w-full p-3 bg-blue-100">
          {/* heading */}
          <div className="flex justify-between items-center py-3 px-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold lg:text-2xl text-xl text-neutral-800">
                User Group
              </h2>
              <p className="text-neutral-600 text-base">
                Group keeps you informed about latest campus events
              </p>
            </div>

            {/* join group icon */}
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-700 hover:bg-blue-700 hover:text-neutral-100 hover:border-blue-700 transition-all ease-in-out cursor-pointer"
                onClick={toggleForm}
              >
                Join Group
              </button>
            </div>
          </div>
          {/* main */}
          <div
            className={`w-full h-full relative flex flex-wrap gap-3
            `}
          >
            {/* list */}
            {data?.data && (
              <GroupBoard groupsList={data?.data} showExit={true} />
            )}
            {data?.data?.length <= 0 && (
              <div className="flex flex-col gap-2 items-center justify-center w-full p-3">
                <Image
                  src={"/classroom.png"}
                  alt="no classroom image"
                  width={"150%"}
                  height={"150%"}
                />
                <p className="lg:w-1/2 w-4/5 text-base text-neutral-600 text-center">
                  It looks like you haven&apos;t joined any class yet. Enter the
                  class code to join any class and receive important
                  notifications
                </p>
              </div>
            )}
            {/* create form */}
            {isFormOpen && <UserJoinGroup />}
          </div>
        </main>
      </DashboardLayout>
    </Layout>
  );
};

const UserJoinGroup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const notify = useCallback((msg) => toast(msg));
  const groupForm = useFormik({
    initialValues: {
      code: "",
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const res = await fetchData(
          `/user/apply-group`,
          {
            method: "POST",
            body: JSON.stringify(values),
          },
          {
            "Content-type": "application/json",
          }
        );
        setIsLoading(false);
        notify(res.message);
        setStatus(res.message);

        setTimeout(() => {
          window?.location?.reload();
        }, 1000);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    },
  });

  return (
    <form
      onSubmit={groupForm.handleSubmit}
      className="flex flex-col bg-gray-50 shadow-sm rounded-md absolute z-10 top-2 right-0 p-3 lg:w-1/3 w-full h-fit py-5"
    >
      <InputField
        label="Group Code"
        name="code"
        bgColor="bg-gray-100"
        required={true}
        onChange={groupForm.handleChange}
      />
      <button
        className="w-fit bg-blue-700 text-gray-100 px-4 py-2 rounded shadow hover:bg-blue-600 transition-all ease-in flex items-center gap-2 my-2"
        type="submit"
      >
        Join Group
      </button>
      {/* status */}
      {isLoading && <p>Joining the group...</p>}
      {status && <p className="text-neutral-700">{status}</p>}
    </form>
  );
};
