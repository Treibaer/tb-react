import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Commit = {
  commitId: string;
  author: string;
  date: string;
  content: string;
};

// Example data
const commits: Commit[] = [
  {
    commitId: "9c26c88c6f890957dae80151f794b83d05b8346e",
    author: "Hannes Kühnel",
    date: "Fri Nov 1 21:14:41 2024 +0100",
    content: "add completion animation, switch to react-hot-toast & fa icons",
  },
  {
    commitId: "db886acf33b44781deac232ab1cf64aafd21b89c",
    author: "Hannes Kühnel",
    date: "Fri Nov 1 16:09:34 2024 +0100",
    content: "adjust windows scrollbars",
  },
  // Add more commit data as needed
];

// Function to calculate ISO week number
const getISOWeek = (date: Date) => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getUTCDay() + 6) % 7; // Get day number (0 = Monday, ..., 6 = Sunday)
  target.setUTCDate(target.getUTCDate() - dayNr + 3); // Move to Thursday of the same week
  const firstThursday = target.getUTCDate() - 3; // Get the first Thursday of the year
  target.setUTCDate(firstThursday + 3); // Set target to Thursday
  const weekNumber = Math.ceil(
    ((target.getTime() -
      new Date(Date.UTC(target.getUTCFullYear(), 0, 1)).getTime()) /
      86400000 +
      1) /
      7
  );
  return weekNumber;
};

const getCommitsPerWeek = (commits: Commit[]) => {
  const commitCounts: { [week: string]: number } = {};

  commits.forEach((commit) => {
    const date = new Date(commit.date);

    // Get the year and week number
    const year = date.getFullYear();
    const weekNumber = getISOWeek(date); // Custom function to get ISO week number

    // Create a week key (e.g., "2024-W44")
    const weekKey = `${year}-W${String(weekNumber).padStart(2, "0")}`;

    // Count the commits for each week
    commitCounts[weekKey] = (commitCounts[weekKey] || 0) + 1;
  });

  // Convert to arrays for labels and data
  const labels = Object.keys(commitCounts);
  const data = Object.values(commitCounts);

  return { labels, data };
};

const CommitLineChart: React.FC<{ commits: Commit[] }> = ({ commits }) => {
  const { labels, data } = getCommitsPerWeek(commits);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Commits per Week",
        data,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        reverse: true, // Reverse the x-axis
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Commits per Week",
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default CommitLineChart;
