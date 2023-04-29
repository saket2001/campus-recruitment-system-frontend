import React from "react";
import { GroupItem } from "./GroupItem";

export const GroupBoard = ({
  title,
  groupsList,
  showDelete = false,
  showExit = false,
  viewLink,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 justify-start p-3">
      <h2 className="lg:text-xl text-lg font-medium text-neutral-700">
        {title}
      </h2>
      <ul className="flex lg:flex-row flex-col items-center flex-wrap gap-6 my-2">
        {groupsList?.length > 0 &&
          groupsList?.map((data) => (
            <GroupItem
              key={data?._id}
              showDelete={showDelete}
              showExit={showExit}
              data={data}
              viewLink={viewLink}
            />
          ))}
      </ul>
    </div>
  );
};
