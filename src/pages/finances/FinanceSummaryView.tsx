import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { ROUTES } from "../../routes";

const FinanceSummaryView = () => {
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Finances", link: "" },
  ];

  return (
    <div>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-5xl text-center my-2">Finances</div>
    </div>
  );
};

export default FinanceSummaryView;
