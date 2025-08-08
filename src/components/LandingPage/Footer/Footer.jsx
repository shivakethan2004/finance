import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = ({ logo }) => {
  return (
    <>
      <div className='bg-[#222222] w-full text-[#ffffff]'>
        <div className='flex flex-col sm:flex-row justify-around py-4 px-8 text-white text-sm'>
          <div className='flex flex-col justify-around items-start gap-4'>
            <Image src="/FiingWhiteLogo.png" alt='hello' height={100} width={100} />
            <p className='text-white text-sm w-80'>
              Fiing transforms financial workflows with cutting-edge AI
              automation, simplifying accounting tasks from invoice upload to
              precision-driven categorization. Our secure and adaptable solution
              caters to businesses of all sizes, offering real-time insights and
              empowering strategic decision-making. Elevate your financial
              management experience with Fiing – where efficiency meets
              innovation.
            </p>
            <div className='flex flex-row gap-6 my-4'>
              <div className='p-2 bg-white rounded-full'>
                <FaFacebook className='fill-black w-4 h-4' />
              </div>
              <div className='p-2 bg-white rounded-full'>
                <FaTwitter className='fill-black w-4 h-4' />
              </div>
              <div className='p-2 bg-white rounded-full'>
                <FaLinkedin className='fill-black w-4 h-4' />
              </div>
            </div>
          </div>
          {/* <div className='flex flex-col gap-3'>
            <div className='flex flex-row gap-3'>
              <h1>About Us</h1>
              <h1>Our Team </h1>
              <h1>Contact Us</h1>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='text-gray-500 border-b border-gray-500'>
                Our services
              </div>
              <h1>Audit and Insurance</h1>
              <h1>Taxation and Regulatory</h1>
              <h1>Startup Services</h1>
              <h1>Valuation and Fund Raising</h1>
            </div>
            <div className='flex flex-row gap-8 mt-6'>
              <div>
                <h1>Chennai</h1>
                <h1 className='text-gray-500 font-semibold'>044 3289629</h1>
              </div>
              <div>
                <h1>Chennai</h1>
                <h1 className='text-gray-500 font-semibold'>044 3289629</h1>
              </div>
            </div>
          </div> */}
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row gap-3 invisible'>
              <h1>About Us</h1>
              <h1>Our Team </h1>
              <h1>Contact Us</h1>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='text-gray-500 border-b border-gray-500'>
                Other Links
              </div>
              <h1>Legal Policy</h1>
              <h1>Term & Conditions</h1>
              <h1>Privacy Policy</h1>
            </div>
            <div className='flex flex-row gap-8 mt-6 invisible'>
              <div>
                <h1>Chennai</h1>
                <h1 className='text-gray-500 font-semibold'>044 3289629</h1>
              </div>
              <div>
                <h1>Chennai</h1>
                <h1 className='text-gray-500 font-semibold'>044 3289629</h1>
              </div>
            </div>
          </div>
        </div>
        <div className='text-gray-500 font-semibold text-[0.8rem] w-[80%] border-t border-gray-500 mx-auto pt-2 pb-6'>
          <h1>2024 © Copyright Fiing Tech</h1>
        </div>
      </div>
    </>
  );
};

export default Footer;
