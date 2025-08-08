import Image from "next/image";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import JumbosterImage from "@/assets/images/jumbosterImage.png";

const Jumboster = () => {
  return (
    <>
      <div className='flex flex-row justify-between items-center z-1 relative mt-10 sm:mt-0'>
        {/* Corner Circle */}
        <div className='absolute -top-44 -left-44 w-80 h-80 rounded-full border-2 border-gray-200' />
        <div className='absolute -top-28 -left-32 w-80 h-80 rounded-full border-2 border-gray-200' />

        <div className='z-10 flex flex-col items-start gap-8 ml-8 sm:ml-24'>
          <h1 className='text-2xl sm:text-5xl font-bold sm:w-[120%] leading-tight'>
            Your Fintech Solution <br className='hidden sm:block' /> for
            Effortless <br className='hidden sm:block' /> Accounting with
            <span className='text-blue-500 ml-2 relative'>
              AI
              <span className='bg-purple-500 h-[3px] w-16 absolute bottom-[2px] -left-2 -rotate-6' />
            </span>
          </h1>
          <button className='flex justify-center items-center bg-gradient-to-r from-purple-400 to-blue-500 text-white sm:text-xl font-semibold py-2 px-2 sm:px-10 rounded-lg'>
            Try Fiing <MdOutlineKeyboardArrowRight />
          </button>
        </div>
        <div>
          <Image src={JumbosterImage} alt='jumboster image not found' />
        </div>
      </div>
    </>
  );
};

export default Jumboster;
