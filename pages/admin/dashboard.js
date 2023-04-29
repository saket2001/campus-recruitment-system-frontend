import React from "react";
import { DashboardLayout, Layout, Loader } from "../../components/UI/index";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useQuery } from "react-query";
import fetchData from "../../helpers/fetchData";
import { DashboardStudentPerBranch } from "../../components/Admin/DashboardStudentPerBranch";
import { PreviousYearsPlacements } from "../../components/Admin/PreviousYearsPlacements";
import { JobResponsesGraph } from "../../components/Admin/JobResponsesGraph";

export default function dashboard() {
  return <DashboardMain />;
}

const DashboardMain = () => {
  const { full_name } = useSelector((state) => state.auth);
  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetchData("/admin/admin-dashboard");
      return res?.data;
    },
  });

  console.log(fetchedData);

  if (isLoading) return <Loader text="Loading Admin Statistics" />;
  return (
    <div>
      <Layout showNav={false}>
        <DashboardLayout authRole={["admin"]} pageTitle={"Admin Dashboard"}>
          <main className="min-h-screen h-full flex flex-col gap-4 w-full p-3 bg-neutral-200 mx-2">
            {/* heading */}
            <div className="w-full flex justify-between items-center py-3 px-4">
              <h2 className="flex flex-col font-semibold lg:text-3xl text-xl">
                Admin Dashboard
                <span className="text-lg text-neutral-500">
                  Welcome {full_name}
                </span>
              </h2>

              <Link href={"/admin/job/create"}>
                <button className="px-3 py-2 border border-neutral-700 hover:bg-blue-700 hover:text-neutral-50 hover:border-blue-700 text-neutral-700 rounded-md transition-all ease-in text-sm">
                  Create New Job
                </button>
              </Link>
            </div>
            {/* analysis */}
            <section className="w-full flex lg:flex-row flex-col gap-3">
              {/* layer 1 */}
              <section className="w-full h-full flex flex-col gap-3">
                {/* responses per post created */}
                <div className="w-full h-full flex">
                  <JobResponsesGraph data={fetchedData?.jobResponses} />
                </div>
                {/* no of current job posting of each companies and roles */}
                <div className="w-full h-1/2 flex lg:flex-row flex-col gap-3">
                  <div className="flex w-full h-full">
                    <PreviousYearsPlacements
                      data={fetchedData?.prevYearPlacementsPerCompany}
                    />
                  </div>
                </div>
              </section>
              {/* layer 2 */}
              <section className="w-fit flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-2 lg:p-5 p-3 rounded-md shadow bg-gray-50">
                    <p className="font-medium text-neutral-600 lg:text-xl text-lg">
                      Total Students
                    </p>
                    <h2 className="font-medium text-lg lg:text-3xl">
                      {fetchedData?.totalStudents || "0"}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2 lg:p-5 p-3 rounded-md shadow bg-gray-50">
                    <p className="font-medium text-neutral-600 lg:text-xl text-lg">
                      Total Placed Students
                    </p>
                    <h2 className="font-medium text-lg lg:text-3xl">
                      {fetchedData?.totalPlacedStudents ?? "0"}
                    </h2>
                  </div>
                </div>
                {/* no of students as per branch */}
                <div className="flex w-fit h-full">
                  <DashboardStudentPerBranch
                    data={fetchedData?.studentsPerBranch}
                  />
                </div>
              </section>
            </section>
          </main>
        </DashboardLayout>
      </Layout>
    </div>
  );
};
