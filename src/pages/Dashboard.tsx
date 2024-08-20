import { Breadcrumb } from "../models/breadcrumb";
import HeaderView from "../components/HeaderView";

export default function Dashboard() {
  const breadcrumbs: Breadcrumb[] = [{ title: "Home", link: "/home" }];
  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div>
        <h1>Welcome!</h1>
      </div>
    </>
  );
}
