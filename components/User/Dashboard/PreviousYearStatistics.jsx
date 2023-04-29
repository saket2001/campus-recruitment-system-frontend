import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
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

function random_rgba() {
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const z = Math.floor(Math.random() * 256);
  const bgColor = "rgb(" + x + "," + y + "," + z + ")";
  return bgColor;
}

export const PreviousYearStatistics = ({ data }) => {
  useEffect(() => {
    if (data) {
      data["datasets"][0]["backgroundColor"] = data?.labels?.map((d) =>
        random_rgba()
      );
    }
  });

  return (
    <div className="bg-white rounded-md p-4 w-full h-full">
      <div className="flex justify-between items-center ">
        <h1 className="font-medium text-neutral-600 lg:text-xl text-lg">
          Previous Year Placements
        </h1>
        <p className="font-medium text-neutral-600 text-sm">
          ( {new Date().getFullYear() - 1} )
        </p>
      </div>
      {data && data["datasets"]?.length > 0 && (
        <Bar options={options} data={data} />
      )}
    </div>
  );
};
