import DashboardNavbar from "@/components/Dashboard/DashboardNavbar/DashboardNavbar";
import Logo from "@/assets/images/fiingLogo.svg";
import UserImage from "@/assets/images/demoUser.jpg";
import SideNavbar from "@/components/Dashboard/SideNavbar/SideNavbar";
import { FolderProvider } from "../context/FolderProvider";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <FolderProvider>
          <section className="w-full h-fit">
            <DashboardNavbar
              logo={Logo}
              userimage={UserImage}
              username={"Ankit"}
            />
            <div className="flex flex-row h-[90vh]">
              <div className="">
                <SideNavbar />
              </div>

              <div className=" overflow-y-scroll w-full">{children}</div>
            </div>
          </section>
        </FolderProvider>
      </body>
    </html>
  );
}
