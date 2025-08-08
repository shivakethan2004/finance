import { getUserStatus } from "@/api/companies";
import { useQuery } from "@tanstack/react-query";
import useCompanyName from "./useCompanyName";

const useUserPermission = () => {
    const companyname = useCompanyName()
    const userPermission = useQuery({
        queryKey: ["data"],
        queryFn: () => getUserStatus(companyname),
        refetchOnWindowFocus: false,
      });
    return userPermission
}

export default useUserPermission