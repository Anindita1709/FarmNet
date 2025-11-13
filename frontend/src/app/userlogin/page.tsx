
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

interface PageProps {}

const Page = ({}: PageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/",
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("auth/login", { email, password });
      const data = res.data;

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userid", data.user._id);
        toast.success("Login successful!");
        router.push("/landing");
      }
    } catch (error) {
      toast.error("Login failed. Please check credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("auth/register", {
        name,
        email,
        phone,
        password,
      });

      toast.success("Account created successfully!");
      setIsLogin(true);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else {
        toast.error(error.message || "Something went wrong");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          <span className="text-cyan-500">FarmNet</span> {isLogin ? "Login" : "Register"}
        </h1>

        {/* Login Form */}
        {isLogin && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-cyan-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-cyan-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full rounded-md bg-cyan-500 px-3 py-2 text-white font-semibold shadow hover:bg-cyan-800 focus:outline-2 focus:outline-cyan-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-gray-500">
              Don't have an account?{" "}
              <span
                className="text-cyan-500 cursor-pointer font-semibold hover:text-cyan-800"
                onClick={() => {
                  setIsLogin(false);
                  setEmail("");
                  setPassword("");
                }}
              >
                Register
              </span>
            </p>
          </div>
        )}

        {/* Register Form */}
        {!isLogin && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-cyan-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-cyan-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-cyan-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-cyan-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-2 focus:outline-cyan-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={() => {
                if (password === confirmPassword) {
                  handleRegister();
                } else {
                  toast.error("Passwords do not match");
                }
              }}
              disabled={loading}
              className={`w-full rounded-md bg-cyan-500 px-3 py-2 text-white font-semibold shadow hover:bg-cyan-800 focus:outline-2 focus:outline-cyan-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="text-center text-gray-500">
              Already have an account?{" "}
              <span
                className="text-cyan-500 cursor-pointer font-semibold hover:text-cyan-800"
                onClick={() => {
                  setIsLogin(true);
                  setName("");
                  setEmail("");
                  setPhone("");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                Login
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
