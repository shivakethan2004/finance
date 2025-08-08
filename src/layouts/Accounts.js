"use client";
import { getCompanies, getOwnerStatus } from "@/api/companies";
import AccountCard from "@/components/Dashboard/AccountCard/AccountCard";
import useCompanyName from "@/utils/useCompanyName";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Accounts() {
  const data = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
    refetchOnWindowFocus: false,  
  });
  const userStatus = useQuery({
    queryKey: ["userstatus"],
    queryFn: () => getOwnerStatus(),
    refetchOnWindowFocus: false,  
  })
  
  if(data.isFetching){
    return <div className="h-[70vh] grid place-items-center">
      <CircularProgress color="primary" size="4rem"/>
    </div>
  }
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl font-semibold py-6 px-10">Accounts</h1>
        {data?.data?.data?.length > 0 && userStatus?.data?.data?.status && <Link
          className="text-blue-500 px-8 font-semibold"
          href="/addnewaccount"
        >
          Add Account <span className="test-3xl">+</span>
        </Link>}
      </div>
      <div className="flex flex-row flex-wrap gap-4 py-6 px-10">
      {!data.isLoading ? (
        data?.data?.data ? (
          data.data.data.length > 0 ? (
            data.data.data.map((e, i) => <AccountCard key={i} data={e} />)
          ) : (
            <div>
              <Image src="/flowers.png" alt="flowers" height={400} width={400} className="absolute right-0 bottom-0"/>
              {userStatus?.data?.data?.status ? (
                <div className="flex flex-col gap-5">
                  <div>
                    You have no clients accounts yet. Create an account to get started.
                  </div>
                  <Link href="/addnewaccount">
                    <button className="px-4 py-1 bg-primary rounded-md text-white my-3.5">Create Company +</button>
                  </Link>
                </div>
              ) : (
                <div>
                  The admin will add you to an account soon.
                </div>
              )}
            </div>
          )
        ) : (
          <div className="h-[70vh] w-full grid place-content-center">
            <CircularProgress size="4rem" />
          </div>
        )
      ) : (
        <div className="h-[70vh] w-full grid place-content-center">
          <CircularProgress size="4rem" />
        </div>
      )}
      </div>
    </div>
  );
}
