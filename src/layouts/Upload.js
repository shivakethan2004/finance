"use client";
import { Breadcrumbs, CircularProgress } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDataStore, usePDFStore } from "@/store/zustand";
import PdfBlob from "@/components/Dashboard/Transaction/PdfBlob";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserStatus, uploadInvoice } from "@/api/companies";
import CustTable from "@/components/Dashboard/Table/Table";
import { Cancel, Check, Download } from "@mui/icons-material";
import { toast } from "react-toastify";
import useCompanyName from "@/utils/useCompanyName";
import { useRouter } from "next/navigation";
import useUserPermission from "@/utils/useUserPermission";


const Upload = () => {
  const files = usePDFStore((state) => state.pdfFiles);
  const fileInputRef = useRef(null);
  const addPDFFile = usePDFStore((state) => state.addPDFFile);
  const data = useDataStore((state) => state.data);
  const addData = useDataStore((state) => state.addData);
  const deletepdf = usePDFStore((state) => state.deletePDFFile);
  const deleteAllFiles = usePDFStore(state => state.deleteAllFiles)
  const permission = useUserPermission()

  const [pdf, setPdf] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const companyname = useCompanyName()
  const router = useRouter()

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
      href={`/accounts/${companyname}/upload`}
    >
      New transaction
    </Link>
  ];

  const handleFileInputChange = (e) => {
    const files = Array.from(fileInputRef.current.files);
    console.log(fileInputRef.current.files);
    setPdf(e.target.files[0]);
    files.forEach((file) => addPDFFile(file));
    // Clear the file input after uploading files
    fileInputRef.current.value = "";
  };

  const fiing = async () => {
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
    try {
       // Add a delay of 3 seconds before each API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      const response = await uploadInvoice(companyname,files[i]);
        addData(response);
        setSuccess(true);
      } catch (error) {
        setError(error.message);
        addData({detail: `unable to parsing file: ${files[i].name}` })
      } 
      setCurrentIndex(p => p+1)
    }
  };
  useEffect(() => {
    if (currentIndex === files.length) {
      setIsUploading(false);
      deleteAllFiles()
    }
  },[currentIndex])


  function returnResults(detail){
    if(!detail.includes("unable")){
      return <div className="text-green-500">{detail} <Check color="green"/></div>
    }else{
      return <div className="text-red-500">{detail} <Cancel color="red"/></div>
    }
  }
  return (
    <div className="px-8 pt-10 pb-6">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      {!isUploading && data.length <= 0   ? (
        <div className="py-6 flex justify-between">
          <div>Your Uploaded Files:</div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="text-primary font-medium"
          >
            + Add more files
            <input
              type="file"
              accept=".pdf, .png"
              multiple
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </button>
        </div>
      ) : (
        <div className="flex w-full justify-end">
          <div className="flex w-fit text-primary font-semibold text-base items-center gap-0.5 cursor-pointer">
            {/* <Download fontSize="small" />
            Download CSV */}
          </div>
        </div>
      )}
      {data.length <= 0 && !isUploading ? (
        <>
          <div className="h-[50vh] overflow-auto pt-4">
            <div className="grid md:grid-cols-4 lg:gap-14 md:w-[90%]">
              {files?.map((e, i) => (
                <PdfBlob name={e.name} key={i} />
              ))}
            </div>
          </div>
          {files?.length > 0 && (
            <div className="flex justify-end">
              <button
  className="cursor-pointer m-5 px-10 py-1 flex justify-center items-center text-xl border rounded-sm"
  onClick={() => {
    setIsUploading(true);
    fiing();
  }}
  style={{
    backgroundImage: 'linear-gradient(90deg, #0268FF -3.25%, #9747FF 50%, #FF38C7 103.25%)',
    borderImageSource: 'linear-gradient(90deg, #0268FF -3.25%, #9747FF 50%, #FF38C7 103.25%)',
    borderImageSlice: '1',
    WebkitTextFillColor: 'transparent', /* For Safari */
    WebkitBackgroundClip: 'text' /* For Safari */,
    borderRadius: '0.375rem' /* Border radius */,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: "bold",
    fontSize: "1.3rem"
  }}
>
  Fiing with AI <ChevronRightIcon className="text-purple-600"/>
</button>
            </div>
          )}
        </>
      ) : (
        <>
          {!isUploading || data ? (
            <>
              <div className="h-[68vh] grid place-content-center">
                {/* {data.map((e) => (
                  <div key={e} className="flex flex-col gap-10">
                    <CustTable data={e?.value} key={e?.inference} />
                  </div>
                ))} */}
                <div className="md:w-[40vw] w-full md:px-10 md:pt-10 md:pb-3 p-3 border border-gray-500 gird place-content-center overflow-auto">
                  {data.map((e,i) => (
                    <div key={i} className="py-2 text-center text-green-00">{returnResults(e.detail)}</div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                  {!isUploading ? <><Link
                    className="w-full flex justify-center bg-primary rounded-lg py-1 text-white"
                    // disabled={uploadInvoiceMutation.isPaused}
                    href={`/accounts/${companyname}/upload`}
                    onClick={() => router.reload()}
                    >
                    Upload Invoices
                  </Link>{" "}
                  <Link
                    className="w-full flex justify-center bg-white border py-1 border-primary rounded-lg text-primary"
                    // disabled={uploadInvoiceMutation.isPaused}
                    href={`/accounts/${companyname}/data`}
                    target="_blank"
                    >
                    View Invoices
                  </Link></> : <div className="col-span-2 flex justify-center"><CircularProgress /></div>}
                    </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[68vh] grid place-content-center">
              <CircularProgress size="5rem" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Upload;
