import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import pdf from "@/assets/images/icons/pdf.png";
import png from "@/assets/images/icons/png.png";
import Image from "next/image";

const NewTransaction = () => {
  const breadcrumbs = [
    <Link underline='hover' key='1' color='inherit' href='/'>
      MUI
    </Link>,
    <Link
      underline='hover'
      key='2'
      color='inherit'
      href='/material-ui/getting-started/installation/'
    >
      Core
    </Link>,
    <Typography key='3' color='text.primary'>
      Breadcrumb
    </Typography>,
  ];
  return (
    <div className='p-8 flex flex-col gap-10'>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize='small' />}
        aria-label='breadcrumb'
      >
        {breadcrumbs}
      </Breadcrumbs>
      <div className='flex flex-row flex-wrap gap-12 sm:gap-[4.5rem]'>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={pdf} height={60} width={60} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={pdf} height={60} width={60} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={pdf} height={60} width={60} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={pdf} height={60} width={60} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={pdf} height={60} width={60} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={pdf} height={60} width={60} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={pdf} height={60} width={60} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={png} height={65} width={65} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={png} height={65} width={65} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
        <div className='flex flex-col gap-4 items-center border border-gray-300 rounded-lg py-10 px-4 relative'>
          <Image src={png} height={65} width={65} alt='image' />
          <div className='text-sm'>Chair_Order_Invoice.pdf</div>
          <div className='absolute top-2 right-4'>X</div>
        </div>
      </div>
      <div className='place-self-end px-32 bg-[#2E90FA] py-3 font-semibold text-white text-center rounded-full'>
        Upload Invoice{" "}
      </div>
    </div>
  );
};

export default NewTransaction;
