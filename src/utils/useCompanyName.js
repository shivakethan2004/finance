const { usePathname } = require("next/navigation")

const useCompanyName = () => {
    const pathname = usePathname()
    return pathname.split("/")[2]
}

export default useCompanyName