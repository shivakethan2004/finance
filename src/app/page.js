import Advantages from "@/components/LandingPage/Advantages/Advantages";
import BrandsSection from "@/components/LandingPage/BrandsSection/BrandsSection";
import FaqsSection from "@/components/LandingPage/FaqsSection/FaqsSection";
import FeatureSection from "@/components/LandingPage/FeatureSection/FeatureSection";
import Footer from "@/components/LandingPage/Footer/Footer";
import Jumboster from "@/components/LandingPage/Jumboster/Jumboster";
import Image from "next/image";
import Logo from "@/../public/Logo.svg";
import CreateCompanyButton from "@/components/Dashboard/CreateCompanyButton/CreateCompanyButton";
import DashboardImage from "@/assets/images/dashboardImage.png";
import LogoM from "@/assets/images/fiingLogo.svg";
import Navbar from "@/components/LandingPage/Navbar/Navbar";
import Testimonial from "@/components/LandingPage/Navbar/Testimonial/Testimonial";


export default function Home() {
  return (
    <>
      <Navbar logo={LogoM} />
      <Jumboster />
      <FeatureSection />
      <Advantages />
      <Testimonial />
      <BrandsSection />
      <FaqsSection />
      <Footer logo={Logo} />
    </>
  );
}
