import React from "react";
import {
  Layout,
  DashboardLayout,
  Loader,
  BackButton,
} from "../../../../components/UI/index";
import { useQuery } from "react-query";
import fetchData from "../../../../helpers/fetchData";
import { useRouter } from "next/router";

////////////////////////////////////////
export default function MembersDetailPage() {
  return <MembersDetailComponent />;
}

export const MembersDetailComponent = () => {
  const router = useRouter();
  const { group_id } = router.query;
  const { data, isLoading } = useQuery({
    enabled: group_id !== null,
    queryKey: ["group-members", group_id],
    queryFn: async () => {
      return await fetchData(`/admin/get-group-members/${group_id}`);
    },
  });

  if (isLoading) return <Loader />;
  return (
    <Layout showNav={false}>
      <DashboardLayout authRole={["user"]} pageTitle={"Group Members"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          {/* head */}
          <div className="w-full flex items-center gap-3">
            <BackButton />
            <h2 className="flex flex-col font-semibold lg:text-2xl text-xl text-gray-900">
              Group Members
            </h2>
          </div>
          {/* list */}
          <div className="flex flex-col gap-2 w-4/5 bg-gray-50 rounded-md px-5 py-6 shadow">
            <ul className="list-none">
              <li className="text-neutral-800 border-b-2 border-neutral-500 py-1.5 text-lg lg:text-xl font-medium">
                Admin
              </li>
              <li className="text-neutral-700 p-1.5 capitalize text-base">
                {data?.data[0]?.creator_name}
              </li>
            </ul>
            <ul className="list-none">
              <li className="flex justify-between text-neutral-800 border-b-2 border-neutral-500 py-1.5 text-lg lg:text-xl font-medium">
                All Members
                <span className="text-base">
                  Total {data?.data[0]?.members?.length}
                </span>
              </li>
              {data?.data[0]?.members?.length > 0 &&
                data?.data[0]?.members?.map((member) => (
                  <li className="hover:bg-neutral-300 transition-all ease-in duration-300 flex justify-between items-center capitalize text-neutral-800 p-2 text-base my-1">
                    {member?.name}
                    <span className="flex items-center gap-2">
                      <a href={`mailto:${member?.email}`}>
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
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                      </a>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </main>
      </DashboardLayout>
    </Layout>
  );
};
