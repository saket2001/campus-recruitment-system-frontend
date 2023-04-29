import React, { useState } from "react";
import { InputField } from "../../UI/InputField/InputField";
import { useFormik } from "formik";
import fetchData from "../../../helpers/fetchData";

export const AccountSettings = () => {
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);

  const editPassForm = useFormik({
    initialValues: {
      new_pass: "",
    },
    onSubmit: async (values) => {
      console.log({ values });
      const data = await fetchData(
        "/user/change-pass",
        { method: "POST", body: JSON.stringify(values) },
        { "Content-Type": "application/json" }
      );
      console.log(data);

      setPasswordStatus(data?.message);
    },
  });

  const deleteAccForm = useFormik({
    initialValues: {
      user_pass: "",
    },
    onSubmit: async (values) => {
      const data = await fetchData(
        "/user/profile/delete",
        {
          method: "DELETE",
          body: JSON.stringify(values),
        },
        { "Content-Type": "application/json" }
      );
      console.log(data);
      setDeleteStatus(data?.message);

      if (!data?.isError)
        setTimeout(() => {
          // clear session
          window?.sessionStorage.clear()
          window?.location?.replace("/");
        }, 1500);
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-medium text-lg lg:text-xl capitalize">
        Account Settings
      </h2>
      <form
        className="w-4/5 flex flex-col gap-2"
        onSubmit={editPassForm.handleSubmit}
      >
        {/* change password */}
        <div className="border-b border-gray-400 py-3">
          <h3 className="font-medium text-gray-800 mb-2 text-lg">
            Change Password
          </h3>
          <InputField
            label="New Password"
            bgColor="bg-gray-200"
            onChange={editPassForm.handleChange}
            name="new_pass"
            required={true}
          />
          <button
            type="submit"
            className="bg-blue-800 text-gray-100 px-3 py-1.5 rounded-md shadow-md hover:bg-blue-700 transition-all ease-in w-fit"
          >
            Save Password
          </button>
          {passwordStatus && (
            <p className="py-2 mt-2 font-medium text-gray-700">
              {passwordStatus}
            </p>
          )}
        </div>
      </form>
      {/* delete account */}
      <form
        className="w-4/5 flex flex-col gap-2"
        onSubmit={deleteAccForm.handleSubmit}
      >
        <h3 className="font-medium text-gray-800 text-lg">Delete Account</h3>
        <InputField
          label="Password"
          bgColor="bg-gray-200"
          onChange={deleteAccForm.handleChange}
          name="user_pass"
          required={true}
        />
        <button
          type="submit"
          className="border-2 border-red-700 text-red-700 px-3 py-1.5 rounded-md shadow-md font-medium hover:bg-red-700 hover:text-gray-100 transition-all ease-in w-fit"
        >
          Delete Account
        </button>
        {deleteStatus && (
          <p className="py-2 mt-2 font-medium text-gray-700">{deleteStatus}</p>
        )}
      </form>
      {/* //!TODO Add toggle settings */}
      {/* more settings */}
    </div>
  );
};
