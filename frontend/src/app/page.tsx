import React from "react";
import Navbar from "../../component/Navbar";
const page = () => {
  return(
    <div className="">
      <Navbar/>
      <header className=" h-screen w-full flex  items-center justify-center bg bg-cover ">
        <div className=" flex items-center justify-center flex-col   bg-blend-darken">
          <h1 className=" text-4xl font-bold  text-white font-manrope">
            Fresh. Transparent. Fair. The Future of Farming is Here.
          </h1>
          <p className=" text-2xl font-manrope text-white py-2 ">
            no middlemen, no unfair pricing, just pure farm-to-table goodness.
          </p>
           
            <button className=" font-manrope font-xl bg-primary py-2 px-2 text-white">
              Join as a Farmer
            </button>
          
        </div>
      </header>
    </div>
  )
}
export default page;