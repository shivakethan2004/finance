"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";




const DashboardNavbar = ({logo, userimage, username})=>{
    const router = useRouter()
    const handleLogOut = () => {
        localStorage.clear()
        router.push("/")
    }
    return(
        <>
        <div className="flex flex-row justify-between items-center px-8 py-2 border-b border-gray-300">
            <Image src={logo} alt="logo not found" priority={false}/>
            <div className="flex flex-row items-center gap-4">
                {/* <FiBell className="w-6 h-6"/> */}
                <button className="flex flex-row items-center justify-center gap-2 rounded-md border border-gray-300 px-6 text-xl py-1 cursor-pointer" onClick={handleLogOut}>
                    {/* <Image className="w-8 h-8 object-cover rounded-full" src={userimage} alt="user image not found"/>
                    <h1>{username}</h1>
                    <FaAngleDown /> */}
                    Log out
                </button>
            </div>
        </div>
        </>
    )
}


export default  DashboardNavbar;