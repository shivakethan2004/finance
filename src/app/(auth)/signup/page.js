import Footer from "@/components/LandingPage/Footer/Footer";
import Navbar from "@/components/LandingPage/Navbar/Navbar";
import Logo from "@/../public/Logo.svg";
import LogoM from "@/assets/images/fiingLogo.svg";

import React from "react";
import SignUp from "@/components/Auth/SignUp";

const page = () => {
  return (
    <div>
      <Navbar logo={LogoM} />
      <div className="xl:grid xl:grid-cols-2 flex flex-col p-2 bg-gradient-to-br from-white via-blue-100 to-blue-700">
      <div className="grid place-content-center text-4xl font-bold">
          <div className="w-[25rem] leading-relaxed">
          Your Fintech Solution for Effortless
          Accounting with <span className="text-primary">AI</span>
          </div>
        </div>
        <div className="md:px-16 md:py-5">
          <SignUp />
        </div>
      </div>
      <Footer logo={Logo} />
    </div>
  );
};

export default page;
