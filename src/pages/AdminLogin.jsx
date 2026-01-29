import { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Demo credentials
    if (username === "admin" && password === "zaarix123") {
      onLogin();
    } else {
      setError("Invalid Username or Password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-4">

      <div className="w-full max-w-md bg-white/5 border border-white/10 
                      rounded-2xl p-8 shadow-2xl shadow-blue-500/20">

        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-400 tracking-wide">
            ZAARIX
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Admin Control Center
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Admin Access
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-lg bg-[#0f172a] 
                       border border-white/10 outline-none
                       focus:border-blue-500 transition"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-[#0f172a] 
                       border border-white/10 outline-none
                       focus:border-blue-500 transition"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 py-2 rounded-lg font-medium 
                       hover:bg-blue-600 transition shadow-lg shadow-blue-500/40"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-5 space-y-2">
          <p className="text-sm text-gray-400 hover:text-blue-400 cursor-pointer">
            Forgot Password?
          </p>

          <p className="text-sm text-gray-400">
            Need an account?{" "}
            <span className="text-blue-400 hover:underline cursor-pointer">
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
