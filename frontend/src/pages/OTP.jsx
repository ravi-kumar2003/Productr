import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PromotionalPanel from "../components/PromotionalPanel";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const { email, phone } = location.state || {};

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      while (newOtp.length < 6) newOtp.push("");
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = email
        ? { email, otp: otpValue }
        : { phone, otp: otpValue };

      const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      login(data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(20);
    setError("");

    try {
      const payload = email ? { email } : { phone };

      const response = await fetch(`${API_BASE_URL}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError("Failed to resend OTP");
      }
    } catch {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <PromotionalPanel />
      </div>

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
            Login to your Productr Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-4 text-slate-800 font-medium text-center">
                Enter OTP
              </label>

              <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={loading}
                    className={`w-14 h-14 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Didn’t receive OTP?{" "}
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-blue-600 font-medium"
              >
                Resend
              </button>
            ) : (
              <span className="text-blue-600">Resend in {resendTimer}s</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
