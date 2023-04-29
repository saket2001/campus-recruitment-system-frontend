import React from "react";
import { NotificationItem } from "./NotificationItem";

export const NotificationList = ({ data, showBody, showDelete }) => {
  return (
    <ul className="list-none w-full gap-1 flex flex-col">
      {data &&
        data?.map((d) => (
          <NotificationItem
            showBody={showBody}
            showDelete={showDelete}
            key={d?._id}
            data={d}
          />
        ))}
    </ul>
  );
};
