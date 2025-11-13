"use client";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
//import axiosinstance from "../../../axiosconfig";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PageProps { }

const page = ({ }: PageProps) => {
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
        
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userid", data.user._id); 
        toast.success("Login successful!");
        nav.push("/landing");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please check credentials.");
    } finally {
      setLoading(false); // stop loading
    }
  };
  const HandleRegister = async () => {
    try {
      setLoading(true);
      const res = await axiosinstance.post("auth/register", {
        name: name,
        email: email,
        phone: phone,
        password: password
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
    } finally {
      setLoading(false); // stop loading
    }

  };

  return (
    
      
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
        <ToastContainer />
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className=" mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">

            <span className=" text-primary">AgriChain</span> Account
          </h1>
        </div>
        {islogin && (

          <div className=" mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 ">Email address</label>
              <div className="mt-2">
                <input
                  type="email"

                  className=" block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-500 sm:text-sm/6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  placeholder="Password"
                  className=" block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-500 sm:text-sm/6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-2">
              <button
                onClick={() => {
                  handleLogin();
                }}
                className="cursor-pointer flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                {loading ? "Logging in..." : "Login"}

              </button>
            </div>
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Don't have an account?{" "}
              <span
                className=" text-primary cursor-pointer font-semibold text-cyan-500 hover:text-cyan-800"
                onClick={() => {
                  setIslogin(false)
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
            <button onClick={() => {
              if (password === confirmPassword) {
                HandleRegister();
              } else {
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
   
  )

}
export default page;