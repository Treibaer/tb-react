import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClosedTicketsChart: React.FC<{
  closedTickets: { id: number; closedDate: Date }[];
  openTickets: { id: number; createdAt: Date }[];
}> = ({ closedTickets, openTickets }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Closed Tickets",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Open Tickets",
        data: [],
        backgroundColor: "rgba(25, 99, 132, 0.6)",
        borderColor: "rgba(25, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const ticketsCountMap = last30Days.reduce(
      (acc: Record<string, { closed: number; open: number }>, date) => {
        acc[date] = { closed: 0, open: 0 };
        return acc;
      },
      {}
    );

    closedTickets.forEach((ticket) => {
      const closedDate = new Date(ticket.closedDate)
        .toISOString()
        .split("T")[0];
      if (ticketsCountMap[closedDate] !== undefined) {
        ticketsCountMap[closedDate].closed += 1;
      }
    });

    openTickets.forEach((ticket) => {
      const createdAtDate = new Date(ticket.createdAt)
        .toISOString()
        .split("T")[0];
        
      if (last30Days.includes(createdAtDate)) {
        ticketsCountMap[createdAtDate].open += 1;
      }
    });

    setChartData({
      labels: last30Days,
      datasets: [
        {
          label: "Closed Tickets",
          data: last30Days.map((date) => ticketsCountMap[date].closed),
          backgroundColor: "rgba(34, 139, 34, 0.6)",
          borderColor: "rgba(34, 139, 34, 0.6)",
          borderWidth: 1,
        },
        {
          label: "Open Tickets",
          data: last30Days.map((date) => ticketsCountMap[date].open),
          backgroundColor: "rgba(100, 149, 237, 0.6) ",
          borderColor: "rgba(100, 149, 237, 0.6) ",
          borderWidth: 1,
        },
      ],
    });
  }, [closedTickets, openTickets]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Closed and Open Tickets in the Last 30 Days",
      },
    },
    scales: {
      x: { display: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <div>
      <h2>Tickets (Last 30 Days)</h2>
      {chartData.labels.length > 0 && (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default ClosedTicketsChart;
