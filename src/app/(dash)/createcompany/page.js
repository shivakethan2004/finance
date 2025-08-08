import CreateCompanyButton from "@/components/Dashboard/CreateCompanyButton/CreateCompanyButton";
import DashboardImage from "@/assets/images/dashboardImage.png";
import Image from "next/image";


export default function account() {
    return (
      <>
        <div className="p-8">
          <h1 className="text-3xl font-semibold my-2">Accounts</h1>
          <h3 className="my-2">
            You have no clients accounts yet. Create an account to get started.
          </h3>
          <div className="my-8">
            <CreateCompanyButton />
          </div>
          <Image
            className="absolute right-0 bottom-0"
            src={DashboardImage}
            alt="background image not found"
          />
        </div>
      </>
    );
  }