
import { Inter } from "next/font/google";
import SideBar from "../../../component/Sidebar";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata = {
    title: "Dashboard",
    description: "Sample description",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
            <div className={`${inter.className} flex min-h-screen`}>
      {/* Sidebar */}
      <div className="">
      <SideBar />
      </div>

      {/* Main content */}
      <div className="ml-[20%] w-screen">
        {children}
      </div>
    </div>
    );
}