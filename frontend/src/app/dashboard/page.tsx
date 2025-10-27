import { IndianRupee ,Logs ,Users , ClipboardList } from "lucide-react";
import SideBar from "../../../component/Sidebar";

interface PageProps {}

const Page = ({}: PageProps) => {
  return <div className="bg-gray-200 font-inter min-h-screen p-5 ">
  {/* Overview Title */}
  <p className="text-xl font-bold mb-4">Overview</p>

  {/* Summary Cards */}
  <header className="flex flex-wrap gap-4">
    <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
      <p className="font-bold text-lg">Total Orders</p>
      <p className="text-gray-500 text-sm">Last 7 Days</p>
      <div className="flex items-center gap-2 mt-2">
        <Logs size={24} />
        <p className="font-bold text-3xl">10</p>
      </div>
    </div>

    <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
      <p className="font-bold text-lg">Total Revenue</p>
      <p className="text-gray-500 text-sm">Last 7 Days</p>
      <div className="flex items-center gap-2 mt-2">
        <IndianRupee size={24} />
        <p className="font-bold text-3xl">1320</p>
      </div>
    </div>

    <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
      <p className="font-bold text-lg">Total Customers</p>
      <p className="text-gray-500 text-sm">Last 7 Days</p>
      <div className="flex items-center gap-2 mt-2">
        <Users size={24} />
        <p className="font-bold text-3xl">1</p>
      </div>
    </div>

    <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
      <p className="font-bold text-lg">Pending Orders</p>
      <p className="text-gray-500 text-sm">Last 7 Days</p>
      <div className="flex items-center gap-2 mt-2">
        <ClipboardList size={24} />
        <p className="font-bold text-3xl">2</p>
      </div>
    </div>
  </header>

  {/* Recent Orders Section */}
  <div className="mt-8">
    <h1 className="text-xl font-bold mb-4">Recent Orders</h1>

    <div className="flex items-center justify-center h-60">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-404-error-empty-pack-design-development-illustrations-6632131.png?f=webp"
        alt="No orders"
        className="w-60 h-60 rounded-full"
      />
    </div>
  </div>
</div>

};

export default Page;