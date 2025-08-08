"use client";
import React, { use, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CustomTextField from "@/components/common/TextField";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { stateCityData } from "@/utils/statesCity";
import { MenuItem, Select } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { addCompany, addCompanyLogo } from "@/api/companies";

export default function CreateAccount() {
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter()
  const queryClient = useQueryClient()
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/accounts">
      Accounts
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="text.primary"
      href="/material-ui/getting-started/installation/"
    >
      Add new account
    </Link>
  ];
  const validationSchema = Yup.object({
    name: Yup.string().required("Company Name is required"),
    about: Yup.string().required("About Company is required"),
    pan_number: Yup.string()
      .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN Number")
      .required("PAN Number is required"),
    address_line_1: Yup.string().required("Address Line 1 is required"),
    address_line_2: Yup.string().required("Address Line 2 is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    pin_code: Yup.string().required("PIN Code is required"),
    email_address: Yup.string()
      .email("Invalid email address")
      .required("Email Address is required"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid Phone Number")
      .required("Phone Number is required")
  });

  const addCompanyLogoMutation = useMutation({
    mutationFn: (companyname) => addCompanyLogo(companyname,selectedFile),
    onSuccess: () => {
      toast.success("Company Added Successully")
      queryClient.invalidateQueries(['companies'])
      setTimeout(() => router.push("/accounts"))
    },
    onError: () => {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        Object.keys(errorData).forEach((key) => {
          errorData[key].forEach((errorMessage) => {
            toast.error(errorMessage);
          });
        });
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  }) 

  const addCompanyMutation = useMutation({
    mutationFn: (data) => addCompany(data),
    onSuccess: (e) => {
      addCompanyLogoMutation.mutate(e.data.slug)
    },
    onError: (error) => {
      console.log(error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        Object.keys(errorData).forEach((key) => {
          errorData[key].forEach((errorMessage) => {
            toast.error(errorMessage);
          });
        });
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  })

  const handleAddCompany = (e) => {
    // if(!selectedFile){
    //   alert("Add your company logo!!")
    //   return;
    // }
    // console.log(e);
    addCompanyMutation.mutate(e)
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the selected file is an image of supported types
      if (
        file.type.includes("image/png") ||
        file.type.includes("image/jpeg") ||
        file.type.includes("image/jpg")
      ) {
        setSelectedFile(file);
      } else {
        // Display an error message if the selected file is not of a supported image type
        alert("Please select a PNG, JPEG, or JPG image file.");
      }
    }
  };

  console.log(selectedFile);

  const handleDivClick = () => {
    // Trigger the hidden file input when the div is clicked
    document.getElementById("file-input").click();
  };

  return (
    <>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>

      <div className="flex flex-col w-full items-center">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAddCompany}
        >
          {({ values, setFieldValue }) => (
            <>
              <Form>
                <div className="w-[30rem]">
                  <h1 className="text-blue-500 text-xl my-4">
                    Basic Information
                  </h1>
                  <div className="mb-4">
                    <CustomTextField
                      type="text"
                      label="Name"
                      name="name"
                      placeholder="Comapany name"
                      className="font-semibold text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <CustomTextField
                      type="text"
                      label="About Company"
                      name="about"
                      placeholder="About"
                      className="font-semibold text-black"
                    />
                  </div>
                  <div className="mb-6">
                    <CustomTextField
                      type="text"
                      label="Comapny Pan Number"
                      name="pan_number"
                      placeholder="97393 xxxxx"
                      className="font-semibold text-black"
                    />
                  </div>
                </div>
                <div className="w-[30rem]">
                  <h1 className="text-blue-500 text-xl my-4">
                    Business Address
                  </h1>
                  <div className="mb-4">
                    <CustomTextField
                      type="text"
                      label="Address line 1"
                      name="address_line_1"
                      placeholder="Building, Street, Society"
                      className="font-semibold text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <CustomTextField
                      type="text"
                      label="Address line 2"
                      name="address_line_2"
                      placeholder="Building, Street, Society"
                      className="font-semibold text-black"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="state"
                      className="block font-semibold text-sm py-2"
                    >
                      State
                    </label>
                    <Field
                      as={Select}
                      size="small"
                      label="state"
                      placeholder="state"
                      name="state"
                      id="state"
                      value={values.state}
                      onChange={(e) => setFieldValue("state", e.target.value)}
                    >
                      {Object.keys(stateCityData).map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Field>

                    {values.state && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col w-full">
                          <label
                            htmlFor="city"
                            className="block font-semibold text-sm py-2"
                          >
                            city
                          </label>
                          <Field
                            as={Select}
                            size="small"
                            id="city"
                            name="city"
                            value={values.city}
                            onChange={(e) =>
                              setFieldValue("city", e.target.value)
                            }
                          >
                            {stateCityData[values.state].map((city) => (
                              <MenuItem key={city} value={city}>
                                {city}
                              </MenuItem>
                            ))}
                          </Field>
                        </div>
                        <div className="pt-7">
                          <CustomTextField
                            type="text"
                            name="pin_code"
                            placeholder="pin code"
                            className="font-semibold text-black"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-[30rem]">
                  <h1 className="text-blue-500 text-xl my-4">
                    Contact Information
                  </h1>
                  <div className="mb-4">
                    <div className="mb-4">
                      <CustomTextField
                        label="Email Address"
                        type="text"
                        name="email_address"
                        placeholder="abc@xyz.com"
                        className="font-semibold text-black"
                      />
                    </div>
                    <div className="mb-4">
                      <CustomTextField
                        label="Phone Number"
                        type="text"
                        name="phone_number"
                        placeholder="96531 xxxxx"
                        className="font-semibold text-black"
                      />
                    </div>
                    <div className="mb-4 flex flex-col">
                      <label className="font-semibold text-sm pb-4">
                        Upload logo
                      </label>
                      <div
                        className="flex w-full items-center justify-center h-24 border-2 border-dashed border-primary rounded-md cursor-pointer"
                        onClick={handleDivClick}
                      >
                        {/* Hidden file input */}
                        <input
                          id="file-input"
                          type="file"
                          className="hidden"
                          accept=".png,.jpeg,.jpg" // Specify accepted file types
                          onChange={handleFileChange}
                        />
                        {/* Display the selected file name */}
                        {selectedFile ? (
                          <Typography variant="body2">
                            Selected File: {selectedFile.name}
                          </Typography>
                        ) : (
                          <>
                            <UploadIcon className="text-4xl text-gray-400 mb-2" />
                            <Typography variant="body1">
                              Upload your logo
                            </Typography>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-10">
                    <button className="border-2 border-blue-500 text-blue-500 font-bold px-14 py-1 rounded-lg">
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="bg-blue-500 text-white font-bold px-14 py-1 rounded-lg"
                    >
                      Next <span>{">"}</span>
                    </button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}

const initialValues = {
  name: "",
  about: "",
  pan_number: "",
  address_line_1: "",
  address_line_2: "",
  state: "",
  city: "",
  pin_code: "",
  email_address: "",
  phone_number: ""
};
