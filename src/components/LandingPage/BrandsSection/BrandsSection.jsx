import logo1 from "@/assets/images/Logo/Logo1.svg";
import logo2 from "@/assets/images/Logo/Logo2.svg";
import logo3 from "@/assets/images/Logo/Logo3.svg";
import logo4 from "@/assets/images/Logo/Logo4.svg";
import logo5 from "@/assets/images/Logo/Logo5.svg";
import logo6 from "@/assets/images/Logo/Logo6.svg";
import logo7 from "@/assets/images/Logo/Logo7.svg";
import logo8 from "@/assets/images/Logo/Logo8.svg";
import logo9 from "@/assets/images/Logo/Logo9.svg";
import logo10 from "@/assets/images/Logo/Logo10.svg";
import logo11 from "@/assets/images/Logo/Logo11.svg";
import logo12 from "@/assets/images/Logo/Logo12.svg";
import logo13 from "@/assets/images/Logo/Logo13.svg";
import logo14 from "@/assets/images/Logo/Logo14.svg";
import Image from "next/image";

const BrandsSection = () => {
  // const [logos ,setLogos] = useState();

  // setLogos([logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo8, logo9, logo10, logo11, logo12 ,logo13, logo14]);

  return (
    <>
      <div className='flex flex-col items-center mt-4'>
        <h1 className='text-3xl font-semibold'>
          Trusted by{" "}
          <span className='font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent'>
            400+
          </span>{" "}
          brands
        </h1>
        <div className='flex flex-row flex-wrap items-center justify-center gap-8 my-8 px-4 mx-8'>
          <Image src={logo1} alt='logo not found' />
          <Image src={logo2} alt='logo not found' />
          <Image src={logo3} alt='logo not found' />
          <Image src={logo4} alt='logo not found' />
          <Image src={logo5} alt='logo not found' />
          <Image src={logo6} alt='logo not found' />
          <Image src={logo7} alt='logo not found' />
          <Image src={logo8} alt='logo not found' />
          <Image src={logo9} alt='logo not found' />
          <Image src={logo10} alt='logo not found' />
          <Image src={logo11} alt='logo not found' />
          <Image src={logo12} alt='logo not found' />
          <Image src={logo13} alt='logo not found' />
          <Image src={logo14} alt='logo not found' />
        </div>
      </div>
    </>
  );
};

export default BrandsSection;
