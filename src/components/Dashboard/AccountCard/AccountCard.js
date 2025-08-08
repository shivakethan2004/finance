import React from "react";
import AccountImg from "@/assets/images/account.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { BASE_URL } from "@/api/interceptor";
import Link from "next/link";

export default function Account({ data, key }) {
  // Function to render avatar with initials if logo does not exist
  const renderAvatar = () => {
    const initials = data.name ? data.name.charAt(0).toUpperCase() : '';
    return (
      <div className="h-32 w-32 flex justify-center items-center bg-gray-300 rounded-full">
        <span className="text-white text-2xl">{initials}</span>
      </div>
    );
  };

  return (
    <Link href={'/accounts/' + data?.slug} key={key}>
      <div className='border border-gray-300 w-[15rem] p-2 rounded-lg' key={key}>
        <div className='py-6 px-3 h-30 w-30 flex justify-center items-center'>
          {/* Conditionally render logo or avatar */}
          {data.logo ? (
            <img src={BASE_URL + data?.logo} alt='account image' className="h-32 w-32 rounded-full" />
          ) : (
            renderAvatar()
          )}
        </div>
        <div className='w-full h-[1px] bg-blue-300'></div>
        <div className='flex flex-row justify-between items-center px-2 pt-2 gap-4'>
          <h1>{data.name}</h1>
          <ArrowForwardIosIcon className='text-sm' />
        </div>
      </div>
    </Link>
  );
}
