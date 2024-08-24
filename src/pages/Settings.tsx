import HeaderView from "../components/HeaderView";
import { Breadcrumb } from "../models/breadcrumb";
import { ROUTES } from "../routes";

export const Settings: React.FC = () => {
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Settings", link: "" },
  ];
  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-6xl text-center mt-8">
        <h1>Settings</h1>
      </div>
    </>
  );
};

export default Settings;
