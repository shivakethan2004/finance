"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import AccountIcon from "@/assets/images/icons/accountsIcon.svg";
import { Avatar, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "@/api/companies";
import { BASE_URL } from "@/api/interceptor";
import useCompanyName from "@/utils/useCompanyName";
import Link from "next/link";
import { useFolder } from "@/app/context/FolderProvider";

const SideNavbar = () => {
  const { data, isLoading, isError, isFetched, isFetching } = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
    refetchOnWindowFocus: false,
  });

  const companyname = useCompanyName();
  const { selectedFolder, companySlug } = useFolder();
  const { setSelectedFolder, setCompanySlug } = useFolder();
  const [folderStructure, setFolderStructure] = useState(null);

  // Set default company when data is loaded
  useEffect(() => {
    if (data?.data && data.data.length > 0 && !companySlug) {
      const defaultCompany = data.data[0];
      setCompanySlug(defaultCompany.slug);
      fetchFolderStruct(defaultCompany.slug);
    }
  }, [data, setCompanySlug, companySlug]);

  const renderAvatarWithInitials = (name) => {
    const initials = name ? name.charAt(0).toUpperCase() : "";
    return <Avatar>{initials}</Avatar>;
  };

  const fetchFolderStruct = async (companySlug) => {
    const token = localStorage.getItem("authToken");

    const fileStrcutRes = await fetch(
      `https://fiing-7wt3.onrender.com/explorer/${companySlug}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    const fileStrcut = await fileStrcutRes.json();
    setFolderStructure(fileStrcut?.file_structure);
    setSelectedFolder({ type: "root", child: fileStrcut?.file_structure });
    return fileStrcut;
  };

  // Handle company selection
  const handleCompanySelect = async (company) => {
    setCompanySlug(company.slug);
    await fetchFolderStruct(company.slug);
  };

  return (
    <aside className="z-40 w-64 h-full transition-transform hidden sm:block -translate-x-full sm:translate-x-0 border-r border-gray-300">
      <div className="h-full px-6 py-8 overflow-y-auto">
        <h1 className="text-gray-700 mb-2">Menu</h1>
        <ul className="flex flex-col gap-6 text-md font-semibold my-2">
          <Link href="/accounts">
            <li className="flex flex-row gap-2">
              <Image src={AccountIcon} alt="Icon not found" />
              Accounts
            </li>
          </Link>

          <div className="h-[50vh]">
            {isLoading || isFetching ? (
              <div className="h-[60vh] flex items-center justify-center">
                <CircularProgress size="2rem" />
              </div>
            ) : isError ? (
              <div className="h-[70vh] grid place-content-center">
                Error occurred while fetching data.
              </div>
            ) : isFetched && data?.data ? (
              <div className="flex flex-col gap-3">
                {data.data.map((company) => (
                  <div key={company.id} className="space-y-2">
                    <div
                      onClick={() => handleCompanySelect(company)}
                      className={`${companyname === company.slug
                          ? `bg-white p-2 flex items-center text-primary gap-4 px-4 hover:bg-gray-100 transition rounded-lg`
                          : `bg-white p-2 flex items-center hover:bg-gray-100 transition rounded-lg duration-300 gap-4 px-4`
                        } cursor-pointer`}
                    >
                      {company.logo ? (
                        <Image
                          height={20}
                          width={20}
                          objectFit="contain"
                          src={BASE_URL + company.logo}
                          alt={company.name}
                          className="w-8 h-8 mr-2 rounded-full border border-[#e0e0e0]"
                        />
                      ) : (
                        renderAvatarWithInitials(company.name)
                      )}
                      <span>{company.name}</span>
                    </div>

                    <ul className="ml-8">
                      <li>
                        <Link href={`/accounts/${company.slug}`}>
                          <div
                            onClick={()=>handleCompanySelect(company)}
                            className="p-2 hover:bg-gray-200 transition rounded-lg">
                            Invoice Dashboard
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/accounts/${company.slug}/DocumentsPage`}
                          onClick={() => {
                            handleCompanySelect(company)
                            fetchFolderStruct(company.slug)
                          }}
                          className="p-2 hover:bg-gray-200 transition rounded-lg cursor-pointer"
                        >
                          Documents
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[70vh] grid place-content-center">
                No companies found
              </div>
            )}
          </div>
        </ul>
      </div>
    </aside>
  );
};

export default SideNavbar;