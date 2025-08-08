import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "@/utils/pdfWorker";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { IconButton, LinearProgress } from "@mui/material";
import { Form, Formik } from "formik";
import CustomTextField from "@/components/common/TextField";
import { Check, Close, SkipNext } from "@mui/icons-material";
import * as Yup from 'yup';
import { editInvoice, getPendingInvoice } from '@/api/companies';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditIcon from '@mui/icons-material/Edit';
import useCompanyName from "@/utils/useCompanyName";
import Modal from "@/components/common/Modal"
import { toast } from "react-toastify";
import { BASE_URL } from "@/api/interceptor";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFViewer({ id,issued_by,date,total_price,invoice_number,gst_number,tds,original_file,gross_amount,net_amount, cgst_amount, gst_amount, sgst_amount }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const companyname = useCompanyName()
  const queryClient = useQueryClient()

  const pdfUrl = BASE_URL + original_file


  const handleModalToggle = () => {
      setModalVisible(p => !p);
  };

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  function zoomIn() {
    setScale(scale + 0.1);
  }

  function zoomOut() {
    setScale(scale - 0.1);
  }

  const initialValues = {
    issued_by: issued_by,
    date: date,
    total_price: total_price,
    invoice_number: invoice_number,
    gst_number: gst_number,
    tds: tds,
    gross_amount: gross_amount,
    net_amount: net_amount,
    gst_amount: gst_amount,
    cgst_amount: cgst_amount,
    sgst_amount: sgst_amount
  };
  const validationSchema = Yup.object().shape({
    issued_by: Yup.string(),
    date: Yup.string(),
    total_price: Yup.string(),
    invoice_number: Yup.string(),
    gst_number: Yup.string(),
    gross_amount: Yup.string(),
    net_amount: Yup.string(),
    gst_amount: Yup.string(),
    cgst_amount: Yup.string(),
    sgst_amount: Yup.string()
  });
  
  const acceptInvoice = useMutation({
    mutationFn: (invoiceStatus) => editInvoice(companyname,id,{
      status: invoiceStatus
    }),
    onSuccess: (e) => {
      queryClient.invalidateQueries({queryKey: ["next"]})
    },
    onError: (e) => console.log(e),
  })

  const editInvoiceMutation = useMutation({
    mutationFn: (data) => editInvoice(companyname,id,data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["next"]})
      toast.success("Invoice Edited Successfully")
      setModalVisible(p => !p)
    },
    onError: (e) => {
      console.log(e);
    }
  })

  const handleEditSubmit = (e) => {
    const obj = Object.fromEntries(
      Object.entries(e).filter(([key, value]) => value !== "" && value !== 0)
    );
    editInvoiceMutation.mutate({...obj,status:"edited"})
    console.log(obj,"what");
    // setModalVisible(p => !p)
  }
  
  const handleInvoiceStatus = (status) => {
    console.log(status);
    acceptInvoice.mutate(status)
  }

  return (
    <div className="flex flex-col items-center h-[50vh] relative">
      <div className="mb-4 absolute top-0 right-0 z-10">
        <IconButton onClick={zoomIn}><ZoomInIcon /></IconButton>
        <IconButton onClick={zoomOut}><ZoomOutIcon /></IconButton>
      </div>
      <div className="rounded-md overflow-x-auto w-full max-w-5xl relative">
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className="bg-slate-50 flex justify-center items-center flex-col">
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
      <div className='absolute left-1/2 bottom-0 -translate-x-1/2 -translate-y-1/2 flex gap-2'>
        <button className='bg-primary text-white px-6 py-0.5 rounded-sm flex gap-2 items-center' onClick={() => handleInvoiceStatus("approved")} disabled={acceptInvoice.isPending}>{!acceptInvoice.isPending && <Check fontSize='3'/>}{acceptInvoice.isPending ? "Loading..." : "Accept"}</button>
        <button className='bg-white text-primary px-6 py-0.5 border border-primary rounded-sm flex gap-2 items-center' onClick={() => setModalVisible(p => !p)} disabled={acceptInvoice.isPending}><EditIcon fontSize='3' /> Edit</button>
        <button className='bg-white text-red-600 px-6 py-0.5 border border-red-600 rounded-sm flex gap-2 items-center' onClick={() => handleInvoiceStatus("rejected")} disabled={acceptInvoice.isPending}>{!acceptInvoice.isPending && <Close color="error" fontSize='3' />}{acceptInvoice.isPending ? "Loading..." : "Reject"}</button>
        {/* <button className='bg-white text-gray-500 px-6 py-0.5 border border-gray-500 rounded-sm flex gap-2 items-center' onClick={() => handleInvoiceStatus("skipped")} disabled={acceptInvoice.isPending}>{!acceptInvoice.isPending && <SkipNext fontSize='3' />}{acceptInvoice.isPending ? "Loading...": "Skip"}</button> */}
      </div>
      <Modal visible={modalVisible} handleModalToggle={handleModalToggle}>
              <div className='p-6'>
                <div className='flex justify-center text-2xl pb-3'>Edit Row</div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleEditSubmit}
                  >
                  <Form>
                  <div className='grid grid-cols-4 gap-2 items-center'>
                  <label>Merchant</label>
                  <CustomTextField
                    type="text"
                    name="issued_by"
                    placeholder="merchant name"
                    />
                  <label>Date</label>
                  <CustomTextField 
                    type="text"
                    name="date"
                    placeholder="1/1/2001"
                  />
                  <label>Total</label>
                  <CustomTextField 
                    type="text"
                    name="total_price"
                    placeholder="1200"
                    />
                  <label>Invoice</label>
                  <CustomTextField 
                    type="text"
                    name="invoice_number"
                    placeholder="123"
                    />
                    <label>Gst Number</label>
                    <CustomTextField 
                    type="text"
                    name="gst_number"
                    placeholder="123"
                    />
                    <label>TDS</label>
                    <CustomTextField 
                    type="text"
                    name="tds"
                    placeholder="123"
                    />
                    <label>Gross Amount</label>
                    <CustomTextField 
                    type="text"
                    name="gross_amount"
                    placeholder="123"
                    />
                    <label>Net Amount</label>
                    <CustomTextField 
                    type="text"
                    name="net_amount"
                    placeholder="123"
                    />
                    <label>GST Amount</label>
                    <CustomTextField 
                    type="text"
                    name="gst_amount"
                    placeholder="123"
                    />
                    <label>SGST Amount</label>
                    <CustomTextField 
                    type="text"
                    name="sgst_amount"
                    placeholder="123"
                    />
                    <label>CGST Amount</label>
                    <CustomTextField 
                    type="text"
                    name="cgst_amount"
                    placeholder="123"
                    />
                    </div>
                    <div className='flex justify-center gap-3'>
                    <button className='bg-primary text-white px-6 py-0.5 rounded-lg flex gap-2 items-center' type='button' onClick={handleModalToggle}>Cancel</button>
                    <button className='bg-white text-primary px-6 py-0.5 border border-primary rounded-lg flex gap-2 items-center' type='submit' disabled={editInvoiceMutation.isPending}>{editInvoiceMutation.isPending ? "Loading..." : "Confirm"}</button> 
                    </div>
                    </Form>
                    </Formik>
              </div>
      </Modal>
    </div>
  );
}
