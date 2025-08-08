"use client"
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomTextField from "../common/TextField";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { loginUser } from "@/api/auth";

export default function LogIn() {
  const validate = Yup.object({
    email: Yup.string().email("Email is invalid!").required("Email Required!"),
    password: Yup.string()
      .min(4, "Password must be minimum 4 digits!")
      .required("Password Required!"),
  });

  const router = useRouter()

  const loginUserMutation = useMutation({
    mutationFn: (data) => loginUser(data),
    onSuccess: (message) => {
        localStorage.setItem("authToken",message?.data?.key)
        router.push("/accounts")
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

  const handleUserLogin = (e) => {
    loginUserMutation.mutate(e)
  }

  return (
    <div className="bg-gray-50 rounded-2xl md:px-10 md:h-[70vh]">
      <Formik
        initialValues={initialValues}
        validationSchema={validate}
        onSubmit={handleUserLogin}
      >
        {(formik) => (
          <div>
            <h1 className="text-3xl py-3">Sign In</h1>
            <Form>
              <CustomTextField
                type="email"
                name="email"
                label="Email"
                placeholder="loremipsum@gmail.com"
                className="text-primary"
              />
              <CustomTextField
                type="password"
                name="password"
                label="Password"
                placeholder="qwert@123"
                className="text-primary"
              />
              <div className="flex justify-center">
              <button className="text-center bg-primary md:w-1/2 w-full px-4 py-2 mt-7 rounded-full text-white" type="submit">
              {loginUserMutation.isPending ? <CircularProgress size="1.3rem" color="inherit"/> : "Login"}
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
  email: "",
  password: "",
};
