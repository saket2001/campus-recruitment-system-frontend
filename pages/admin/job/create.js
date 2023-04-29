import React, { useCallback, useState } from "react";
import {
  Layout,
  DashboardLayout,
  InputField,
  TextArea,
} from "../../../components/UI/index";
import { useFormik } from "formik";
import fetchData from "../../../helpers/fetchData";
import MarkdownEditor from "../../../components/UI/job/MarkdownEditor";
import { v4 as uuid4 } from "uuid";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
////////////////////////////////////////

const jobCategories = [
  "web development",
  "data science",
  "frontend",
  "backend",
  "full stack",
  "ai/ml engineer",
  "software developer",
  "app development",
  "business analyst",
  "administrator",
  "manager",
  "administration",
  "human resource",
  "consultant",
  "support",
  "others",
];

////////////////////////////////////////
export default function Create() {
  const router = useRouter();
  const jobStageNameRef = React.createRef();
  const jobStageDateRef = React.createRef();
  const additionalQuestionsRef = React.createRef();
  const [formState, setFormState] = useState("part 1");
  const [formCompleted, setFormCompleted] = useState(0);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState(null);
  const [requirement, setRequirement] = useState(null);

  const notify = useCallback((msg) => toast(msg));

  const jobPostForm = useFormik({
    initialValues: {
      role: "",
      location: "",
      mode: "",
      total_hiring: "",
      contact_email: "",
      contact_number: "",
      salary: "",
      last_date: "",
      company_name: "",
      company_description: "",
      job_stages: [],
      skills: "",
      category: "",
      additional_questions:[],
    },
    validate: (values) => {
      let errors = {};
      for (const key in values) {
        switch (key) {
          case "contact_number":
            if (
              values[key].toString().length < 10 ||
              values[key].toString().length > 10
            )
              errors.contact_number = "Please enter a valid contact number";
            break;
        }
      }
      return errors;
    },
  });

  const addDetail = useCallback(() => {
    if (jobStageNameRef.current.value.length > 0) {
      jobPostForm.values["job_stages"]?.push({
        id: uuid4(),
        name: jobStageNameRef.current.value,
        date: jobStageDateRef.current.value,
        data: [],
      });
      // clearing input
      jobStageNameRef.current.value = "";
      jobStageDateRef.current.value = "";
    }
    if (additionalQuestionsRef.current.value.length > 0) {
      jobPostForm.values.additional_questions?.push({
        qid: uuid4(),
        question: additionalQuestionsRef.current.value,
      });
      // clearing input
      additionalQuestionsRef.current.value = "";
    }
  });

  const removeDetail = useCallback((id,type) => {
    if (id && type === 'job_stage') {
      jobPostForm.values.job_stages = jobPostForm.values.job_stages?.filter(
        (d) => d.id !== id
      );
    }
    if (id && type === 'additional_question') {
      jobPostForm.values.additional_questions =
        jobPostForm.values.additional_questions?.filter((d) => d.qid !== id);
    }
  });

  const submitHandler = async (values) => {
    values["description"] = description;
    values["requirements"] = requirement;
    console.log(values);

    // posting data to db
    let data = await fetchData(
      "/admin/create-job",
      { method: "POST", body: JSON.stringify(values) },
      {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    );

    // posting file to db if any
    if (file) {
      const formData = new FormData();
      formData.append("details_file", file);
      formData.append("job_id", data.data);

      const response = await fetchData(
        "/admin/upload-job-file",
        { method: "POST", body: formData },
        { "Access-Control-Allow-Origin": "*" }
      );

      notify(response?.message);
    } else {
      notify(data?.message);
    }
    notify(data?.message);
    router.push("/admin/job");
  };

  // func for form nav controller
  const formChecker = (val) => {
    if (val === "part 1" && formCompleted === 50) return setFormState("part 1");

    // putting required values in arr
    let data = [];
    for (const key in jobPostForm["values"]) {
      if (formState === "part 1") {
        if (
          key === "description" ||
          key === "requirements" ||
          key === "company_name" ||
          key === "company_description" ||
          key === "skills"
        )
          continue;
        data.push(jobPostForm.values[key]);
      }
      if (formState === "part 2") {
        data.push(jobPostForm.values[key]);
      }
    }

    const isFormFilled = data.map((d) => d !== "").every((d) => d === true);
    console.log(data.map((d) => d));

    // if everything is filled then go next part
    if (formState === "part 1" && isFormFilled) {
      setFormCompleted(50);
      setFormState(val);
    } else if (formState === "part 2" && isFormFilled) {
      setFormCompleted(100);
      setFormState(val);
    } else {
      setFormCompleted(0);
    }
  };

  return (
    <Layout showNav={false}>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
      <DashboardLayout authRole={["admin"]} pageTitle={"Create Job"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center">
          {/* heading */}
          <h2 className="flex flex-col font-semibold lg:text-2xl text-xl text-neutral-800">
            Create Job Form
          </h2>
          {/* form controller */}
          <div className="lg:w-fit w-full flex justify-center py-2 my-3">
            {/* circle */}
            <div className="flex flex-col items-center mt-2">
              <div
                className={`${
                  formCompleted === 50 ? "bg-blue-700" : "bg-gray-400"
                } p-4 rounded-full w-10 h-10`}
                onClick={() => formChecker("part 1")}
              ></div>
              <p className="text-gray-700 lg:text-base text-sm">Part 1</p>
            </div>
            {/* line */}
            <div
              className={`${
                formCompleted === 50 ? "bg-blue-700" : "bg-gray-400"
              } h-1 lg:w-40 w-20 mx-1 mb-2 self-center`}
            ></div>
            {/* circle */}
            <div className="flex flex-col items-center mt-2">
              <div
                className={`${
                  formCompleted === 100 ? "bg-blue-700" : "bg-gray-400"
                } p-4 rounded-full w-10 h-10`}
                onClick={() => formChecker("part 2")}
              ></div>
              <p className="text-gray-700 text-base">Part 2</p>
            </div>
          </div>
          {/* form */}
          <form
            onSubmit={jobPostForm.handleSubmit}
            className="lg:w-3/4 w-full mx-2 flex flex-col gap-2 py-4 px-2 bg-gray-100 rounded-md shadow"
          >
            {/* basic details */}
            {formState === "part 1" && (
              <div className="flex flex-col gap-3 p-4">
                {/* role and location */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <InputField
                    label="Role"
                    bgColor="bg-gray-200"
                    name="role"
                    required={true}
                    onChange={jobPostForm.handleChange}
                    value={jobPostForm.values.role}
                  />

                  <InputField
                    label="Job Location"
                    bgColor="bg-gray-200"
                    name="location"
                    required={true}
                    onChange={jobPostForm.handleChange}
                    value={jobPostForm.values.location}
                  />
                </div>
                {/* mode and total hiring */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <InputField
                    label="Mode"
                    bgColor="bg-gray-200"
                    name="mode"
                    required={true}
                    onChange={jobPostForm.handleChange}
                    value={jobPostForm.values.mode}
                  />

                  <InputField
                    type="number"
                    label="Total hiring"
                    bgColor="bg-gray-200"
                    name="total_hiring"
                    onChange={jobPostForm.handleChange}
                    value={jobPostForm.values.total_hiring}
                  />
                </div>
                {/* contact email and contact number */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <InputField
                    type="email"
                    label="Contact Email"
                    bgColor="bg-gray-200"
                    name="contact_email"
                    required={true}
                    onChange={jobPostForm.handleChange}
                    value={jobPostForm.values.contact_email}
                  />
                  <InputField
                    type="number"
                    label="Contact Number"
                    bgColor="bg-gray-200"
                    name="contact_number"
                    required={true}
                    onChange={jobPostForm.handleChange}
                    value={jobPostForm.values.contact_number}
                    onBlur={jobPostForm.handleBlur}
                    error={jobPostForm.errors.contact_number}
                    didTouched={jobPostForm.touched.contact_number}
                  />
                </div>
                {/* salary and last date to register */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1">
                    <InputField
                      label="Salary"
                      bgColor="bg-gray-200"
                      name="salary"
                      required={true}
                      onChange={jobPostForm.handleChange}
                      value={jobPostForm.values.salary}
                    />
                    <p className="text-base text-neutral-500">
                      Example 450000, 360000, or 400000-600000
                    </p>
                  </div>

                  <InputField
                    type="date"
                    label="Form closes on"
                    bgColor="bg-gray-200"
                    name="last_date"
                    required={true}
                    onChange={jobPostForm.handleChange}
                    value={jobPostForm.values.last_date}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="category"
                      className="text-neutral-700 lg:text-lg text-base font-medium"
                    >
                      Job category
                    </label>
                    <select
                      className={`border border-neutral-300 rounded-md focus:shadow-md transition-all ease-in w-full lg:text-lg text-base py-1 px-2 bg-gray-200 capitalize`}
                      id="category"
                      name="category"
                      required={true}
                      onChange={jobPostForm.handleChange}
                      value={jobPostForm.values.category}
                    >
                      <option value={""}>select any one category</option>
                      {jobCategories.map((opt) => (
                        <option value={opt} className="capitalize">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full flex justify-center my-3">
                  <button
                    type="button"
                    className="w-fit bg-blue-700 text-gray-100 px-4 py-2 rounded shadow hover:bg-blue-600 transition-all ease-in flex items-center gap-2"
                    onClick={() => formChecker("part 2")}
                  >
                    Next
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
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* additional details */}
            {formState === "part 2" && (
              <div className="flex flex-col gap-3 p-4">
                <h3 className="text-gray-600 font-medium">
                  Here you can add details about description and requirements or
                  upload a pdf file containing both.
                </h3>
                {/* company name */}
                <InputField
                  type="text"
                  label="Company Name"
                  bgColor="bg-gray-200"
                  name="company_name"
                  required={true}
                  onChange={jobPostForm.handleChange}
                  value={jobPostForm.values.company_name}
                />
                {/* company description */}
                <TextArea
                  required={false}
                  label="Company Description"
                  bgColor="bg-gray-200"
                  name="company_description"
                  onChange={jobPostForm.handleChange}
                  value={jobPostForm.values.company_description}
                />
                {/* job stages */}
                <div className="flex flex-col">
                  {/* job stages */}
                  <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                    <InputField
                      type="text"
                      label="Selection Stages"
                      bgColor="bg-gray-200"
                      placeholder="eg: aptitude test"
                      ref={jobStageNameRef}
                    />
                    <InputField
                      type="date"
                      bgColor="bg-gray-200"
                      ref={jobStageDateRef}
                    />
                    {/* button */}
                    <button
                      className="w-fit rounded-md px-4 py-1.5 border border-gray-400 text-gray-600 font-medium hover:border-blue-600 ease-in transition-all hover:text-blue-600 my-2"
                      onClick={() => addDetail()}
                    >
                      Add
                    </button>
                  </div>
                  {/* display region */}
                  <div className={"flex items-center gap-3 flex-wrap my-1"}>
                    {jobPostForm?.values?.job_stages.length > 0 &&
                      jobPostForm?.values?.job_stages?.map((d) => (
                        <span
                          className={
                            "flex justify-between border border-gray-700 px-2 py-1.5 rounded shadow text-gray-700 capitalize"
                          }
                          key={d.id}
                        >
                          <p className="flex flex-col">
                            {d.name}
                            <span className="text-sm">
                              {new Date(d.date).toDateString()}
                            </span>
                          </p>
                          <button
                            onClick={() => removeDetail(d.id, "job_stage")}
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                  </div>
                </div>

                {/* skills */}
                <div className="flex flex-col w-full">
                  <InputField
                    type="text"
                    name="skills"
                    onChange={jobPostForm.handleChange}
                    label="Required Skills"
                    bgColor="bg-gray-200"
                  />
                  <p className="text-base text-neutral-600">
                    Separated by comma eg. c,c++,java
                  </p>
                </div>
                {/* description */}
                <label
                  htmlFor=""
                  className="text-gray-700 lg:text-lg text-base font-medium"
                >
                  Job Description
                </label>
                <MarkdownEditor
                  name="description"
                  onChange={(val) => setDescription(val)}
                />
                {/* requirements */}
                <label
                  htmlFor=""
                  className="text-gray-700 lg:text-lg text-base font-medium"
                >
                  Job Requirements
                </label>
                <MarkdownEditor
                  name="requirements"
                  onChange={(val) => setRequirement(val)}
                />
                {/* or  */}
                <div className="flex items-center justify-center gap-3">
                  <span className="w-full border-b border-b-neutral-600"></span>
                  <p>Or</p>
                  <span className="w-full border-b border-b-neutral-600"></span>
                </div>

                {/* file upload */}
                <div className="">
                  <InputField
                    label="Upload Requirements File"
                    type="file"
                    accept={"application/pdf"}
                    bgColor="bg-gray-200"
                    onChange={(e) => {
                      if (e.target.files[0].size > 2 * 1024 * 1024)
                        alert("Upload file less than 2MB");
                      setFile(e.target.files[0]);
                    }}
                  />
                  <p className="my-1 text-sm text-gray-700">PDF (MAX. 2MB).</p>
                </div>

                {/* additional questions */}
                <div className="flex flex-col">
                  <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                    <InputField
                      type="text"
                      label="Additional Question"
                      bgColor="bg-gray-200"
                      placeholder="eg: Agree to 2 years bond?"
                      ref={additionalQuestionsRef}
                    />
                    {/* button */}
                    <button
                      className="w-fit rounded-md px-4 py-1.5 border border-gray-400 text-gray-600 font-medium hover:border-blue-600 ease-in transition-all hover:text-blue-600 my-2"
                      onClick={() => addDetail()}
                    >
                      Add
                    </button>
                  </div>
                  {/* display region */}
                  <div className={"flex items-center gap-3 flex-wrap my-1"}>
                    {jobPostForm?.values?.additional_questions.length > 0 &&
                      jobPostForm?.values?.additional_questions?.map((d) => (
                        <span
                          className={
                            "flex justify-between border border-gray-700 px-2 py-1.5 rounded shadow text-gray-700 capitalize"
                          }
                          key={d.qid}
                        >
                          <p className="flex flex-col">{d.question}</p>
                          <button
                            onClick={() =>
                              removeDetail(d.qid, "additional_question")
                            }
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                  </div>
                </div>

                <div className="w-full flex justify-center my-3">
                  <button
                    className="w-fit bg-blue-700 text-gray-100 px-4 py-2 rounded shadow hover:bg-blue-600 transition-all ease-in flex items-center gap-2"
                    type="submit"
                    onClick={() => submitHandler(jobPostForm.values)}
                  >
                    Create Job Post
                  </button>
                </div>
              </div>
            )}
          </form>
        </main>
      </DashboardLayout>
    </Layout>
  );
}
