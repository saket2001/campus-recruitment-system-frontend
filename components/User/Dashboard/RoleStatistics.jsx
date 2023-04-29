import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// const data = {
//   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//   datasets: [
//     {
//       label: "# of Votes",
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         "red",
//         "rgba(54, 162, 235, 0.2)",
//         "rgba(255, 206, 86, 0.2)",
//         "rgba(75, 192, 192, 0.2)",
//         "rgba(153, 102, 255, 0.2)",
//         "rgba(255, 159, 64, 0.2)",
//       ],
//       borderColor: [
//         "rgba(255, 99, 132, 1)",
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 206, 86, 1)",
//         "rgba(75, 192, 192, 1)",
//         "rgba(153, 102, 255, 1)",
//         "rgba(255, 159, 64, 1)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

function random_rgba() {
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const z = Math.floor(Math.random() * 256);
  const bgColor = "rgb(" + x + "," + y + "," + z + ")";
  return bgColor;
}

export const RoleStatistics = ({ data }) => {
  useEffect(() => {
    if (data) {
      data["datasets"][0]["backgroundColor"] = data?.labels?.map((d) =>
        random_rgba()
      );
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-md p-4 w-full h-fit">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-medium text-neutral-600 lg:text-xl text-lg text-left">
          Previous Year Roles Demand
        </h1>
        <p className="font-medium text-neutral-600 text-sm px-2">
          ( {new Date().getFullYear() - 1} - {new Date().getFullYear()} )
        </p>
      </div>
      {data && data["datasets"]?.length > 0 && (
        <div className="h-1/2 w-3/4 flex items-center justify-center">
          <Doughnut data={data} />
        </div>
      )}
    </div>
  );
};
