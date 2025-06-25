import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8800/api/auth/send-verification-code",
        { email }
      );
      alert(data.message);
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      setErr(serverMsg || error.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-sm p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
