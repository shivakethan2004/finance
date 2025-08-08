"use client";
import CustTable from "@/components/Dashboard/Table/Table";
import { useDataStore } from "@/store/zustand";
import { useQuery } from "@tanstack/react-query";
import { getCompanyData } from "@/api/companies";
import Modal from "@/components/common/Modal";
import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { Breadcrumbs, CircularProgress, TextField, InputAdornment } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { DateRange } from "@mui/icons-material";
import useCompanyName from "@/utils/useCompanyName";
import Link from "next/link";
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import ReactTable from "react-table";
import processInvoiceData from "@/utils/tallyFormater";

const Data = () => {
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState(null);
  const currentDate = new Date();
  const twoDaysAgo = new Date(currentDate);
  twoDaysAgo.setDate(currentDate.getDate() - 30);
  const [startDate, setStartDate] = useState(twoDaysAgo);
  const [endDate, setEndDate] = useState(currentDate);
  const companyname = useCompanyName();
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
      href={`data`}
    >
      Data
    </Link>
  ];

  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    if (data && data && data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      data.forEach((rowData) => {
        const values = Object.values(rowData);
        worksheet.addRow(values);
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${companyname}.xlsx`);
      });
    }
  };

  const downloadTallyExcell = () => {
    const formatedData = processInvoiceData(data);
    if (formatedData && formatedData.length > 0) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data');
  
      const headers = [
        'Voucher Date',
        'Voucher Type Name',
        'Voucher Number',
        'Reference No.',
        'Reference Date',
        'Ledger Name',
        'Ledger Amount',
        'Ledger Amount Dr/Cr',
        'Change Mode',
        'Voucher Narration',
        'Serial'
      ];
  
      worksheet.addRow(headers);
  
      formatedData.forEach((rowData) => {
        const values = headers.map((header) => rowData[header] || ''); // Ensure each value exists or set it as an empty string
        worksheet.addRow(values);
      });
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${companyname}_tally.xlsx`);
      });
    }
  }


  useEffect(() => {
    // console.log("Reached---------------------")
    // Refetch data when startDate or endDate changes
    if (startDate && endDate && selectedOption) {
      // fetchData();
    }
  }, [startDate, endDate, selectedOption]);

  if (isFetching) {
    return <div className="h-[70vh] grid place-content-center">
      <CircularProgress color="primary" size="4rem" />
    </div>
  }
  return (
    <div className="px-8 pt-10 pb-6">
      <div className="flex items-center justify-between pr-10">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
        <div className="flex gap-4">
          <div className="text-xs">
            <select className="px-4 py-2 border border-primary rounded bg-white" value={selectedOption} onChange={(e) => (setselectedOption(e.target.value))}>
              <option value="upload_date">Upload Date</option>
              <option value="invoice_date">Invoice Date</option>
            </select>
          </div>
          <div className="border p-2 rounded text-xs ">
            <div className="flex gap-1">
              <label>Start Date:</label>
              <input className="border border-primary mr-4 ml-1 px-2 rounded " type="date" value={format(startDate, 'yyyy-MM-dd')} onChange={(e) => { setStartDate(e.target.value); if (e.target.value > endDate) setEndDate(e.target.value); }} />
            </div>
            <div className="flex gap-1 mt-1 ml-1">
              <label>End Date:</label>
              <input className="border border-primary ml-1 px-2 rounded " min={format(startDate, 'yyyy-MM-dd')} type="date" value={format(endDate, 'yyyy-MM-dd')} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
          <div >
            <button onClick={downloadExcel} className="hover:text-primary hover:bg-white border border-primary bg-primary text-white rounded py-1 px-2 text-sm">Download Excel</button>
          </div>
          <div >
            <button onClick={downloadTallyExcell} className="hover:text-primary hover:bg-white border border-primary bg-primary text-white rounded py-1 px-2 text-sm">Download Tally Excel</button>
          </div>
          </div>
        </div>

      </div>
      <div className="flex flex-col gap-2 pt-5 justify-center items-center">
        {!isLoading ? (
          isError ? (
            <div className="h-[70vh] grid place-content-center">
              Error occurred while fetching data.
            </div>
          ) : isSuccess && data?.length > 0 ? (
            <div className="mt-3 h-[73vh] overflow-auto border border-[#e0e0e0] w-[100%]">
              <CustTable data={data} showStatus={true} />
            </div>
          ) : (
            <div className="h-[70vh] grid place-content-center">
              No invoices found.
              <Link href={`/accounts/${companyname}/upload`}>Upload Invoices</Link>
            </div>
            //   <div className="h-[70vh] grid place-content-center">
            //   <CircularProgress size="4rem" />
            // </div>
          )
        ) : (
          <div className="h-[70vh] grid place-content-center">
            <CircularProgress size="4rem" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Data;
