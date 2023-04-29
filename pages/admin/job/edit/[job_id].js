import React, { useState, useCallback } from "react";
import {
  Layout,
  DashboardLayout,
  InputField,
  BackButton,
  TextArea,
  Loader,
} from "../../../../components/UI/index";
import { useFormik } from "formik";
import fetchData from "../../../../helpers/fetchData";
import { useRouter } from "next/router";
import MarkdownEditor from "../../../../components/UI/job/MarkdownEditor";
import { v4 as uuid4 } from "uuid";
import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//////////////////////////////////

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

//////////////////////////////////
export default function Edit() {
  const jobStageNameRef = React.createRef();
  const jobStageDateRef = React.createRef();
  const additionalQuestionsRef = React.createRef();
  const router = useRouter();
  const job_id = router.query["job_id"];
  const [formData, setFormData] = useState(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState(null);
  const [requirement, setRequirement] = useState(null);

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
      skills: "",
      job_stages: [],
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

  // fetch already filled job form data
  const { data: jobData, isLoading } = useQuery({
    enabled: job_id !== undefined,
    queryKey: ["job-data", job_id],
    queryFn: async () => {
      const res = await fetchData(`/get-job/${job_id}`);
      if (res.data?.job) {
        setFormData(res.data?.job);
        // setting form values to fetched data of user
        for (const key in res.data.job) {
          jobPostForm.values[key] = res.data.job[key];
        }

        setDescription(res.data.job?.description);
        setRequirement(res.data.job?.requirements);

        return res.data;
      }
    },
  });

  const notify = useCallback((msg) => toast(msg));

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
    if (id && type === "job_stage") {
      jobPostForm.values.job_stages = jobPostForm.values.job_stages?.filter(
        (d) => d.id !== id
      );
    }
     if (id && type === "additional_question") {
       jobPostForm.values.additional_questions =
         jobPostForm.values.additional_questions?.filter((d) => d.qid !== id);
     }
  });

  const submitHandler = async (values) => {
    values["description"] = description;
    values["requirements"] = requirement;

    const data = await fetchData(
      "/admin/edit-job",
      {
        method: "PUT",
        body: JSON.stringify({
          job_id: formData["_id"],
          data: values,
        }),
      },
      {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    );

    // posting file to db if any
    if (file) {
      const formData = new FormData();
      formData.append("details_file", file);
      formData.append("job_id", job_id);

      const response = await fetchData(
        "/recruiter/upload-job-file",
        { method: "POST", body: formData },
        { "Access-Control-Allow-Origin": "*" }
      );

      notify(response?.message);
    }

    notify(data?.message);
    window.location.reload();
    window.scrollTo(0, 0);
  };

  if (isLoading) return <Loader text="Loading job data" />;

  return (
    <Layout showNav={false}>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
      <DashboardLayout authRole={["admin"]} pageTitle={"Edit Job Page"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center">
          {/* heading */}
          <div className="w-full flex items-center mb-3">
            {/* back btn */}
            <BackButton />
            <div className="flex w-full justify-center">
              {/* heading */}
              <h2 className="flex flex-col font-semibold lg:text-2xl text-xl lg:px-8 text-neutral-800 justify-self-center">
                Edit Job
              </h2>
            </div>
          </div>

          {/* form */}
          <form
            onSubmit={jobPostForm.handleSubmit}
            className="lg:w-3/4 w-full mx-2 flex flex-col gap-2 py-4 px-2 bg-gray-100 rounded-md shadow"
          >
            {/* basic details */}
            <div className="flex flex-col gap-3 p-4">
              {/* role and location */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <InputField
                  label="Role"
                  bgColor="bg-gray-200"
                  name="role"
                  onChange={jobPostForm.handleChange}
                  value={formData?.role}
                />

                <InputField
                  label="Role Location"
                  bgColor="bg-gray-200"
                  name="location"
                  onChange={jobPostForm.handleChange}
                  value={formData?.location}
                />
              </div>
              {/* mode and total hiring */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <InputField
                  label="Mode"
                  bgColor="bg-gray-200"
                  name="mode"
                  onChange={jobPostForm.handleChange}
                  value={formData?.mode}
                />

                <InputField
                  type="number"
                  label="Total hiring"
                  bgColor="bg-gray-200"
                  name="total_hiring"
                  onChange={jobPostForm.handleChange}
                  value={formData?.total_hiring}
                />
              </div>
              {/* contact email and contact number */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <InputField
                  type="email"
                  label="Contact Email"
                  bgColor="bg-gray-200"
                  name="contact_email"
                  onChange={jobPostForm.handleChange}
                  value={formData?.contact_email}
                />
                <InputField
                  type="number"
                  label="Contact Number"
                  bgColor="bg-gray-200"
                  name="contact_number"
                  onChange={jobPostForm.handleChange}
                  value={formData?.contact_number}
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
                <div className="flex flex-col">
                  <InputField
                    type="date"
                    label="Form Closes on"
                    bgColor="bg-gray-200"
                    name="last_date"
                    onChange={jobPostForm.handleChange}
                  />
                  <p>
                    Previous Date:{" "}
                    {`${new Date(formData?.last_date).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              {/* category */}
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

              {/* additional details */}
              {/* company name */}
              <InputField
                type="text"
                label="Company Name"
                bgColor="bg-gray-200"
                name="company_name"
                value={formData?.company_name}
                onChange={jobPostForm.handleChange}
              />

              {/* company description */}
              <TextArea
                label="Company Description"
                bgColor="bg-gray-200"
                name="company_description"
                value={formData?.company_description}
                onChange={jobPostForm.handleChange}
              />

              {/* job skills */}
              <div className="flex flex-col lg:flex-row items-end gap-3 w-full">
                <InputField
                  type="text"
                  label="Required Skills"
                  bgColor="bg-gray-200"
                  name="skills"
                  onChange={jobPostForm.handleChange}
                  value={jobPostForm.values["skills"]}
                />
              </div>

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
                        <button onClick={() => removeDetail(d.id, "job_stage")}>
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
                value={description}
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
                value={requirement}
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
                {formData?.filePath && (
                  <p className="my-1 text-sm font-medium text-blue-800">
                    Uploaded{" "}
                    {formData?.filePath
                      ?.toString()
                      .split("/")[4]
                      .split("-")
                      .slice(1, 3)}
                  </p>
                )}
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
                  onClick={() => submitHandler(jobPostForm.values)}
                  className="w-fit bg-blue-700 text-gray-100 px-4 py-2 rounded shadow hover:bg-blue-600 transition-all ease-in flex items-center gap-2"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </main>
      </DashboardLayout>
    </Layout>
  );
}
