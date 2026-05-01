import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [role, setRole] = useState("doctor");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  // Password Strength Checker
  const getPasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (password.length < 9) return "Medium";
    return "Strong";
  };

  const handleSendOtp = async () => {
  if (!formData.email) {
    toast.error("Enter email first");
    return;
  }

  try {
    setOtpLoading(true);

    const res = await fetch("https://smart-healthcare-app-ghwj.onrender.com/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });

    if (!res.ok) {
      toast.error("Failed to send OTP");
      return;
    }

    toast.success("OTP sent to your email");
    setShowOtpBox(true);
    setTimer(30);   // ✅ START TIMER

  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setOtpLoading(false);
  }
};

const handleVerifyOtp = async () => {
  const enteredOtp = otp.join("");

  if (enteredOtp.length !== 6) {
    toast.error("Enter complete OTP");
    return;
  }

  try {
    const res = await fetch("https://smart-healthcare-app-ghwj.onrender.com/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        otp: enteredOtp,
      }),
    });

    if (!res.ok) {
      toast.error("Invalid OTP");
      return;
    }

    toast.success("Email verified successfully!");
    setEmailVerified(true);
    setShowOtpBox(false);

  } catch (err) {
    toast.error("Verification failed");
  }
};

useEffect(() => {
  if (timer <= 0) return;

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);

const handleResendOtp = async () => {
  try {
    const res = await fetch("https://smart-healthcare-app-ghwj.onrender.com/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });

    if (!res.ok) {
      const msg = await res.text();
      toast.error(msg);
      return;
    }

    toast.success("OTP resent!");
    setTimer(30);
  } catch {
    toast.error("Failed to resend OTP");
  }
};

const handleOtpChange = (value, index) => {
  if (!/^[0-9]?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < 5) {
    document.getElementById(`otp-${index + 1}`).focus();
  }
};

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    if (formData.password !== formData.rePassword) {
      setError("Passwords do not match!");
      return;
    }

    

    try {
      const res = await fetch(
        `https://smart-healthcare-app-ghwj.onrender.com/api/${role}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        setError(msg);
        return;
      }

      toast.success("Registration successful!");
      navigate("/login");

    } catch (err) {
      setError("Something went wrong.");
    }
  };
  const handleOtpKeyDown = (e, index) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    document.getElementById(`otp-${index - 1}`).focus();
  }
};

const handleOtpPaste = (e) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData("text").trim();

  if (!/^\d{6}$/.test(pasteData)) return;

  const newOtp = pasteData.split("");
  setOtp(newOtp);

  document.getElementById("otp-5").focus();
};


  return (
    <div className="w-full flex justify-center items-center py-10 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white border border-blue-200 transition hover:scale-[1.02]">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Create Account</h1>
          <p className="text-gray-500 mt-2">
            Sign up to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          <InputField
            label="Name"
            name="name"
            placeholder="Your Name"
            handleChange={handleChange}
          />
        
<div>
  <label className="block text-sm font-medium text-gray-700">
    Email Address
  </label>

  <div className="flex gap-2">
    <input
      type="email"
      name="email"
      onChange={handleChange}
      required
      placeholder="you@gmail.com"
      disabled={emailVerified}
      className="flex-1 px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
    />

    {!emailVerified && (
      <button
        type="button"
        onClick={handleSendOtp}
        disabled={otpLoading}
        className="px-3 py-2 mt-1 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
      >
        {otpLoading ? "Sending..." : "Verify Email"}
      </button>
    )}

    {emailVerified && (
      <span className="px-3 py-2 mt-1 bg-green-100 text-green-700 rounded-lg text-sm">
        Verified ✓
      </span>
    )}
  </div>
</div>
{showOtpBox && (
  <div className="mt-6 flex justify-center">
    
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

      {/* Title */}
      <h3 className="text-center text-lg font-semibold text-gray-800">
        Verify your email
      </h3>

      <p className="text-center text-sm text-gray-500 mt-1">
        Enter the 6-digit code sent to your email
      </p>

      {/* OTP Boxes */}
      <div className="grid grid-cols-6 gap-2 mt-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(e.target.value, index)}
            onKeyDown={(e) => handleOtpKeyDown(e, index)}
            onPaste={handleOtpPaste}
            className="
              w-full aspect-square
              text-lg sm:text-xl
              text-center
              border border-gray-300
              rounded-xl
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-200
              transition
            "
          />
        ))}
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        onClick={handleVerifyOtp}
        className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition"
      >
        Confirm OTP
      </button>

      {/* Resend Section */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={timer > 0}
          className={`text-sm font-medium transition ${
            timer > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:underline"
          }`}
        >
          {timer > 0
            ? `Resend OTP in ${timer}s`
            : "Resend OTP"}
        </button>
      </div>

    </div>
  </div>
)}
          

          <PasswordField
            label="Password"
            name="password"
            show={showPass}
            setShow={setShowPass}
            handleChange={handleChange}
          />

          {/* Password Strength */}
          {formData.password && (
            <p
              className={`text-sm font-medium ${
                strength === "Weak"
                  ? "text-red-600"
                  : strength === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              Password Strength: {strength}
            </p>
          )}

          <PasswordField
            label="Retype Password"
            name="rePassword"
            show={showRePass}
            setShow={setShowRePass}
            handleChange={handleChange}
          />

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Register as
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-300 focus:border-blue-400"
            >
              <option value="doctor">Doctor</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="patient">Patient</option>
            </select>
          </div>

<button
  type="submit"
  disabled={!emailVerified}
  className={`w-full py-3 text-white font-bold rounded-lg shadow-md transition ${
    emailVerified
      ? "bg-blue-500 hover:bg-blue-600"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  Sign Up
</button>
        </form>

        <div className="text-sm text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};

export default Register;


/* ---------- Small Components ---------- */

const InputField = ({
  label,
  name,
  placeholder,
  type = "text",
  handleChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      onChange={handleChange}
      required
      placeholder={placeholder}
      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
    />
  </div>
);

const PasswordField = ({
  label,
  name,
  show,
  setShow,
  handleChange,
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={show ? "text" : "password"}
      name={name}
      onChange={handleChange}
      required
      placeholder="enter your password"
      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
    />
    <span
      className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
      onClick={() => setShow(!show)}
    >
      {show ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
);