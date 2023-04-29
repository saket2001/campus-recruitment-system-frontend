import React from "react";
import { DashboardLayout,Layout,Loader } from "../../../components/UI/index";
import fetchData from "../../../helpers/fetchData";
import { JobBoard } from "../../../components/UI/job/JobBoard";
import { useQuery } from "react-query";

export default function AppliedJobsPage() {
  // all user saved job data
  const { data: appliedJobData, isLoading: isLoading } = useQuery(
    "applied-jobs",
    async () => await fetchData("/user/applied-jobs"),
    { staleTime: 50000 }
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

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["user"]} pageTitle={"My Applied Jobs"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          <div className="lg:w-4/5 w-full h-full grid grid-cols-1 gap-3 lg:p-3 z-0 relative">
            {/* all jobs */}
            {appliedJobData && (
              <JobBoard
                data={appliedJobData?.data}
                label={"All Applied Jobs"}
                filterData={filterData?.data}
                showSave={false}
                showRoundStatusBtn={true}
              />
            )}
          </div>
        </main>
      </DashboardLayout>
    </Layout>
  );
}
