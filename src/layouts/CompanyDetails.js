import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Image from "next/image";
import demoUser from "@/assets/images/demoUser.jpg";
const CompanyDetails = () => {
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
      <div className='flex flex-col gap-20 items-center'>
        <div className='flex gap-16'>
          <div className='flex flex-col gap-6'>
            <div className='w-5/12'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div>Lorem : ipsum dolor sit amet</div>
            <div>Lorem : ipsum dolor sit amet</div>
            <div>Lorem : ipsum dolor sit amet</div>
          </div>
          <Image src={demoUser} className=' w-64 h-64 rounded-xl' alt="img" />
        </div>
        <div className='flex gap-32'>
          <div className='flex flex-col gap-5 items-center border border-blue-400 px-16 py-6 rounded-xl'>
            <div>Annual Revenue</div>
            <div>2,48,000</div>
          </div>
          <div className='flex flex-col gap-5 items-center border border-blue-400 px-16 py-6 rounded-xl'>
            <div>Annual Revenue</div>
            <div>2,48,000</div>
          </div>
          <div className='flex flex-col gap-5 items-center border border-blue-400 px-16 py-6 rounded-xl'>
            <div>Annual Revenue</div>
            <div>2,48,000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
