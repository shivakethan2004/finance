"use client"
import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextField from "../common/TextField";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/auth";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

export default function SignUp() {
  const validate = Yup.object({
    first_name: Yup.string().required("Name is Required"),
    email: Yup.string().email("Email is invalid!").required("Email Required!"),
    password1: Yup.string()
      .min(4, "Password must be minimum 4 digits!")
      .required("Password Required!"),
    password2: Yup.string()
      .oneOf([Yup.ref("password1"), null], "Password must match!")
      .required("Confirm password is reqired!"),
  });

  const registerUserMutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (message) => {
        toast.success(message?.data?.detail);
    },
    onError: (error) => {
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

  const handleUserSignUp = (e) => {
    registerUserMutation.mutate(e)
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 md:px-10 md:h-[70vh]">
      <Formik
        initialValues={initialValues}
        validationSchema={validate}
        onSubmit={handleUserSignUp}
      >
        {(formik) => (
          <div>
            <h1 className="text-3xl py-3">Sign Up</h1>
            <Form>
              <CustomTextField
                className="text-primary"
                type="text"
                label="Name"
                name="first_name"
                placeholder="Lorem"
              />
              <CustomTextField
                className="text-primary"
                type="email"
                name="email"
                label="Email"
                placeholder="loremipsum@gmail.com"
              />
              <CustomTextField
                className="text-primary"
                type="password"
                name="password1"
                label="Password"
                placeholder="qwert@123"
              />
              <CustomTextField
                className="text-primary"
                type="password"
                name="password2"
                label="Confirm Password"
                placeholder="qwert@123"
              />
              <div className="flex justify-center">
              <button className="text-center bg-primary md:w-1/3 w-full px-4 py-2 rounded-full text-white" type="submit">
                {registerUserMutation.isPending ? <CircularProgress size="1.3rem" color="inherit"/> : "Sign Up"}
              </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}

const initialValues = {
  first_name: "",
  email: "",
  password1: "",
  password2: "",
};
