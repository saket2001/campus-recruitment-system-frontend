import React, { useState, createRef, useCallback } from "react";
import {
  Layout,
  DashboardLayout,
  Loader,
  Modal,
} from "../../../../components/UI/index";
import { useFormik } from "formik";
import { InputField } from "../../../../components/UI/InputField/InputField";
import { TextArea } from "../../../../components/UI/TextArea/TextArea";
import { v4 as uuid4 } from "uuid";
import fetchData from "../../../../helpers/fetchData";
import { useQuery } from "react-query";
import Link from "next/link";
import dateFormatter from "../../../../helpers/dateFormatter";
import { useRouter } from "next/router";
import Image from "next/image";
import { socket } from "../../../../helpers/socketOperation";

const userResumeData = {
  basic_details: {
    full_name: "",
    email: "",
    age: "",
    contact: "",
    summary: "",
    address: "",
    college: "",
    branch: "",
    admission_number: "",
    profilePicture: "", // filePath
    gender: "",
  },
  skills: {
    isActive: true,
    data: [],
  },
  education: {
    "10th": {
      name: "",
      year: "",
      percentage: "",
    },
    "12th": {
      name: "",
      year: "",
      percentage: "",
    },
    engineering: {
      name: "",
      year: "",
      percentage: "",
      sem: "",
    },
  },
  experience: {
    isActive: true,
    data: [],
  },
  certificates: {
    isActive: false,
    data: [],
  },
  projects: {
    isActive: false,
    data: [],
  },
  hobbies: {
    isActive: false,
    data: [],
  },
  languages: {
    isActive: false,
    data: [],
  },
  extraCurricular: {
    isActive: false,
    data: [],
  },
  last_edited: "",
};

const btnStyle =
  "rounded shadow px-4 py-1.5 border border-neutral-400 text-neutral-600 font-medium hover:border-blue-600 ease-in transition-all hover:text-blue-600 w-fit mb-2";
