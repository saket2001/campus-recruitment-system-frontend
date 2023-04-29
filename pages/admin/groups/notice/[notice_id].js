import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import {
  Layout,
  DashboardLayout,
  BackButton,
  Loader,
} from "../../../../components/UI/index";
import dateFormatter from "../../../../helpers/dateFormatter";
import fetchData from "../../../../helpers/fetchData";

export default function Notice() {
  return <NoticeDetail />;
}

const NoticeDetail = () => {
  const router = useRouter();
  const { notice_id } = router.query;

  const { data, isLoading, isError } = useQuery({
    enabled: notice_id !== undefined,
    queryKey: ["notice", notice_id],
    queryFn: async () => {
      const res = await fetchData(`/get-notice/${notice_id}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  console.log(data);

  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["admin", "user"]} pageTitle={"Notice Detail"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 py-4">
          {/* heading */}
          <div className="w-full flex gap-3">
            <BackButton />
            <h2 className="flex flex-col font-semibold lg:text-2xl text-xl text-neutral-900">
              Notice Details
            </h2>
          </div>
          {/* board */}
          <div
            key={data?._id}
            className="bg-white px-4 py-3 gap-2 flex flex-col rounded-md shadow hover:shadow-md transition-all ease-in lg:mx-5 my-2"
          >
            {/* header with Creator Name, date and icon */}
            <div className="flex py-2 border-b border-neutral-400">
              <span className="flex flex-col w-full">
                <span className="relative flex justify-between items-center w-full">
                  <h3 className="text-neutral-700 font-medium text-lg">
                    Admin
                  </h3>
                </span>
                <p className="text-sm text-neutral-500">
                  {dateFormatter(data?.created_at)}
                </p>
              </span>
            </div>
            {/* title */}
            <h3 className="capitalize text-neutral-800 font-semibold text-lg">
              {data?.title}
            </h3>
            {/* body with short */}
            <p className="text-base text-neutral-600">
              {data?.body}
            </p>
          </div>
        </main>
      </DashboardLayout>
    </Layout>
  );
};
