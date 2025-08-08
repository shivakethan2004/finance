import Image from "next/image";
import Link from "next/link";

const Navbar = ({ logo }) => {
  return (
    <>
      <div className='flex flex-row justify-between items-center px-8 py-3 sticky top-0 z-[99] bg-white font-semibold'>
        <Link href={"/"}>
          <Image src={logo} alt='logo not found' />
        </Link>
        <div className='hidden sm:flex flex-row gap-2 sm:gap-8 items-center text-sm sm:text-base '>
          <a className='cursor-pointer'>Docs</a>
          <a className='cursor-pointer'>Product</a>
          <a className='cursor-pointer'>Our Team</a>
        </div>
        <div className='flex flex-row gap-2 sm:gap-8 items-center text-sm sm:text-base'>
          <a className='cursor-pointer'>Book a demo</a>
          <Link
            className='bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 hover:cursor-pointer'
            href='/signup'
          >
            Sign Up
          </Link>
          <Link className="cursor-pointer" href="/login">
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
