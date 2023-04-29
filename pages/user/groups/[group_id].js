import React from "react";
import { NoticeBoard } from "../../../components/Admin/NoticeBoard";
import {
  Layout,
  DashboardLayout,
  BackButton,
  Loader,
} from "../../../components/UI/index";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import fetchData from "../../../helpers/fetchData";

//////////////////////////////////
export default function Group() {
  return <GroupComponent />;
}

export const GroupComponent = () => {
  const router = useRouter();
  const { group_id } = router.query;

  const {
    data: groupData,
    isLoading,
    isError,
  } = useQuery({
    enabled: group_id !== null,
    queryKey: ["group", group_id],
    queryFn: async () => await fetchData(`/get-notices/${group_id}`),
  });

  console.log(groupData);

  if (isLoading) return <Loader />;

  return (
    <Layout showNav={false}>
     
      <DashboardLayout authRole={["user"]} pageTitle={"Group"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          {/* heading */}
          <div className="w-full flex gap-3">
            <BackButton />
            <h2 className="flex flex-col font-semibold lg:text-2xl text-xl text-neutral-900">
              Group Details
            </h2>
          </div>
          {/* board */}
          {groupData?.data && (
            <NoticeBoard
              groupDetails={groupData?.data["group_details"]}
              noticesArr={groupData?.data["notices"]}
              group_id={group_id}
              showTabs={false}
              viewLink={"user"}
            />
          )}
        </main>
      </DashboardLayout>
    </Layout>
  );
};
