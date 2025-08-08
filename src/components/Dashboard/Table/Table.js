'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import {
  Link,
  Tooltip,
  IconButton,
  CircularProgress,
  TextField
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { BASE_URL } from "@/api/interceptor";
import { Delete, Download, Replay, SkipNext } from "@mui/icons-material";
import Modal from "@/components/common/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCompanyName from "@/utils/useCompanyName";
import { toast } from "react-toastify";
import { HourglassEmpty as HourglassEmptyIcon, Check as CheckIcon, Close, EditNote } from '@mui/icons-material';
import { retryInvoice, deleteInvoice } from '@/api/companies';

const CustTable = ({ data, showStatus }) => {
  // console.log("refreshed Data---------------------");
  // console.log(data);
  const tableHeading = {
    fontWeight: "bold"
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [retry, setRetry] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const companyname = useCompanyName();
  const queryClient = useQueryClient();
  const [newData, setNewData] = useState([]);

  useEffect(() => {
    setNewData(data);
  }, [data]);

  const handleModalToggle = (invoicedata) => {
    setInvoiceId(invoicedata);
    setModalVisible((prev) => !prev);
  };

  const handleRowDelete = () => {
    deleteRowMutation.mutate(invoiceId?.id);
  };

  const deleteRowMutation = useMutation({
    mutationFn: (id) => deleteInvoice(companyname, id),
    onSuccess: () => {
      toast.success(`Invoice deleted successfully`);
      handleModalToggle();
      queryClient.invalidateQueries(["data"]);
    }
  });

  const retryInvoiceMutation = useMutation({
    mutationFn: (id) => retryInvoice(companyname, id),
    onSuccess: () => {
      toast.success(`Invoice Parsed Successfully`);
      queryClient.invalidateQueries(['data']);
    },
    onError: (e) => {
      toast.error(e.message);
    }
  });

  const handleRetryInvoice = (id) => {
    retryInvoiceMutation.mutate(id);
    setRetry((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showStatusIcon = (status) => {
    if (status === 'pending') {
      return <Tooltip title="pending">
        <HourglassEmptyIcon color="warning" />
      </Tooltip>;
    } else if (status === 'approved') {
      return <Tooltip title="checked">
        <CheckIcon color="success" />
      </Tooltip>;
    } else if (status === 'skipped') {
      return <Tooltip title="skipped">
        <SkipNext />
      </Tooltip>;
    } else if (status === 'rejected') {
      return <Tooltip title="rejected">
        <Close color="error" />
      </Tooltip>;
    } else {
      return <Tooltip title="Edited">
        <EditNote color="success" />
      </Tooltip>;
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Retry',
        accessor: 'retry',
        Cell: ({ row }) => (
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleRetryInvoice(row.original.id)}
          >
            {retryInvoiceMutation.isPending && retry[row.original.id] ? <CircularProgress size="1rem" /> : <Replay />}
          </IconButton>
        )
      },
      {
        Header: 'Delete',
        accessor: 'delete',
        Cell: ({ row }) => (
          <IconButton size="small" onClick={() => handleModalToggle(row.original)}>
            <Delete className="text-gray-400" />
          </IconButton>
        )
      },
      {
        Header: 'File Name',
        accessor: 'file_name'
      },
      {
        Header: 'Merchant',
        accessor: 'issued_by'
      },
      {
        Header: 'Invoice Date',
        accessor: 'date'
      },
      {
        Header: 'Upload Date',
        accessor: 'upload_date'
      },
      {
        Header: 'Invoice Number',
        accessor: 'invoice_number'
      },
      {
        Header: 'Currency',
        accessor: 'currency'
      },
      {
        Header: 'Cost',
        accessor: 'total_price'
      },
      {
        Header: 'TDS',
        accessor: 'tds'
      },
      {
        Header: 'Gross Amount',
        accessor: 'gross_amount'
      },
      {
        Header: 'Net Amount',
        accessor: 'net_amount'
      },
      {
        Header: 'GST Amount',
        accessor: 'gst_amount'
      },
      {
        Header: 'Bank Name',
        accessor: 'bank_name'
      },
      {
        Header: 'Bank Branch',
        accessor: 'bank_branch'
      },
      {
        Header: 'Bank IFSC Code',
        accessor: 'ifsc_code'
      },
      {
        Header: 'Bank Account Number',
        accessor: 'bank_account_no'
      },
      {
        Header: 'Bank Account Name',
        accessor: 'bank_account_name'
      },
      {
        Header: 'Bank Account Type',
        accessor: 'bank_account_type'
      },
      {
        Header: 'Service Description',
        accessor: 'service_description'
      },
      {
        Header: 'IGST Amount',
        accessor: 'igst_amount'
      },
      {
        Header: 'CGST Amount',
        accessor: 'cgst_amount'
      },
      {
        Header: 'SGST Amount',
        accessor: 'sgst_amount'
      },
      {
        Header: 'GST Number',
        accessor: 'gst_number'
      },
      {
        Header: 'PDF',
        accessor: 'pdf',
        Cell: ({ row }) => (
          <Link href={BASE_URL + "/media/" + row.original.pdf_download} target="_blank">
            <Download />
          </Link>
        )
      },
      {
        Header: showStatus ? 'Status' : 'PDF',
        accessor: 'status',
        Cell: ({ row }) => (
          showStatus ? showStatusIcon(row.original.status) : (
            <Link href={BASE_URL + row.original.pdf_download} target="_blank">
              Download PDF
            </Link>
          )
        )
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: newData }, useSortBy);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  
    const accessorsToSearchIn = ['file_name', 'issued_by', 'date', 'invoice_number', 'currency', 'total_price', 'tds', 'gross_amount', 'net_amount', 'gst_amount', 'cgst_amount', 'sgst_amount', 'gst_number', 'upload_date', 'status']; 
  
    // Filter the data based on accessorsToSearchIn
    const filteredData = data.filter((invoice) =>
      accessorsToSearchIn.some((accessor) =>
        invoice[accessor]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
    setNewData(filteredData);
  };

  return (
    <div>
      <TextField
        variant="outlined"
        label="Search"
        fullWidth
        onChange={handleSearch}
        className="m-4 lg:w-[400px] sticky left-4"
      />
      <Table
        // aria-label="invoice table"
        {...getTableProps()}
      >
        <hr />
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <TableCell key={column.id} {...column.getHeaderProps(column)}>
                  <div
                    className={`flex gap-1 whitespace-nowrap`}
                    {...column.getSortByToggleProps()}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <TableRow key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <TableCell key={index} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Modal visible={modalVisible} handleModalToggle={handleModalToggle}>
        <div className="px-10 py-2 text-xl">
          Are you sure you want to delete{" "}
          <code className="bg-gray-100 px-2 rounded-sm">
            {invoiceId?.file_name}
          </code>
          <div className="flex gap-4 pt-4 justify-center">
            <button
              className="px-2 py-1 border-primary border rounded-md text-lg text-primary"
              onClick={handleModalToggle}
            >
              Cancel
            </button>
            <button
              className="px-2 py-1 bg-red-500 rounded-md text-lg text-white hover:bg-red-600"
              onClick={handleRowDelete}
            >
              {deleteRowMutation.isPending ? "Loading..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustTable;
