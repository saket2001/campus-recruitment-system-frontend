import React, { useCallback } from "react";
import {
  Layout,
  DashboardLayout,
  Loader,
  BackButton,
} from "../../../../components/UI/index";
import { useMutation, useQuery } from "react-query";
import fetchData from "../../../../helpers/fetchData";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

////////////////////////////////////////
export default function MembersDetailPage() {
  return <MembersDetailComponent />;
}

export const MembersDetailComponent = () => {
  const router = useRouter();
  const { group_id } = router.query;

  const { data, isLoading } = useQuery({
    enabled: group_id !== null,
    queryKey: ["admin-group-members", group_id],
    queryFn: async () => {
      return await fetchData(`/admin/get-group-members/${group_id}`);
    },
  });

  // delete group member
  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: async (values) => {
      return await fetchData(
        `/admin/delete-group-member`,
        {
          method: "DELETE",
          body: JSON.stringify(values),
        },
        {
          "Content-type": "application/json",
        }
      );
    },
    onSuccess: (res) => {
      notify(res.message);
      setTimeout(() => {
        window?.location?.reload();
      }, 1500);
    },
  });

   const notify = useCallback((msg) => toast(msg));

  if (isLoading) return <Loader />;
  if (isDeleting) return <Loader />;

  return (
    <Layout showNav={false}>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        theme="light"
      />
      <DashboardLayout authRole={["admin"]} pageTitle={"Group Members"}>
        <main className="min-h-screen h-full p-5 flex flex-col gap-2 items-center py-4">
          {/* head */}
          <div className="w-full flex gap-3 items-center mb-3">
            <BackButton />
            <h2 className="flex flex-col font-semibold lg:text-2xl text-xl text-gray-900">
              Group Members
            </h2>
          </div>
          {/* list */}
          <div className="flex flex-col gap-2 w-4/5 py-6 px-5 rounded-md bg-gray-50 shadow">
            {/* admin name */}
            <ul className="list-none">
              <li className="text-neutral-800 font-medium border-b-2 border-neutral-500 py-1.5 text-lg lg:text-xl">
                Admin
              </li>
              <li className="text-neutral-700 p-1.5 capitalize text-base">
                {data?.data && data?.data[0]?.creator_name}
              </li>
            </ul>
            {/* group members */}
            <ul className="list-none">
              <li className="flex justify-between text-neutral-800 font-medium border-b-2 border-neutral-500 py-1.5 text-lg lg:text-xl">
                All Members
                <span className="text-base">
                  Total {data?.data && data?.data[0]?.members?.length}
                </span>
              </li>
              {data?.data &&
                data?.data[0]?.members?.map((member) => (
                  <li
                    key={member?.user_id}
                    className="flex justify-between items-center capitalize text-neutral-800 p-2 text-base my-1 hover:bg-neutral-300 transition-all ease-in duration-300 "
                  >
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
                      <button
                        onClick={() =>
                          mutate({
                            group_id: data?.data[0]?._id,
                            user_id: member?.user_id,
                          })
                        }
                        className="hover:bg-neutral-300 p-2 rounded-full ease-in transition-all duration-200"
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
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
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