// const h3Heading = "text-lg lg:text-xl font-medium text-neutral-700";
const inputColor = "bg-gray-200";
const listStyle = "flex items-center gap-3 flex-wrap my-1";
const listDivStyle =
  "flex justify-between border border-neutral-700 px-2 py-1.5 rounded shadow text-neutral-700 capitalize";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyProfileEdit() {
  const router = useRouter();
  const { new_user } = router.query;
  const cardCheck =
    Boolean(new_user) && Boolean(window?.localStorage.getItem("new-user"));

  const [showWelcomeCard, setShowWelcomeCard] = useState(cardCheck);
  const [disableUploadButton, setDisableUploadButton] = useState(false);
  const [imgVal, setImaVal] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  // ref
  const skillRef = React.createRef();
  const hobbyRef = React.createRef();
  const langRef = React.createRef();
  const extraCurrRef = React.createRef();
  const certNameRef = React.createRef();
  const certYearRef = React.createRef();
  const projNameRef = React.createRef();
  const projSummaryRef = React.createRef();
  const expNameRef = React.createRef();
  const expYearRef = React.createRef();
  const expSummaryRef = React.createRef();

  const profileForm = useFormik({
    initialValues: userResumeData,
  });

  socket.on("resume-parsed", (...data) => {
    // setSocketData(data);
    notify("Your resume has been parsed!")
  });

  const notify = useCallback((msg) => toast(msg));

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["user-profile-data"],
    queryFn: async () => {
      // fetch data
      const data = await fetchData("/user/profile");
      console.log(data);
      if (data) {
        // setting form values to fetched data of user
        for (const key in data.data["details"]) {
          profileForm.values[key] = data.data["details"][key];
        }
      }
      return data.data;
    },
  });

  const submitHandler = async (e, values) => {
    e.preventDefault;
    // send data
    values["last_edited"] = new Date();
    const data = await fetchData(
      "/user/profile/edit",
      { method: "POST", body: JSON.stringify(values) },
      { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    );

    // show response
    if (data.isError) {
      notify("Failed to update user profile!");
    } else {
      notify("Updated user profile");
    }
    window.scrollTo(0, 0);

    // reloading the page
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const addDetail = (type) => {
    switch (type) {
      case "skill":
        if (skillRef.current.value.length > 0) {
          profileForm.values["skills"]?.data.push({
            id: uuid4(),
            name: skillRef.current.value,
          });
          // clearing input
          skillRef.current.value = "";
        }
        break;

      case "hobby":
        if (hobbyRef.current.value.length > 0) {
          profileForm.values["hobbies"]?.data.push({
            id: uuid4(),
            name: hobbyRef.current.value,
          });
          // clearing input
          hobbyRef.current.value = "";
        }
        break;

      case "extraCurr":
        if (extraCurrRef.current.value.length > 0) {
          profileForm.values["extra_curricular"].data.push({
            id: uuid4(),
            name: extraCurrRef.current.value,
          });
          // clearing input
          extraCurrRef.current.value = "";
        }
        break;

      case "image":
        if (imgVal) {
          // profileForm.values["basic_details"]["profilePicture"] = imgVal;
          // send data
          const formData = new FormData();
          formData.append("profile_picture", imgVal);

          fetchData(
            "/user/profile/edit",
            { method: "POST", body: formData },
            { "Access-Control-Allow-Origin": "*" }
          )
            .then((data) => {
              console.log(data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        break;

      case "language":
        if (langRef.current.value.length > 0) {
          profileForm.values["languages"].data.push({
            id: uuid4(),
            name: langRef.current.value,
          });
          // clearing input
          langRef.current.value = "";
        }
        break;

      case "project":
        if (projNameRef.current.value.length > 0) {
          profileForm.values["projects"].data.push({
            id: uuid4(),
            name: projNameRef.current.value,
            summary: projSummaryRef.current.value,
          });
          // clearing input
          projNameRef.current.value = "";
          projSummaryRef.current.value = "";
        }
        break;

      case "certificate":
        if (
          certNameRef.current.value.length > 0 &&
          certYearRef.current.value.length > 0
        ) {
          profileForm.values["certificates"]?.data.push({
            id: uuid4(),
            name: certNameRef.current.value,
            year: certYearRef.current.value,
          });
          // clearing input
          certNameRef.current.value = "";
          certYearRef.current.value = "";
        }
        break;

      case "experience":
        if (
          expNameRef.current.value.length > 0 &&
          expYearRef.current.value.length > 0
        ) {
          profileForm.values["experience"].data.push({
            id: uuid4(),
            name: expNameRef.current.value,
            summary: expSummaryRef.current.value,
            year: expYearRef.current.value,
          });
          // clearing input
          expNameRef.current.value = "";
          expYearRef.current.value = "";
          expSummaryRef.current.value = "";
        }
        break;

      default:
        break;
    }
  };

  const removeDetail = (type, id) => {
    switch (type) {
      case "skill":
        if (id) {
          profileForm.values.skills.data =
            profileForm.values.skills.data?.filter((d) => d.id !== id);
        }
        break;

      case "hobby":
        if (id) {
          profileForm.values.hobbies.data =
            profileForm.values.hobbies.data?.filter((d) => d.id !== id);
        }
        break;

      case "extraCurr":
        if (id) {
          profileForm.values.extra_curricular.data =
            profileForm.values.extra_curricular.data?.filter(
              (d) => d.id !== id
            );
        }
        break;

      case "language":
        if (id) {
          profileForm.values.languages.data =
            profileForm.values.languages.data?.filter((d) => d.id !== id);
        }
        break;

      case "project":
        if (id) {
          profileForm.values.projects.data =
            profileForm.values.projects.data?.filter((d) => d.id !== id);
        }
        break;

      case "certificate":
        if (id) {
          profileForm.values.certificates.data =
            profileForm.values.certificates.data?.filter((d) => d.id !== id);
        }
        break;

      case "experience":
        if (id) {
          profileForm.values.experience.data =
            profileForm.values.experience.data?.filter((d) => d.id !== id);
        }
        break;

      default:
        break;
    }
  };

  const modalHandler1 = useCallback(() => {
    setShowModal((prev) => !prev);
    // disable upload button to prevent multiple uploads in limited time
    // setDisableUploadButton(true);
    setTimeout(() => {
      setDisableUploadButton(false);
    }, 240000);
  });

  const modalHandler2 = useCallback(() => {
    setShowModal2((prev) => !prev);
  });

  const welcomeCardHandler = () => {
    window?.localStorage.setItem("new-user", false);
    setShowWelcomeCard(false);
  };

  if (isLoading) return <Loader />;

  if (fetchedData === undefined || !fetchedData?.details) {
    <h1>Error</h1>;
  }

  return (
    <Layout showNav={false}>
      {/* {showWelcomeCard && (
        <UserWelcomeCard onClickHandler={welcomeCardHandler} />
      )} */}
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        theme="light"
        newestOnTop={true}
      />
      {showModal && (
        <Modal
          onClick={modalHandler1}
          content={<ResumeUploader resume_file={fetchedData["resume_file"]} />}
        />
      )}
      {showModal2 && (
        <Modal
          onClick={modalHandler2}
          content={
            <PhotoUploader
              resume_file={fetchedData?.details?.basic_details?.profile_picture}
            />
          }
        />
      )}
      {!showModal && !showModal2 && (
        <DashboardLayout authRole={["user"]} pageTitle={"Edit Profile Page"}>
          <main className="min-h-screen h-full p-3 gap-3 lg:flex-col flex flex-col bg-blue-100">
            <div className="flex bg-white w-full flex-col gap-2 px-3 pt-2 pb-1 rounded-md">
              {/* profile Banner */}
              <div className="lg:w-fit flex flex-row items-center px-4 py-1 w-full lg:h-40 h-56 gap-4">
                {/* image */}
                {fetchedData?.details?.basic_details?.profile_picture ? (
                  <div className="w-fit flex relative bg-neutral-300 rounded-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_DEV_SERVER}/${fetchedData["details"]["basic_details"]?.profile_picture}`}
                      alt="user profile picture"
                      loading="lazy"
                      width={150}
                      height={150}
                      className="mb-2 rounded-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={modalHandler2}
                      className="flex items-center justify-center z-10 bottom-3 right-1 absolute w-fit bg-neutral-100 hover:bg-neutral-200 p-2 rounded-full transition-all ease-in"
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-fit flex relative bg-neutral-300 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-20 h-20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={modalHandler2}
                      className="flex items-center justify-center z-10 bottom-3 right-1 absolute w-fit bg-neutral-100 hover:bg-neutral-200 p-2 rounded-full transition-all ease-in"
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* name */}
                <div className="flex flex-col">
                  <h2 className="lg:text-2xl text-xl font-bold text-neutral-800 capitalize">
                    {fetchedData?.details?.basic_details?.full_name}
                  </h2>

                  {/* last edit */}
                  <p className="text-neutral-700 mb-2 lg:w-full text-base">
                    Last edited{" "}
                    {fetchedData?.details?.last_edited ? (
                      <span className="text-neutral-600 font-medium lowercase">
                        {`${dateFormatter(
                          fetchedData?.details?.last_edited
                        )} at ${new Date(
                          fetchedData?.details?.last_edited
                        ).toLocaleTimeString()}`}
                      </span>
                    ) : (
                      "Not available"
                    )}
                  </p>

                  {/* view resume */}
                  <div className="flex flex-wrap gap-2">
                    {fetchedData?.resume_file && (
                      <Link
                        href={`${process.env.NEXT_PUBLIC_DEV_SERVER}/${fetchedData?.resume_file}`}
                      >
                        <a
                          target="_blank"
                          className="px-4 bg-blue-700 text-neutral-100 py-1.5 rounded w-fit border-0"
                        >
                          View resume
                        </a>
                      </Link>
                    )}
                    <button
                      disabled={disableUploadButton}
                      className="px-3 py-1.5 rounded hover:bg-neutral-200 transition-all ease-in disabled:bg-gray-400 disabled:font-medium disabled:text-neutral-200"
                      title={
                        disableUploadButton ? "Will be active in 4 mins" : ""
                      }
                      onClick={()=>{
                        setDisableUploadButton(true);
                        modalHandler1()
                      }}
                    >
                      Upload Resume
                    </button>
                  </div>
                </div>
              </div>
              {/* Section buttons */}
              <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-t border-neutral-500">
                <button
                  className={`px-3 py-1.5 rounded hover:bg-neutral-200 transition-all ease-in ${
                    pageNumber === 0 ? "bg-neutral-200" : ""
                  }`}
                  onClick={() => {
                    setPageNumber(0);
                  }}
                >
                  Basic Details
                </button>
                <button
                  className={`px-3 py-1.5 rounded hover:bg-neutral-200 transition-all ease-in ${
                    pageNumber === 1 ? "bg-neutral-200" : ""
                  }`}
                  onClick={() => {
                    setPageNumber(1);
                  }}
                >
                  Education
                </button>
                <button
                  className={`px-3 py-1.5 rounded hover:bg-neutral-200 transition-all ease-in ${
                    pageNumber === 2 ? "bg-neutral-200" : ""
                  }`}
                  onClick={() => {
                    setPageNumber(2);
                  }}
                >
                  Skills
                </button>
                <button
                  className={`px-3 py-1.5 rounded hover:bg-neutral-200 transition-all ease-in ${
                    pageNumber === 3 ? "bg-neutral-200" : ""
                  }`}
                  onClick={() => {
                    setPageNumber(3);
                  }}
                >
                  Experience
                </button>
                <button
                  className={`px-3 py-1.5 rounded hover:bg-neutral-200 transition-all ease-in ${
                    pageNumber === 4 ? "bg-neutral-200" : ""
                  }`}
                  onClick={() => {
                    setPageNumber(4);
                  }}
                >
                  Projects
                </button>
                <button
                  className={`px-3 py-1.5 rounded hover:bg-neutral-200 transition-all ease-in ${
                    pageNumber === 5 ? "bg-neutral-200" : ""
                  }`}
                  onClick={() => {
                    setPageNumber(5);
                  }}
                >
                  Certificates
                </button>
                <button
                  className={`px-3 py-1.5 rounded hover:bg-neutral-200 transition-all ease-in ${
                    pageNumber === 6 ? "bg-neutral-200" : ""
                  }`}
                  onClick={() => {
                    setPageNumber(6);
                  }}
                >
                  Others
                </button>
              </div>
            </div>

            <form
              className="bg-white my-2 rounded-md flex flex-col lg:w-3/4 w-full px-4 py-3"
              onSubmit={profileForm.handleSubmit}
            >
              {/* basic details */}
              {pageNumber === 0 && (
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-0 gap-x-3 w-full">
                  <InputField
                    label="Full Name"
                    name='basic_details["full_name"]'
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.full_name}
                  />
                  <InputField
                    type="email"
                    label="Email"
                    name="basic_details['email']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.email}
                  />
                  <InputField
                    type="number"
                    label="Age"
                    name="basic_details['age']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.age}
                  />
                  <InputField
                    type="number"
                    label="Contact"
                    name="basic_details['contact']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.contact}
                  />
                  <InputField
                    type="text"
                    label="College Name"
                    name="basic_details['college']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.college}
                  />
                  <InputField
                    type="text"
                    label="Branch"
                    name="basic_details['branch']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.branch}
                  />
                  <InputField
                    type="text"
                    label="Admission Number"
                    name="basic_details['admission_number']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={
                      fetchedData?.details?.basic_details?.admission_number
                    }
                  />
                  <InputField
                    type="text"
                    label="Gender"
                    name="basic_details['gender']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.gender}
                  />
                  <TextArea
                    label="Address"
                    name="basic_details['address']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.address}
                  />
                  <TextArea
                    label="Summary"
                    name="basic_details['summary']"
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    bgColor={inputColor}
                    value={fetchedData?.details?.basic_details?.summary}
                  />
                </div>
              )}

              {/* others */}
              {pageNumber === 6 && (
                <div className="flex flex-col gap-6">
                  {/* hobbies details */}
                  <div className="flex flex-col w-full gap-2">
                    {/* <h3 className={h3Heading}>Hobbies</h3>{" "} */}
                    <div>
                      {" "}
                      <div className="flex items-end gap-3">
                        <InputField
                          label="Hobby Name"
                          bgColor={inputColor}
                          ref={hobbyRef}
                        />
                        {/* button */}
                        <button
                          className={btnStyle}
                          onClick={() => addDetail("hobby")}
                        >
                          Add
                        </button>
                      </div>
                      {/* display region */}
                      <div className={listStyle}>
                        {profileForm?.values?.hobbies?.data.length > 0 &&
                          profileForm?.values?.hobbies?.data?.map((d) => (
                            <span className={listDivStyle} key={d.id}>
                              {d.name}

                              <button
                                onClick={() => removeDetail("hobby", d.id)}
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
                  </div>
                  {/* languages  */}
                  <div className="flex flex-col w-full gap-2">
                    {/* <h3 className={h3Heading}>Languages</h3> */}
                    <div>
                      <div className="flex items-end gap-3">
                        <InputField
                          label="Language Name"
                          bgColor={inputColor}
                          ref={langRef}
                        />
                        {/* button */}
                        <button
                          className={btnStyle}
                          onClick={() => addDetail("language")}
                        >
                          Add
                        </button>
                      </div>
                      {/* display region */}
                      <div className={listStyle}>
                        {profileForm?.values?.languages.data.length > 0 &&
                          profileForm?.values?.languages.data?.map((d) => (
                            <span className={listDivStyle} key={d.id}>
                              {d.name}

                              <button
                                onClick={() => removeDetail("language", d.id)}
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
                  </div>
                  {/* Extra curricular  */}
                  <div className="flex justify-evenly flex-col w-full gap-1">
                    {/* <h3 className={h3Heading}>Extra Curricular</h3> */}
                    <div className="flex items-end gap-3">
                      <InputField
                        label="Activity Name"
                        bgColor={inputColor}
                        ref={extraCurrRef}
                      />
                      {/* button */}
                      <button
                        className={btnStyle}
                        onClick={() => addDetail("extraCurr")}
                      >
                        Add
                      </button>
                    </div>
                    {/* display region */}
                    <div className={listStyle}>
                      {profileForm?.values?.extra_curricular?.data?.length >
                        0 &&
                        profileForm?.values?.extra_curricular?.data?.map(
                          (d) => (
                            <span className={listDivStyle} key={d.id}>
                              {d.name}

                              <button
                                onClick={() => removeDetail("extraCurr", d.id)}
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
                          )
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* education */}
              {pageNumber === 1 && (
                <div className="flex flex-col gap-6">
                  <div className="flex-col gap-3">
                    <div className="my-2 flex-col">
                      <h4 className="font-medium text-lg">10th</h4>
                      <InputField
                        label="Institute Name"
                        bgColor={inputColor}
                        name="education['10th']['name']"
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        value={fetchedData?.details?.education["10th"]["name"]}
                      />
                      <div className="flex gap-3">
                        <InputField
                          type="month"
                          label="Passing Year"
                          bgColor={inputColor}
                          name="education['10th']['year']"
                          onChange={profileForm.handleChange}
                          onBlur={profileForm.handleBlur}
                          value={
                            fetchedData?.details?.education["10th"]["year"]
                          }
                        />
                        <InputField
                          type="number"
                          label="Percentage"
                          bgColor={inputColor}
                          name="education['10th']['percentage']"
                          onChange={profileForm.handleChange}
                          onBlur={profileForm.handleBlur}
                          value={
                            fetchedData?.details?.education["10th"][
                              "percentage"
                            ]
                          }
                        />
                      </div>
                    </div>

                    <div className="my-2 flex-col">
                      <h4 className="font-medium text-lg">12th</h4>
                      <InputField
                        label="Institute Name"
                        bgColor={inputColor}
                        name="education['12th']['name']"
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        value={fetchedData?.details?.education["12th"]["name"]}
                      />
                      <div className="flex gap-3">
                        <InputField
                          type="month"
                          label="Passing Year"
                          bgColor={inputColor}
                          name="education['12th']['year']"
                          onChange={profileForm.handleChange}
                          onBlur={profileForm.handleBlur}
                          value={
                            fetchedData?.details?.education["12th"]["year"]
                          }
                        />
                        <InputField
                          type="number"
                          label="Percentage"
                          bgColor={inputColor}
                          name="education['12th']['percentage']"
                          onChange={profileForm.handleChange}
                          onBlur={profileForm.handleBlur}
                          value={
                            fetchedData?.details?.education["12th"][
                              "percentage"
                            ]
                          }
                        />
                      </div>
                    </div>

                    <div className="my-2 flex-col">
                      <h4 className="font-medium text-lg">Degree</h4>
                      <InputField
                        label="Institute Name"
                        bgColor={inputColor}
                        name="education['engineering']['name']"
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        value={
                          fetchedData?.details?.education["engineering"]["name"]
                        }
                      />
                      <div className="flex gap-3">
                        <InputField
                          type="month"
                          label="Passing Year"
                          bgColor={inputColor}
                          name="education['engineering']['year']"
                          onChange={profileForm.handleChange}
                          onBlur={profileForm.handleBlur}
                          value={
                            fetchedData?.details?.education["engineering"][
                              "year"
                            ]
                          }
                        />
                        <InputField
                          type="text"
                          label="Percentage"
                          bgColor={inputColor}
                          name="education['engineering']['percentage']"
                          onChange={profileForm.handleChange}
                          onBlur={profileForm.handleBlur}
                          value={
                            fetchedData?.details?.education["engineering"][
                              "percentage"
                            ]
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* skills */}
              {pageNumber === 2 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-end gap-3">
                    <InputField
                      label="Skill Name"
                      bgColor={inputColor}
                      ref={skillRef}
                      name="skills"
                    />
                    {/* button */}
                    <button
                      className={btnStyle}
                      onClick={() => addDetail("skill")}
                    >
                      Add
                    </button>
                  </div>
                  {/* display region */}
                  <div className={listStyle}>
                    {profileForm?.values?.skills.data.length > 0 &&
                      profileForm?.values?.skills?.data?.map((d) => (
                        <span className={listDivStyle} key={d.id}>
                          {d.name}

                          <button onClick={() => removeDetail("skill", d.id)}>
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
              )}

              {/* experience */}
              {pageNumber === 3 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex gap-3">
                      <InputField
                        label="Institute Name"
                        bgColor={inputColor}
                        ref={expNameRef}
                      />
                      <InputField
                        type="month"
                        label="Year"
                        bgColor={inputColor}
                        ref={expYearRef}
                      />
                    </div>
                    <TextArea
                      label="Summary"
                      bgColor={inputColor}
                      ref={expSummaryRef}
                    />
                    {/* button */}
                    <button
                      className={btnStyle}
                      onClick={() => addDetail("experience")}
                    >
                      Add Detail
                    </button>
                    {/* display region */}
                    <ul className="list-disc py-2 gap-3">
                      {profileForm.values["experience"].data?.map((d) => (
                        <li
                          key={d?.id}
                          className="flex justify-between p-1 my-1 capitalize"
                        >
                          <p className="flex flex-col gap-1">
                            <p className="font-medium">
                              {d?.name} {d?.year}
                            </p>
                            <p>{d?.summary}</p>
                          </p>
                          <button
                            onClick={() => removeDetail("experience", d.id)}
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
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* certificate */}
              {pageNumber === 5 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <InputField
                      label="Name"
                      bgColor={inputColor}
                      ref={certNameRef}
                    />
                    <div className="flex items-end gap-3">
                      <InputField
                        type="month"
                        label="Year"
                        bgColor={inputColor}
                        ref={certYearRef}
                      />
                      {/* button */}
                      <button
                        className={btnStyle}
                        onClick={() => addDetail("certificate")}
                      >
                        Add
                      </button>
                    </div>
                    {/* display region */}
                    <ul className="list-disc py-2 gap-3">
                      {profileForm.values.certificates?.data?.map((d) => (
                        <li
                          key={d.id}
                          className="flex justify-between p-1 my-1 capitalize"
                        >
                          <p className="flex gap-2">
                            <span className="font-medium">{d.name}</span>,{" "}
                            {d?.year}
                          </p>
                          <button
                            onClick={() => removeDetail("certificate", d.id)}
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
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* project */}
              {pageNumber === 4 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <InputField
                      label="Name"
                      bgColor={inputColor}
                      ref={projNameRef}
                    />
                    <TextArea
                      label="Summary"
                      bgColor={inputColor}
                      ref={projSummaryRef}
                    />
                    {/* button */}
                    <button
                      className={btnStyle}
                      onClick={() => addDetail("project")}
                    >
                      Add Project
                    </button>
                    {/* display region */}
                    <ul className="list-disc py-2 gap-3">
                      {profileForm.values.projects?.data?.map((d) => (
                        <li
                          key={d.id}
                          className="flex justify-between p-1 my-1"
                        >
                          <p className="flex flex-col">
                            <span className="font-medium">{d.name}</span>
                            {d?.summary}
                          </p>
                          <button onClick={() => removeDetail("project", d.id)}>
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
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* save button */}
              <button
                type="button"
                onClick={(e) => {
                  submitHandler(e, profileForm.values);
                }}
                className="bg-blue-800 px-5 py-1.5 text-gray-100 my-3 hover:bg-blue-700 rounded hover:shadow-md transition-all ease-in w-fit"
              >
                Save Details
              </button>
            </form>
          </main>
        </DashboardLayout>
      )}
    </Layout>
  );
}

export const ResumeUploader = ({ resume_file, extraStyle }) => {
  const fileSizeLimit = 2 * 1024 * 1024; // 2MB
  const fileRef = createRef();
  const [showError, setShowError] = useState({ isError: false, text: "" });

  const notify = useCallback((msg) => toast(msg));

  const submitResume = async (event) => {
    event.preventDefault();
    const userFile = fileRef.current.files[0];
    if (!userFile)
      return setShowError({
        isError: true,
        text: "Please select a file to upload!",
      });

    // check file size
    if (userFile?.size > fileSizeLimit)
      return setShowError({
        isError: true,
        text: "Upload file less then 2MB in size",
      });

    // sent to server
    let formData = new FormData();
    formData.append("resume_file", userFile);

    const data = await fetchData(`/user/profile/upload-resume`, {
      method: "post",
      body: formData,
    });
    setShowError({ isError: false, text: "Uploading your resume..." });

    // set response for user
    if (data && !data?.isError) {
      setShowError({ isError: false, text: data?.message });
      notify(data?.message);
      // clear input
      fileRef.current.value = null;
      setTimeout(() => {
        window?.location?.reload();
      },3000)
    } else {
      notify(data?.message);
      setTimeout(() => {
         window?.location?.reload();
       }, 3000);
      setShowError({ isError: true, text: data?.message });
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 p-5 h-fit lg:w-full w-full ${extraStyle}`}
    >
      <h1 className="font-bold lg:text-2xl text-xl text-gray-900">
        Upload Resume
      </h1>
      <form method="post" id="resume-form" className="flex flex-col gap-1 py-3">
        <input
          type="file"
          name="resume_file"
          id="resume_file"
          accept="application/pdf"
          ref={fileRef}
        />
        <p className="my-1 text-sm text-gray-700" id="file_input_help">
          PDF (MAX. 2MB).
        </p>
        <button
          onClick={(event) => submitResume(event)}
          type="submit"
          className="w-fit bg-blue-800 px-5 py-1.5 text-gray-100 my-1 hover:bg-blue-700 rounded hover:shadow-md transition-all ease-in"
        >
          Upload Resume
        </button>
      </form>

      <div className="flex">
        {resume_file && (
          <div className="flex flex-wrap gap-2">
            <p className="text-gray-800 font-medium text-base flex items-center gap-2">
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
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Resume file is uploaded.
            </p>
            <Link href={`${process.env.NEXT_PUBLIC_DEV_SERVER}/${resume_file}`}>
              <a target="_blank" className="px-1 text-blue-800">
                View resume
              </a>
            </Link>
          </div>
        )}
      </div>
      {/* error */}
      {showError.text && (
        <h2
          className={`${
            showError.isError ? "text-red-700" : "text-green-700"
          } border-t border-gray-400 font-medium text-base mt-2 py-2 flex gap-3 items-center`}
        >
          {showError.isError ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentcolor"
              className="w-6 h-6 text-red-700 font-bold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          ) : (
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {showError.text}
        </h2>
      )}
    </div>
  );
};

export const PhotoUploader = ({ photo_file, extraStyle }) => {
  const fileSizeLimit = 2 * 1024 * 1024; // 2MB
  const fileRef = createRef();
  const [showError, setShowError] = useState({ isError: false, text: "" });

  const notify = useCallback((msg) => toast(msg));

  const submitPhoto = async (event) => {
    event.preventDefault();
    const userFile = fileRef.current.files[0];
    if (!userFile)
      return setShowError({
        isError: true,
        text: "Please select a image to upload!",
      });

    // check file size
    if (userFile?.size > fileSizeLimit)
      return setShowError({
        isError: true,
        text: "Upload image less then 2MB in size",
      });

    // sent to server
    let formData = new FormData();
    formData.append("profile_picture", userFile);

    const data = await fetchData(`/user/profile/upload-profile-picture`, {
      method: "post",
      body: formData,
    });

    // set response for user
    if (data && !data?.isError) {
      setShowError({ isError: false, text: data?.message });
      notify(data?.message);
      // clear input
      fileRef.current.value = null;
      window?.location?.reload();
    } else {
      setShowError({ isError: true, text: data?.message });
      notify(data?.message);
    }
  };

  const deletePhoto = async (event) => {
    event.preventDefault();
    const data = await fetchData(`/user/profile/delete-profile-picture`, {
      method: "delete",
    });

    // set response for user
    if (data && !data?.isError) {
      setShowError({ isError: false, text: data?.message });
      notify(data?.message);
      window?.location?.reload();
    } else {
      notify(data?.message);
      setShowError({ isError: true, text: data?.message });
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 p-5 h-fit lg:w-full w-full ${extraStyle}`}
    >
      <h1 className="font-bold lg:text-2xl text-xl text-neutral-900">
        Upload Profile Picture
      </h1>
      <form method="post" id="resume-form" className="flex flex-col gap-1 py-3">
        <input
          type="file"
          name="profile_picture"
          id="profile_picture"
          ref={fileRef}
        />
        <p className="my-1 text-sm text-neutral-700">Image (MAX. 2MB).</p>
        <div className="flex gap-2">
          <button
            onClick={(event) => submitPhoto(event)}
            type="submit"
            className="w-fit bg-blue-800 lg:px-5 px-2 py-1.5 text-neutral-100 my-1 hover:bg-blue-700 rounded hover:shadow-md transition-all ease-in text-base"
          >
            Save Changes
          </button>
          <button
            onClick={(event) => deletePhoto(event)}
            type="button"
            className="w-fit font-medium border border-transparent hover:border-red-700 lg:px-5 px-2 py-1.5 text-red-700 my-1 rounded hover:shadow-md transition-all ease-in text-base"
          >
            Remove
          </button>
        </div>
      </form>

      <div className="flex">
        {photo_file && (
          <div className="flex flex-wrap gap-2">
            <p className="text-gray-800 font-medium text-base flex items-center gap-2">
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
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Profile Picture is uploaded.
            </p>
            {/* <Link href={`${process.env.NEXT_PUBLIC_DEV_SERVER}/${resume_file}`}>
              <a target="_blank" className="px-1 text-blue-800">
                View 
              </a>
            </Link> */}
          </div>
        )}
      </div>
      {/* error */}
      {showError.text && (
        <h2
          className={` ${
            showError.isError ? "text-red-700" : "text-green-700"
          } border-t border-gray-400 font-medium text-base mt-2 py-2 flex gap-3 items-center`}
        >
          {showError.isError ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentcolor"
              className="w-6 h-6 text-red-700 font-bold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          ) : (
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {showError.text}
        </h2>
      )}
    </div>
  );
};
