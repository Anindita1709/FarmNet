{/*}
// Import your globals here
import "@/app/global.css"; // ✅ matches src/app/global.css


import { Inter } from "next/font/google";
import SideBar from "../../../component/Sidebar";
import UserNav from "../../../component/UserNav";


const inter = Inter({
    subsets: ["latin"],
});

export const metadata = {
    title: "Dashboard",
    description: "Sample description",
};

export default function RootLayout({children}: {children: React.ReactNode}) {

    const pathname = usePathname();
    const hideSidebar = pathname === "/dashboard/myproducts";
  
    return (
      <div className={`${inter.className} h-screen overflow-hidden`}>
      
      <div className="fixed top-0 left-0 right-0 z-50">
        <UserNav />
      </div>

     
      <div className="flex h-full pt-[64px]"> 
       
        {!hideSidebar && (
        <div className="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-[20%] z-40">
          <SideBar />
        </div>
        )}

       
        <main className="ml-[20%] w-[80%] h-[calc(100vh-64px)] overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
   
               
    );
}
*/}
// Import your globals here
// import "@/styles/globals.css";

import { Inter } from "next/font/google";
import SideBar from "../../../component/Sidebar";
import UserNav from "../../../component/UserNav";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata = {
    title: "Dashboard",
    description: "Sample description",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
            <div >
               <UserNav/>
                {children}</div>
    );
}