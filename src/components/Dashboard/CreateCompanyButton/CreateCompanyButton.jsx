import React from "react";

const CreateCompanyButton = () => {
  return (
    <>
      <button className="bg-blue-500 text-white py-1 px-4 rounded-lg flex flex-row items-center">
        Create Company <span className="text-2xl pl-2 font-semibold">+</span>
      </button>
    </>
  );
};

export default CreateCompanyButton;
