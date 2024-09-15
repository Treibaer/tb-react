import HeaderView from "../components/HeaderView";
import { Breadcrumb } from "../models/breadcrumb";

export default function Dashboard() {
  const breadcrumbs: Breadcrumb[] = [{ title: "Home", link: "" }];
  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-6xl text-center mt-8">Welcome!</div>
    </>
  );
}
