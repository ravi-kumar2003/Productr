import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PromotionalPanel from "../components/PromotionalPanel";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Determine if it's email or phone
      const isEmail = identifier.includes("@");
      const payload = isEmail ? { email: identifier } : { phone: identifier };

      const response = await fetch("http://localhost:5000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      // Navigate to OTP page with identifier
      navigate("/otp", {
        state: {
          email: isEmail ? identifier : null,
          phone: !isEmail ? identifier : null,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex">
      {/* Left Panel - Promotional */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <PromotionalPanel />
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 text-center">
              Login to your Productr Account
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="identifier"
                className="block mb-2 text-slate-800 font-medium"
              >
                Email or Phone number
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                For phone: OTP will be sent via SMS (check console for
                development)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-right">
            <p className="text-slate-600 text-sm">
              Don't have a Productr Account{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                SignUp Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
