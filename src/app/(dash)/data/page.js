import CreateCompanyButton from "@/components/Dashboard/CreateCompanyButton/CreateCompanyButton";
import DashboardImage from "@/assets/images/dashboardImage.png";
import Image from "next/image";
import CompanyData from "@/layouts/CompanyData";
import NewTransaction from "@/layouts/NewTransaction";
import CompanyDetails from "@/layouts/CompanyDetails";

export default function Home() {
  return (
    <>
      <CompanyData />
      <NewTransaction />
      <CompanyDetails />
    </>
  );
}
