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
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BASE_URL } from "@/api/interceptor";
import {Download} from "@mui/icons-material";

const InvoiceTable = ({ data}) => {
  // console.log("refreshed Data---------------------");
  // console.log(data);
  const tableHeading = {
    fontWeight: "bold"
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [newData, setNewData] = useState([]);

  useEffect(() => {
    setNewData(data);
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: 'File Name',
        accessor: 'file_name'
      },
      {
        Header: 'Invoice Date',
        accessor: 'date'
      },
      {
        Header: 'Invoice Number',
        accessor: 'invoice_number'
      },
      {
        Header: 'Upload Date',
        accessor: 'upload_date'
      },
      {
        Header: 'PDF',
        accessor: 'pdf',
        Cell: ({ row }) => (
          <Link href={BASE_URL + "/media/" + row.original.pdf_download} target="_blank">
            <Download />
          </Link>
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
  
    const accessorsToSearchIn = ['file_name', 'date', 'invoice_number', 'upload_date']; 
  
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
      <Table aria-label="invoice table" sx={{
        border: "1px solid #e0e0e0",
      }} {...getTableProps()}>
        <TableHeader sx={{
          position: "sticky",
          top: "0",
          background: "white",
          zIndex: 10
        }}>
          {headerGroups.map(headerGroup => (
            <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell  key={column.id} {...column.getHeaderProps(column)}>
                  <div className='flex gap-1' {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
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
                  <TableCell key={index} {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
