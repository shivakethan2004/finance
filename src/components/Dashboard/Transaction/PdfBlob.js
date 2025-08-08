import Image from "next/image";
import React from "react";
import pdfLogo from "@/assets/images/icons/pdfIcon.png"
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import { usePDFStore } from "@/store/zustand";

const PdfBlob = ({ name,key }) => {
  const deletepdf = usePDFStore(state => state.deletePDFFile)

  // Function to truncate file name
  const truncateFileName = (fileName) => {
    const maxLength = 20; // Maximum length of the file name
    if (fileName?.length > maxLength) {
        return fileName.substring(0, maxLength - 4) + '...' + fileName.substring(fileName.length - 4);
    }
    return fileName;
};
  return (
    <div
      key={key}
      className="w-auto h-auto border border-[#E4E7EC] rounded-lg truncate items-end justify-end"
    >
      <div className="flex justify-end">
        <IconButton size="small" onClick={() => deletepdf(name)}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="flex justify-center items-center">
        <Image src={pdfLogo} height={80} width={80} alt="pdf icon"/>
      </div>
      <div className="p-4">
      {truncateFileName(name)}
      </div>
    </div>
  );
};

export default PdfBlob;
