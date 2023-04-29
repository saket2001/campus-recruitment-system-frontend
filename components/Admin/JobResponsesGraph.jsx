import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect } from "react";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  width: "100%",
};

// // list of jobs created
// const labels = ["January", "February", "March"];

// const data1 = {
//   labels,
//   datasets: [
//     {
//       label: "React Js Developer",
//       data: [54, 64,2],
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
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

export const JobResponsesGraph = ({ data }) => {
  // useEffect(() => {
  //   if (data) {
  //     data["datasets"][0]["backgroundColor"] = data?.labels?.map((d) =>
  //       random_rgba()
  //     );
  //   }
  // })

  return (
    <div className="bg-white rounded-md p-4 w-full h-full">
      <h1 className="font-medium text-neutral-600 lg:text-xl text-lg">
        Response Count
      </h1>
      <Bar options={options} data={data} />
    </div>
  );
};
