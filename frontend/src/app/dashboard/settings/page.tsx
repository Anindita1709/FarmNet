/*
"use client";

import { useState } from "react";

export default function Settings() {
  // Profile state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Security state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications state
  const [emailNotif, setEmailNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);

  const handleSaveProfile = () => {
    // call API to save profile
    console.log("Profile saved:", { fullName, email });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // call API to update password
    console.log("Password updated:", newPassword);
  };

  const handleSaveNotifications = () => {
    // call API to save notification preferences
    console.log("Notifications saved:", { emailNotif, smsNotif });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-inter">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
        <label className="block mb-2 text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter full name"
        />
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter email"
        />
        <button
          onClick={handleSaveProfile}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>

    
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Security</h2>
        <label className="block mb-2 text-sm font-medium">Change Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="New password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Confirm new password"
        />
        <button
          onClick={handleUpdatePassword}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Update Password
        </button>
      </div>

     
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Email Notifications</span>
        </label>
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={smsNotif}
            onChange={(e) => setSmsNotif(e.target.checked)}
            className="w-4 h-4"
          />
          <span>SMS Alerts</span>
        </label>
        <button
          onClick={handleSaveNotifications}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
*/

"use client";

import { useState, useEffect } from "react";

export default function Settings() {
  // ------------------------------
  // State
  // ------------------------------
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotif, setEmailNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // ------------------------------
  // Load token & fetch user data
  // ------------------------------
  useEffect(() => {
    // Access localStorage only on client
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.warn("No token found. User might not be logged in.");
      setLoading(false);
      return;
    }
    setToken(storedToken);

    // Fetch user profile & notification settings
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setFullName(data.name || "");
        setEmail(data.email || "");
        setEmailNotif(data.emailNotif || false);
        setSmsNotif(data.smsNotif || false);
      } catch (err) {
        console.error(err);
        alert("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleSaveProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/users/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: fullName, email }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  const handleUpdatePassword = async () => {
    if (!token) return;
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/users/updatePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error("Failed to update password");
      alert("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Error updating password");
    }
  };

  const handleSaveNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/users/updateNotifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emailNotif, smsNotif }),
      });
      if (!res.ok) throw new Error("Failed to update notifications");
      alert("Notification preferences updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating notifications");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="p-6 max-w-3xl mx-auto font-inter">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
        <label className="block mb-2 text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter full name"
        />
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter email"
        />
        <button
          onClick={handleSaveProfile}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>

      {/* Security Settings */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Security</h2>
        <label className="block mb-2 text-sm font-medium">Change Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="New password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Confirm new password"
        />
        <button
          onClick={handleUpdatePassword}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Update Password
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Email Notifications</span>
        </label>
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={smsNotif}
            onChange={(e) => setSmsNotif(e.target.checked)}
            className="w-4 h-4"
          />
          <span>SMS Alerts</span>
        </label>
        <button
          onClick={handleSaveNotifications}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
