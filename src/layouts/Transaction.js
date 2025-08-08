"use client";
import {
  Breadcrumbs,
  CircularProgress,
  Divider,
  LinearProgress,
  TextField
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { usePDFStore } from "@/store/zustand";
import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import CustomTextField from "@/components/common/TextField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addUserToCompany, getUserStatus } from "@/api/companies";
import useCompanyName from "@/utils/useCompanyName";
import { toast } from "react-toastify";
import useUserPermission from "@/utils/useUserPermission";
import { ApartmentOutlined, Circle, DescriptionOutlined, EngineeringOutlined, PersonSearchOutlined, StorageOutlined } from "@mui/icons-material";

const Transaction = () => {
  const [invitationBtnText, setInvitationBtnText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [emailId, setEmailId] = useState("");

  const companyname = useCompanyName();
  const pathname = usePathname()

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

  const { isLoading, isError, data, isFetching } = useUserPermission();

  const router = useRouter();
  const pathName = usePathname();
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/accounts">
      Accounts
    </Link>,
    <Link underline="hover" key="2" color="text.primary" href={`/accounts/${companyname}`}>
      {companyname}
    </Link>
  ];

  const fileInputRef = useRef(null);
  const addPDFFile = usePDFStore((state) => state.addPDFFile); // Use the store

  // Function to handle file input change
  const handleFileInputChange = () => {
    const files = Array.from(fileInputRef.current.files);
    files.forEach((file) => {
      if (file.type === "application/pdf") {
        addPDFFile(file);
        console.log(router);
        router.push(pathName + "/upload");
      } else {
        alert(
          `File ${file.name} is not a PDF. Only PDF files can be uploaded.`
        );
      }
    });
    // Clear the file input after uploading files
    fileInputRef.current.value = "";
  };
  const addUserModal = (userType) => {
    setModalVisible((p) => !p);
    setInvitationBtnText(userType);
  };

  const inviteUserMutation = useMutation({
    mutationFn: (type) => addUserToCompany(companyname, type),
    onSuccess: () => {
      toast.success(`${invitationBtnText} added successfully`);
      setModalVisible(p => !p)
    },
    onError: (e) => {
      toast.error(e.response.data.detail);
    }
  });

  const addUser = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailId)) {
      alert("invalid email id");
    }
    inviteUserMutation.mutate({
      email: emailId,
      permission_level: invitationBtnText
    });
  };
  if(isFetching) {
    return <div className="h-[70vh] grid place-content-center">
      <CircularProgress color="primary" size="4rem"/>
    </div>
  }
  return (
    <div className="px-8 py-10">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <div className="flex gap-9 justify-center items-center pt-5 flex-wrap">
        <div className="w-60 py-4 h-auto border border-primary rounded-xl justify-center flex flex-col items-center text-xl">
          <div className="text-[#8F8F8F] capitalize font-semibold pb-1 pt-3">
            annual revenue
          </div>
          <div className="text-xl font-semibold py-2.5">2,84,000</div>
        </div>
        <div className="w-60 py-4 h-auto border border-primary rounded-xl justify-center flex flex-col items-center text-xl">
          <div className="text-[#8F8F8F] capitalize font-semibold pb-1 pt-3">
            annual revenue
          </div>
          <div className="text-xl font-semibold py-2.5">2,84,000</div>
        </div>
        <div className="w-60 py-4 h-auto border border-primary rounded-xl justify-center flex flex-col items-center text-xl">
          <div className="text-[#8F8F8F] capitalize font-semibold pb-1 pt-3">
            annual revenue
          </div>
          <div className="text-xl font-semibold py-2.5">2,84,000</div>
        </div>
      </div>
      <div className="w-full text-center py-5">
        {isLoading ? (
          <CircularProgress color="inherit" size="1rem" />
        ) : data.data.permission_level === "owner" || data.data.permission_level === "maker" ? (
          <button
            className="w-4/5 bg-primary py-1.5 rounded-xl text-[#fff] shadow-lg"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Invoice
            <input
              type="file"
              accept=".pdf"
              multiple
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </button>
        ) : (
            <Link href={`/accounts/${companyname}/inspection`}>
                <button className="w-4/5 bg-primary py-1.5 rounded-xl text-[#fff] shadow-lg">Start Inspection</button>
            </Link>
        )}
      </div>
      <Divider className="pt-3"/>
      <div>
      {/* Check loading and error states */}
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}
      
      {/* Render UI based on user role and permission */}
      {!isLoading && !isError && (
        <div className="grid place-content-center gap-6">
          <div className="flex gap-16 text-primary font-semibold text-2xl p-6 flex-wrap">
            {data && (
              <>
                <Link href={`${pathname}/data`} replace={false} className="flex items-center gap-3"><StorageOutlined className="text-primary" /> Data</Link>
                {data.data.permission_level === 'owner' && <Link href={`/accounts/${companyname}`} replace={false} className="flex items-center gap-3"><ApartmentOutlined className="text-primary"/> Company Profile</Link>}
                {(data.data.permission_level === 'owner' || data.data.permission_level === 'checker') && <Link href={`${pathname}/invoices`} replace={false} className="flex items-center gap-3"><DescriptionOutlined className="text-primary" /> Invoices</Link>}
              </>
            )}
          </div>
          <div className="flex gap-5 justify-center flex-wrap">
            {data.data.permission_level === 'owner' && (
              <>
                <button
                  className="text-primary font-semibold text-xl border border-primary px-4 py-0.5 rounded-lg flex gap-3 items-center"
                  onClick={() => addUserModal("maker")}
                >
                  <EngineeringOutlined className="text-primary"/>
                  Invite Maker
                </button>
                <button
                  className="text-primary font-semibold text-xl border border-primary px-4 py-0.5 rounded-lg flex gap-3 items-center"
                  onClick={() => addUserModal("checker")}
                >
                  <PersonSearchOutlined className="text-primary"/>
                  Invite Checker
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
      <Modal visible={modalVisible} handleModalToggle={handleModalToggle}>
        <div className="p-4 flex gap-1">
          <TextField
            type="email"
            label="Email"
            name="email"
            placeholder="abc@xyz.com"
            className="font-semibold text-black"
            size="small"
            onChange={(e) => setEmailId(e.target.value)}
          />
          <button
            className="flex capitalize justify-center items-center bg-primary rounded-lg text-white px-2 w-32"
            onClick={addUser}
          >
            {inviteUserMutation.isPending ? (
              <CircularProgress size="1rem" color="inherit" />
            ) : (
              `invite ${invitationBtnText}`
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Transaction;
