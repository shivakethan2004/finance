import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CreateAccount from '@/layouts/CreateAccount';

export default function Home() {
  return (
    <>
      <div className="p-8">
        <CreateAccount/>
      </div>
    </>
  );
}
