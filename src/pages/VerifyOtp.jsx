import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const { state } = useLocation();
  const email = state?.email || "";           // grab email from navigation state
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const { data } = await axios.post(
        "http://localhost:8800/api/auth/verify-code-and-reset-password",
        {
          email,           // same email you sent OTP to
          verifyCode: otp, // make sure this matches exactly
          password,
        }
      );
      alert(data.message || data);  // your backend sends { message } or a string
      navigate("/login");
    } catch (error) {
      // backend returns plain string on 400, not { message }
      const serverMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message;
      setErr(serverMsg || error.message || "Verification failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-sm p-8 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
        <p className="text-gray-600 text-sm">
          We sent an OTP to <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        {err && <p className="text-red-500 text-sm">{err}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
