import { useEffect, useState } from "react";
import HeaderView from "../components/HeaderView";
import StatusSection from "../components/status/StatusSection";
import { Breadcrumb } from "../models/breadcrumb";
import { Status } from "../models/status";
import { ROUTES } from "../routes";
import Client from "../services/Client";

const client = Client.shared;

export const StatusView: React.FC = () => {
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Status", link: "" },
  ];
  const [status, setStatus] = useState<Status[]>([]);

  async function updateStatus() {
    const status = await client.get<Status[]>(`/status`);
    setStatus(status);
  }

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 30 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const developmentStates = status.filter((s) => s.type === "development");
  const productionStates = status.filter((s) => s.type === "production");
  const portfolioStates = status.filter((s) => s.type === "portfolio");
  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-5xl text-center my-2">
        <h1>Status</h1>
      </div>
      <div className="flex justify-between flex-wrap">
        <StatusSection title="Production" states={productionStates} />
        <StatusSection title="Development" states={developmentStates} />
        <StatusSection title="Portfolio" states={portfolioStates} />
      </div>
    </>
  );
};

export default StatusView;
