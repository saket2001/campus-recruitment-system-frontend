import React, { useState } from "react";
import {
  DashboardLayout,
  Layout,
  Loader,
} from "../../../components/UI/index";
import fetchData from "../../../helpers/fetchData";
import { JobBoard } from "../../../components/UI/job/JobBoard";
import { useQueries } from "react-query";


export default function index() {
  return <AdminJobPage />;
}

const AdminJobPage = () => {
  const [allJobData, filterData] = useQueries([
    {
      queryKey: ["all-jobs"],
      queryFn: async () => await fetchData("/get-jobs"),
    },
    {
      queryKey: ["job-filters"],
      queryFn: async () => await fetchData("/get-filters"),
    },
  ]);

  if (allJobData.isLoading || filterData.isLoading) return <Loader />;

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["admin"]} pageTitle={"Admin Job Page"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          {/* heading */}
          <h2 className="flex flex-col font-semibold lg:text-3xl text-xl lg:px-8">
            Admin Job Section
          </h2>
          <div className="lg:w-4/5 w-full h-full grid grid-cols-1 gap-3 lg:p-3 z-0 relative">
            {/* all jobs */}
            {allJobData.data?.data && (
              <JobBoard
                data={allJobData?.data?.data}
                label={"All Jobs"}
                filterData={filterData.data?.data}
                viewLink={"admin"}
                showBtn={true}
              />
            )}
          </div>
        </main>
      </DashboardLayout>
    </Layout>
  );
};
