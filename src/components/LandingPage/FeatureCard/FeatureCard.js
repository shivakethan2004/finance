import Image from "next/image";

const FeatureCard = ({ image, index, title, text }) => {
  return (
    <>
      <div className='bg-white w-80 rounded-3xl shadow-lg m-3 p-3'>
        <div className='flex items-center justify-center h-2/4 w-full'>
          <Image
            className='w-32 h-full object-cover rounded-t'
            src={image}
            alt='gif'
          />
        </div>

        <div className='w-full h-2/4 p-6'>
          <h1 className='bg-gradient-to-r from-blue-700 to-blue-400 w-fit text-center px-[0.76rem] py-[0.2rem] text-white rounded-full'>
            {index}
          </h1>
          <a href='#' className=' text-gray-700'>
            <span className='text-lg font-semibold tracking-wide '>
              {title}
            </span>
          </a>
          <p className='text-gray-600  leading-5 mt-1'>{text}</p>
        </div>
      </div>
    </>
  );
};

export default FeatureCard;
