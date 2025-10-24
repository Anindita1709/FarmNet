"use client";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
//import axiosinstance from "../../../axiosconfig";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PageProps {}

const page = ({}: PageProps) =>{
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [islogin, setIslogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const nav = useRouter();

  const axiosinstance = axios.create({
    baseURL: "http://localhost:5000/api/",
  });
    const handleLogin = async () => {

    try {
      setLoading(true); // start loading
      const res = await axiosinstance.post("auth/login", {
        email: email,
        password: password,
      });
  
      const data = res.data;
      console.log(data);

      if (data.user) {
        nav.push("/landing");
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please check credentials.");
    }finally {
      setLoading(false); // stop loading
    }
  };
  const HandleRegister = async()=>{
      try {
        setLoading(true);
       const res = await axiosinstance.post("auth/register",{
          name: name,
          email:email,
          phone:phone,
          password:password
        })
        const data = res.data;
        console.log(data);
        setIslogin(true);
        toast.success("Account Created Successfully");
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        // Safe error handling
    if (axios.isAxiosError(error)) {
      // Axios error with a response
      toast.error(error.response?.data?.message || "Registration failed");
    } else if (error instanceof Error) {
      // Regular JS error
      toast.error(error.message);
    } else {
      // Unknown error type
      toast.error("Something went wrong");
    }

    console.log(error); // optional, for debugging
  }finally {
      setLoading(false); // stop loading
    }

  };

  return(
    <div className=" flex w-full h-screen items-center justify-center font-inter ">
      <ToastContainer/>
      <div className="flex flex-col w-[50%] h-screen items-center justify-center ">
        <div>
          <h1 className=" text-2xl">
            
            <span className=" text-primary">AgriChain</span> Account
          </h1>
          {islogin && (
          
            <div className=" flex flex-col gap-1 mt-4">
              <input
                type="email"
                placeholder="Email"
                className=" border-2 border-gray-300 p-2 m-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className=" border-2 border-gray-300 p-2 m-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => {
                  handleLogin();
                }}
                className=" bg-primary text-white p-2 m-2"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p>
                Don't have an account?{" "}
                <span
                  className=" text-primary cursor-pointer"
                  onClick={() => {setIslogin(false)
                  setEmail("");
                  setPhone("");
                  setPassword("");
                  }}
                >
                  Register
                </span>
              </p>
        </div>
          )}

          {!islogin && (

          <div className=" flex flex-col gap-1 mt-4">
              <input
  type="text"
  placeholder="Name"
  className="border-2 border-gray-300 p-2 m-2"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
              <input
                type="email"
                placeholder="Email"
                className=" border-2 border-gray-300 p-2 m-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
                   <input
                type="text"
                placeholder="Phone"
                className=" border-2 border-gray-300 p-2 m-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}  
              />
              <input
                type="password"
                placeholder="Password"
                className=" border-2 border-gray-300 p-2 m-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
         
              <input
                type="password"
                placeholder="Confirm Password"
                className=" border-2 border-gray-300 p-2 m-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button onClick={()=>{
                if(password===confirmPassword){
                  HandleRegister();
                }else{
                  toast.error("Passwords do not match");
                }
              }} 
              disabled={loading}
              className={
  "bg-primary text-white p-2 m-2 " +
  (loading ? "opacity-50 cursor-not-allowed" : "")
}
>
                {loading ? "Registering..." : "Register"}
              </button>
              <p>
                Already have an account?{" "}
                <span
                  className=" text-primary cursor-pointer"
                  onClick={() => setIslogin(true)}
                >
                  Login
                </span>
              </p>
              </div>
          )}

        
      </div>
              
              
    </div>
    </div>
  )

}
export default page;