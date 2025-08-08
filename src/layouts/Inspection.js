"use client";
import useCompanyName from "@/utils/useCompanyName";
import {
  Breadcrumbs,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCompanyData, getPendingInvoice } from "@/api/companies";
// import PDFViewer from '@/components/Dashboard/Checker/PdfView';
import Carousel from "@/components/Dashboard/Checker/Carousel";
import PDFViewer from "@/components/Dashboard/Checker/PdfView";
import { BASE_URL } from "@/api/interceptor";
import { ChevronRight } from "@mui/icons-material";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import useUserPermission from "@/utils/useUserPermission";
import { useRouter } from "next/navigation";

const Inspection = () => {
  const [selectedInvoice, setSelectedInvoice] = useState();
  const companyname = useCompanyName();
  const { data, isLoading, isFetched, isError, isSuccess, refetch } = useQuery({
    queryKey: ["next"],
    queryFn: () => getPendingInvoice(companyname)
  });
  const [showMore, setShowMore] = useState(false);
  const userStatus = useUserPermission();
  const router = useRouter();

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
      href={`/accounts/${companyname}/inspection`}
    >
      Inspection
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="text.primary"
      href={`/accounts/${companyname}/inspection`}
    >
      {data?.data?.file_name}
    </Link>
  ];
  const tableHeading = {
    fontWeight: "bold"
  };
  const handleShowMore = () => {
    setShowMore((p) => !p);
  };

  if (userStatus.isFetching) {
    return (
      <div className="h-[70vh] grid place-content-center">
        <CircularProgress size="4rem" />
      </div>
    );
  }
  if (userStatus?.data?.data?.permission_level !== "checker") {
    router.push("/accounts");
  }
  return (
    <div className="px-8 py-6 pb-2 flex flex-col gap-5">
      <div className="flex justify-between">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
        {/* <button className="bg-primary text-white px-5 py-0.5 text-xl rounded-lg flex items-center justify-center" onClick={() => refetch()}>Next <ChevronRight /></button> */}
        {/* <div>Pending Invoices: <span className="font-bold">{data?.data?.pending_invoices || 0}</span></div> */}
      </div>
      {data?.data?.detail ? (
        <div className="h-[70vh] grid place-content-center text-xl font-bold">
          {data.data.detail}
        </div>
      ) : (
        <>
          <div>
            {isSuccess && data?.data && (
              <PDFViewer
                {...data?.data}
              />
            )}
          </div>
          {!isLoading ? (
            isError ? (
              <div className="h-screen grid place-content-center">
                Something went wrong
              </div>
            ) : isFetched && data?.data ? (
              <div className="h-[25vh] overflow-auto">
                <TableContainer className="border border-[#e0e0e0]">
                  <Table>
                    <TableHead sx={tableHeading}>
                      <TableRow>
                        <TableCell sx={tableHeading}>Show More</TableCell>
                        <TableCell sx={tableHeading}>Invoice Number</TableCell>
                        <TableCell sx={tableHeading}>Merchant</TableCell>
                        <TableCell sx={tableHeading}>Date</TableCell>
                        <TableCell sx={tableHeading}>Total Price</TableCell>
                        <TableCell sx={tableHeading}>GST Number</TableCell>
                        <TableCell sx={tableHeading}>GST Amount</TableCell>
                        <TableCell sx={tableHeading}>CGST Amount</TableCell>
                        <TableCell sx={tableHeading}>SGST Amount</TableCell>
                        <TableCell sx={tableHeading}>TDS</TableCell>
                        <TableCell sx={tableHeading}>Gross Amount</TableCell>
                        <TableCell sx={tableHeading}>Net Amount</TableCell>
                        <TableCell sx={tableHeading}>Currency</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <IconButton size="small" onClick={handleShowMore}>
                            {showMore ? <FaChevronDown /> : <FaChevronRight />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{data.data.invoice_number}</TableCell>
                        <TableCell>{data.data.issued_by}</TableCell>
                        <TableCell>{data.data.date}</TableCell>
                        <TableCell>{data.data.total_price}</TableCell>
                        <TableCell>{data.data.gst_number}</TableCell>
                        <TableCell>{data.data.gst_amount}</TableCell>
                        <TableCell>{data.data.cgst_amount}</TableCell>
                        <TableCell>{data.data.sgst_amount}</TableCell>
                        <TableCell>{data.data.tds}</TableCell>
                        <TableCell>{data.data.gross_amount}</TableCell>
                        <TableCell>{data.data.net_amount}</TableCell>
                        <TableCell>{data.data.currency}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                {data.data.items && data.data.items.length > 0 && showMore && (
                  <TableContainer className="border border-[#e0e0e0] border-t-0">
                    <Table>
                      <TableHead>
                        <TableRow>
                          {Object.keys(data.data.items[0]).map((key) => (
                            <TableCell sx={tableHeading} key={key}>
                              {key}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.data.items.map((item, index) => (
                          <TableRow key={index}>
                            {Object.values(item).map((value, index) => (
                              <TableCell key={index}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            ) : (
              <div className="h-[70vh] grid place-content-center">
                No invoices found.
                <Link href={`/accounts/${companyname}/upload`}>
                  Upload Invoices
                </Link>
              </div>
            )
          ) : (
            <div className="h-[70vh] grid place-content-center">
              <CircularProgress size="4rem" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Inspection;
