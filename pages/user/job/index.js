import React from "react";
import {
  DashboardLayout,
  Layout,
  Loader,
} from "../../../components/UI/index";
import fetchData from "../../../helpers/fetchData";
import { JobBoard } from "../../../components/UI/job/JobBoard";
import { useQuery } from "react-query";

export default function index() {
  return <JobListPage />;
}

const JobListPage = () => {
  // fetching data
  // recommended data
  const { data: myJobData, isLoading: isLoading1 } = useQuery(
    "recommended-jobs",
    async () => {
      return await fetchData("/get-jobs");
    }
  );

  // all jobs data
  const { data: allJobData, isLoading: isLoading2 } = useQuery(
    ["all-jobs"],
    async () => {
      return await fetchData("/get-jobs");
    }
  );

  // filter data
  const { data: filterData, isLoading: isLoading3 } = useQuery(
    "job-filters",
    async () => {
      return await fetchData("/get-filters");
    },
    {
      staleTime: 50000,
    }
  );

  // all user saved job data
  const { data: savedJobData, isLoading: isLoading4 } = useQuery(
    "saved-jobs",
    async () => {
      return await fetchData("/user/saved-jobs");
    },
    {
      staleTime: 50000,
    }
  );

  // job recommendations
  const { data: jobRecommendation, isLoading: isLoading5 } = useQuery(
    "jobs-recommendations",
    async () => {
      return await fetchData("/user/get-job-recommendations");
    },
    {
      staleTime: 50000,
    }
  );


  if (isLoading1 || isLoading2 || isLoading3 || isLoading4 || isLoading5)
    return <Loader text="Loading Job Board" />;

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["user"]} pageTitle={"Jobs Page"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          {/* heading */}
          <h2 className="flex flex-col font-semibold lg:text-2xl text-gray-800 text-xl lg:px-8">
            Job Section
          </h2>
          <div className="lg:w-4/5 w-full h-full grid grid-cols-1 gap-3 lg:p-3 z-0 relative">
            {/* recommended jobs */}
            {jobRecommendation && (
              <JobBoard
                data={jobRecommendation?.data?.recommendations}
                percentData={jobRecommendation?.data?.similarityPercentage}
                label={"Recommended Jobs"}
                filterData={filterData?.data}
                showSave={true}
                savedJobData={savedJobData}
              />
            )}
            {/* all jobs */}
            {allJobData && (
              <JobBoard
                data={allJobData?.data}
                filterData={filterData?.data}
                label={"All Jobs"}
                showSave={true}
                savedJobData={savedJobData}
              />
            )}
          </div>
        </main>
      </DashboardLayout>
    </Layout>
  );
};
