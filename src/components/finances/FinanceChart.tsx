import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const FinanceChart: React.FC<{ data: number[]; labels: string[] }> = ({
  data,
  labels,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        animation: false,
        data,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
  };

  return <Line data={chartData as any} options={options} />;
};

export default FinanceChart;
