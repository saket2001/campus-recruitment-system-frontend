import React from "react";
import fetchData from "../../../helpers/fetchData";
import { DashboardLayout, Layout, Loader } from "../../../components/UI/index";
import { JobBoard } from "../../../components/UI/job/JobBoard";
import { useQuery } from "react-query";

export default function SavedJobsPage() {
  // all user saved job data
  const { data: savedJobData, isLoading: isLoading } = useQuery(
    "saved-jobs",
    async () => await fetchData("/user/saved-jobs"),{staleTime: 50000}
  );

  // filter data
  const { data: filterData, isLoading: isLoading2 } = useQuery(
    "job-filters",
    async () => {
      return await fetchData("/get-filters");
    },
    {
      staleTime: 50000,
    }
  );

  if (isLoading && isLoading2) return <Loader />;
  console.log(savedJobData);

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["user"]} pageTitle={"My Saved Jobs"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          <div className="lg:w-4/5 w-full h-full grid grid-cols-1 gap-3 lg:p-3 z-0 relative">
            {/* all jobs */}
            {savedJobData && (
              <JobBoard
                data={savedJobData?.data?.saved_jobs}
                label={"All Saved Jobs"}
                filterData={filterData?.data}
                showSave={true}
                savedJobData={savedJobData}
              />
            )}
          </div>
        </main>
      </DashboardLayout>
    </Layout>
  );
}
