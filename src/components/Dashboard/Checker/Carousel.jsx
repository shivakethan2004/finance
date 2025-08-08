"use client"
import { BASE_URL } from '@/api/interceptor';
import { Check } from '@mui/icons-material';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Modal from '@/components/common/Modal';
import CustomTextField from '@/components/common/TextField';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editInvoice } from '@/api/companies';
import useCompanyName from '@/utils/useCompanyName';
import { toast } from 'react-toastify';

const Carousel = ({ images, id }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const queryClient = useQueryClient()
  const companyname = useCompanyName()
  const [modalVisible, setModalVisible] = useState(false);
  const handleModalToggle = () => {
      setModalVisible(p => !p);
  };
  
  
  const goToPreviousSlide = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + images.length - 1) % images.length);
  };
  
  const goToNextSlide = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const initialValues = {
    issued_to: '',
    date: '',
    total_price: 0,
    invoice_number: '',
  };
  
  const validationSchema = Yup.object().shape({
    issued_to: Yup.string(),
    date: Yup.date(),
    total_price: Yup.number().min(0, 'Total must be a positive number'),
    invoice_number: Yup.string(),
  });
  
  const acceptInvoice = useMutation({
    mutationFn: () => editInvoice(companyname,id,{
      status: "approved"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["data"]})
      toast.success("Invoice Approved")
    },
    onError: (e) => console.log(e),
  })

  const editInvoiceMutation = useMutation({
    mutationFn: (data) => editInvoice(companyname,id,data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["data"]})
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
  
  const handleInvoiceAccept = () => {
    acceptInvoice.mutate()
  }

  if(!images) return
  return (
    <div className="relative h-[50vh]">
      <div className="overflow-hidden">
    <div className="flex justify-center h-full">
      <AvatarEditor
        image={BASE_URL + images[currentImageIndex]}
        width={1000}
        height={250}
        border={50}
        color={[255, 255, 255, 0]} // RGBA
        scale={1.2}
        rotate={0}
      />
    </div>
  </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentImageIndex(index)}
          ></span>
        ))}
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
        onClick={goToPreviousSlide}
      >
        {'<'}
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
        onClick={goToNextSlide}
      >
        {'>'}
      </button>
      <div className='absolute left-1/2 bottom-6 -translate-x-1/2 -translate-y-1/2 flex gap-2'>
        <button className='bg-primary text-white px-6 py-0.5 rounded-sm flex gap-2 items-center' onClick={handleInvoiceAccept}><Check fontSize='3'/>Accept</button>
        <button className='bg-white text-primary px-6 py-0.5 border border-primary rounded-sm flex gap-2 items-center' onClick={() => setModalVisible(p => !p)}><EditIcon fontSize='3' /> Edit</button>
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
                  <div className='grid grid-cols-2'>
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
                    </div>
                    <div className='flex justify-center gap-3'>
                    <button className='bg-primary text-white px-6 py-0.5 rounded-lg flex gap-2 items-center' type='button' onClick={handleModalToggle}>Cancel</button>
                    <button className='bg-white text-primary px-6 py-0.5 border border-primary rounded-lg flex gap-2 items-center' type='submit'>Confirm</button> 
                    </div>
                    </Form>
                    </Formik>
              </div>
      </Modal>
    </div>
  );
};

export default Carousel;
