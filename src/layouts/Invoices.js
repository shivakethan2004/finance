"use client";
import { getCompanyData } from "@/api/companies";
import InvoiceTable from "@/components/Dashboard/Table/InvoiceTable";
import useCompanyName from "@/utils/useCompanyName";
import { Breadcrumbs, CircularProgress } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Invoices = () => {
  const companyname = useCompanyName();
  const currentDate = new Date();
  const twoDaysAgo = new Date(currentDate);
  twoDaysAgo.setDate(currentDate.getDate() - 30);
  const [startDate, setStartDate] = useState(twoDaysAgo);
  const [endDate, setEndDate] = useState(currentDate);
  const [data, setData] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [isFetching, setisFetching] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setisSuccess] = useState(true);
  const [selectedOption, setselectedOption] = useState("upload_date");



  const fetchData = async () => {
    try {
      // Fetch data using the current startDate and endDate
      const newData = await getCompanyData(companyname, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), selectedOption);
      // Update the data state with the new data
      // console.log("data-------------------")
      // console.log(newData.data);
      setData(newData.data);
      setisFetching(false);
      setisSuccess(true);
    
    } catch (error) {
      // Handle error if any
      console.error("Error fetching data:", error);
      setIsError(true);
      setisSuccess(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    // console.log("Reached---------------------")
    // Refetch data when startDate or endDate changes
    if (startDate && endDate && selectedOption) {
      fetchData();
    }
  }, [startDate, endDate, selectedOption]);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/accounts">
      Accounts
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="text.primary"
      href={`/accounts/${companyname}`}
    >
      {companyname}
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="text.primary"
      href={`/accounts/${companyname}/invoices`}
    >
      Invoices
    </Link>
  ];

  if(isFetching) {
    return <div className="h-[70vh] grid place-content-center">
      <CircularProgress color="primary" size="4rem"/>
    </div>
  }
  return (
    <div className="px-8 pt-10 pb-6">
      <div className="flex justify-between">
        <div>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </div>

        <div className="flex gap-4">
          <div className="text-xs">
            <select className="px-4 py-2 border border-primary rounded bg-white" value={selectedOption} onChange={(e) => (setselectedOption(e.target.value))}>
              <option value="upload_date">Upload Date</option>
              <option value="invoice_date">Invoice Date</option>
            </select>
          </div>
          <div className="border p-2 rounded text-xs ">
            <label>Start Date:</label>
            <input className="border border-primary mr-4 ml-1 px-2 rounded " type="date" value={format(startDate, 'yyyy-MM-dd')} onChange={(e) => {setStartDate(e.target.value);if(e.target.value>endDate) setEndDate(e.target.value);}} />
            <label>End Date:</label>
            <input className="border border-primary ml-1 px-2 rounded " min={format(startDate, 'yyyy-MM-dd')} type="date" value={format(endDate, 'yyyy-MM-dd')} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>
      {!isLoading ? (
        isError ? (
          <div className="h-[70vh] grid place-content-center">
            Error occurred while fetching data.
            <Link href={`/accounts/${companyname}/upload`}>
              Upload Invoices
            </Link>
          </div>
        ) : isSuccess && data?.length > 0 ? (
          <div className="mt-5 h-[75vh] overflow-auto border border-[#e0e0e0]">
            <InvoiceTable data={data} />
          </div>
        ) : (
          <div className="h-[70vh] grid place-content-center">
            No invoices found.
            <Link href={`/accounts/${companyname}/upload`}>
              Upload Invoices
            </Link>
          </div>
        //   <div className="h-[80vh] grid place-content-center">
        //   <CircularProgress size="4rem" />
        // </div>
        )
      ) : (
        <div className="h-[80vh] grid place-content-center">
          <CircularProgress size="4rem" />
        </div>
      )}
    </div>
  );
};

export default Invoices;
