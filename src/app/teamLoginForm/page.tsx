"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast/Toast";
import Navbar2 from "@/components/Navbar2";

export default function TeamLoginForm() {
  const [teamData, setTeamData] = useState({
    teamName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const router = useRouter();

  // Handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/teamlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ type: "success", message: "Login Successful!" });
        // Save the token to localStorage or use it for further requests
        localStorage.setItem("token", data.token);
        router.push("/teamuserprofile"); // Redirect to a teamuserprofile or home page after login
      } else {
        setToast({ type: "error", message: data.message });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setToast({ type: "error", message: "Error logging in" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
              <Navbar2 />

      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6">Team Login</h2>

      {/* Toast Notification */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team Name */}
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-[#0E1AC6]">Team Name</label>
          <input
            type="text"
            name="teamName"
            id="teamName"
            value={teamData.teamName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#0E1AC6]">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={teamData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
    </div>
    
  );
}
