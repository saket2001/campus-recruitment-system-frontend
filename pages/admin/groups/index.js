import React, { useCallback, useState } from "react";
import { GroupBoard } from "../../../components/Admin/GroupBoard";
import {
  DashboardLayout,
  InputField,
  Layout,
  Loader,
} from "../../../components/UI";
import { useFormik } from "formik";
import { useQuery } from "react-query";
import fetchData from "../../../helpers/fetchData";
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

////////////////////////////////
export default function index() {
  return <AdminGroupIndex />;
}

const AdminGroupIndex = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-groups"],
    queryFn: async () => {
      return await fetchData(`/admin/my-groups`);
    },
  });

  const toggleForm = useCallback(() => {
    setIsFormOpen((prev) => !prev);
  });
  
   if (isLoading) return <Loader />;

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["admin"]} pageTitle="Admin Groups">
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          {/* head */}
          <div className="w-full flex justify-between items-center gap-2">
            <h2 className="flex flex-col font-semibold lg:text-2xl text-xl text-gray-900">
              Admin Groups
            </h2>
            {/* create group button */}
            <button
              onClick={toggleForm}
              className="p-2 rounded-full hover:bg-slate-300"
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
          <div className="w-full h-full relative flex flex-wrap gap-3">
            {/* list */}
            {data?.data?.length > 0 && (
              <GroupBoard
                title={"All Groups"}
                groupsList={data?.data}
                showDelete={true}
                viewLink="admin"
              />
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
                  It looks like you haven&apos;t created any class yet. Create
                  classes and arrange candidates so they can join class and
                  receive important notifications
                </p>
              </div>
            )}
            {/* create form */}
            {isFormOpen && <AdminCreateGroup />}
          </div>
        </main>
      </DashboardLayout>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
    </Layout>
  );
};

const AdminCreateGroup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const notify = useCallback((msg) => toast(msg));

  const groupForm = useFormik({
    initialValues: {
      title: "",
      year: "",
      creator_name: "",
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        console.log(values);
        const res = await fetchData(
          `/admin/create-group`,
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
        notify("Something went wrong!");
      }
    },
  });

  return (
    <form
      onSubmit={groupForm.handleSubmit}
      className="flex flex-col bg-gray-50 shadow-sm rounded-md absolute z-10 top-2 right-0 p-3 lg:w-1/3 w-full h-fit py-5"
    >
      <InputField
        label="Group Title"
        name="title"
        bgColor="bg-gray-100"
        required={true}
        onChange={groupForm.handleChange}
      />
      <InputField
        label="Group year"
        name="year"
        type="number"
        placeholder="YYYY"
        bgColor="bg-gray-100"
        required={true}
        onChange={groupForm.handleChange}
      />
      <InputField
        label="Creator Name"
        name="creator_name"
        type="type"
        bgColor="bg-gray-100"
        required={true}
        onChange={groupForm.handleChange}
      />
      <button
        className="w-fit bg-blue-700 text-gray-100 px-4 py-2 rounded shadow hover:bg-blue-600 transition-all ease-in flex items-center gap-2 my-2"
        type="submit"
      >
        Create Group
      </button>
      {/* status */}
      {isLoading && <p>Creating the group...</p>}
      {status && <p className="text-neutral-700">{status}</p>}
    </form>
  );
};
