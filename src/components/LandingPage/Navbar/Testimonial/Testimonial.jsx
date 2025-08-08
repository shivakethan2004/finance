import Image from "next/image";
import React from "react";
import demoUser from "@/assets/images/demoUser.jpg";
import quotes from "@/assets/images/icons/Quotes.png";
import { FaLinkedin } from "react-icons/fa";

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center mt-14'>
      <h1 className='text-xl sm:text-3xl font-semibold'>
        Hear it from our satisfied customers.
      </h1>
      <div className='flex flex-col sm:flex-row justify-around mx-auto gap-4 py-6 my-6'>
        <div className='bg-white border border-[#E4E7EC] w-96 rounded-3xl m-3 p-5 flex flex-col justify-between gap-4'>
          <div>
            <Image src={quotes} alt='demo user' />
          </div>
          <div className='font-medium'>
            As a busy entrepreneur, time is of the essence, and Fiing has saved
            me countless hours of manual data entry. The accuracy and efficiency
            of Fiing have made it an indispensable tool in my daily operations.
          </div>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row gap-2 justify-between items-center'>
              <div>
                <Image
                  src={demoUser}
                  alt='demo user'
                  className='w-14 h-14 rounded-full'
                />
              </div>
              <div className='flex flex-col'>
                <div className='text-lg font-bold text-blue-600'>
                  Atul Singhal
                </div>
                <div>Co-founder, Cuvette</div>
              </div>
            </div>
            <div className='text-blue-600 text-2xl'>
              <FaLinkedin />
            </div>
          </div>
        </div>
        {/* second testimonial */}
        <div className='bg-white border border-[#E4E7EC] w-96 rounded-3xl m-3 p-5 flex flex-col justify-between gap-4'>
          <div>
            <Image src={quotes} alt='demo user' />
          </div>
          <div className='font-medium'>
            Fiing has not only met but exceeded our expectations. The automation
            is seamless, and the accuracy in accounting is unparalleled. Fiing
            is a must-have for any business looking to elevate their financial
            management.
          </div>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row gap-2 justify-between items-center'>
              <div>
                <Image
                  src={demoUser}
                  alt='demo user'
                  className='w-14 h-14 rounded-full'
                />
              </div>
              <div className='flex flex-col'>
                <div className='text-lg font-bold text-blue-600'>Swatantra</div>
                <div>Founder, WhatBuilds</div>
              </div>
            </div>
            <div className='text-blue-600 text-2xl'>
              <FaLinkedin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
