import React, { useState,useCallback } from "react";
import {
  Layout,
  DashboardLayout,
  BackButton,
  Loader,
  TextArea,
  InputField,
} from "../../../../components/UI/index";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";
import fetchData from "../../../../helpers/fetchData";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditNotice() {
  return <EditNoticeComponent />;
}

const EditNoticeComponent = () => {
  const router = useRouter();
  const { notice_id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const notify = useCallback((msg) => toast(msg));

  const editNoticeForm = useFormik({
    initialValues: {
      title: "",
      body: "",
      isAlertOn: "",
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        // values["group_id"] = group_id;
        const res = await fetchData(
          `/admin/edit-notice/${notice_id}`,
          {
            method: "PUT",
            body: JSON.stringify(values),
          },
          {
            "Content-type": "application/json",
          }
        );
        setIsLoading(false);
        notify(res?.message)
        setStatus(res.message);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setIsLoading(false);
        notify("Failed to edit the notice!");
      }
    },
  });

  const { data: formData, isError } = useQuery({
    enabled: notice_id !== undefined,
    queryKey: ["notice", notice_id],
    queryFn: async () => {
      const res = await fetchData(`/get-notice/${notice_id}`);
      // mapping
      for (const key in res.data) {
        editNoticeForm["values"][key] = res?.data[key];
      }
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["admin"]} pageTitle={"Edit Notice"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          {/* heading */}
          <div className="w-full flex gap-3">
            <BackButton />
            <h2 className="flex flex-col font-semibold lg:text-2xl text-xl text-neutral-900">
              Edit Notice
            </h2>
          </div>
          {/* form */}
          <div className="flex w-full">
            <form
              onSubmit={editNoticeForm.handleSubmit}
              className="flex flex-col bg-gray-50 shadow-sm rounded-md  my-4 p-3 lg:w-1/2 w-full py-5"
            >
              <InputField
                label="Title"
                name="title"
                bgColor="bg-gray-100"
                required={true}
                onChange={editNoticeForm.handleChange}
                value={editNoticeForm?.values?.title}
              />
              <TextArea
                label="Content"
                name="body"
                bgColor="bg-gray-100"
                required={true}
                value={editNoticeForm?.values?.body}
                onChange={editNoticeForm.handleChange}
              />
              <button
                className="w-fit bg-blue-700 text-gray-100 px-4 py-2 rounded shadow hover:bg-blue-600 transition-all ease-in flex items-center gap-2 my-2"
                type="submit"
              >
                Edit Notice
              </button>
              {/* status */}
              {isLoading && <p>Editing the notice...</p>}
              {status && <p className="text-neutral-700">{status}</p>}
            </form>
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
