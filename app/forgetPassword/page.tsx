"use client";

import { useState } from "react";

export default function ForgetPasswordPage() {
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI validation errors only
  const [errors, setErrors] = useState({
    mobile: "",
    dob: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function handleSubmit() {
    let hasError = false;

    const newErr = { mobile: "", dob: "", newPassword: "", confirmPassword: "" };

    // MOBILE VALIDATION
    if (!/^\d{10}$/.test(mobile)) {
      newErr.mobile = "Enter correct number";
      hasError = true;
    }

    // DOB VALIDATION
    if (dob.trim() === "") {
      newErr.dob = "Date of birth required";
      hasError = true;
    }

    // PASSWORD PATTERN VALIDATION
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      newErr.newPassword =
        "1 uppercase, 1 lowercase, 1 number, 1 special character, min 8 characters";
      hasError = true;
    }

    // CONFIRM PASSWORD VALIDATION
    if (confirmPassword !== newPassword) {
      newErr.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErr);

    if (hasError) return;

    try {
      // STEP 1: VERIFY MOBILE + DOB
      const verifyRes = await fetch("/api/auth/forgot/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: mobile,
          dateOfBirth: dob,
        }),
      });

      const verifyData = await verifyRes.json();
      console.log("VERIFY RESPONSE:", verifyData);

      if (verifyData.error) return;

      // STEP 2: RESET PASSWORD
      const resetRes = await fetch("/api/auth/forgot/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: verifyData.userId,
          newPassword,
        }),
      });

      const resetData = await resetRes.json();
      console.log("RESET RESPONSE:", resetData);
    } catch (err) {
      console.log("Forget password error:", err);
    }
  }

  return (
    <div className="w-full min-h-[100dvh] bg-white md:bg-[#d8eefe] overflow-hidden flex justify-center">
      <div className="w-full md:w-[412px] min-h-[100dvh] md:h-[700px] relative overflow-hidden">

        <img
          src="/logo.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute top-[35vh] md:top-[280px] w-full flex flex-col items-center space-y-[25px]">

          {/* MOBILE */}
          <div className="w-[90%] md:w-[348.28px] flex flex-col items-center">
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              autoComplete="off"
              className="
                w-full
                h-[56.08px]
                border border-[#008080]
                rounded-[10px] px-[10px]
                text-black placeholder-[#b0a9a9]
                bg-white/80 shadow-lg
                focus:placeholder-transparent focus:outline-none
              "
              placeholder="Registered Mobile Number"
            />
            {errors.mobile && (
              <p className="text-red-500 text-[15px] mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* DOB */}
          <div className="w-[90%] md:w-[348.28px] flex flex-col items-center">
            <input
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              autoComplete="off"
              className="
                w-full
                h-[56.08px]
                border border-[#008080]
                rounded-[10px] px-[10px]
                text-black placeholder-[#b0a9a9]
                bg-white/80 shadow-lg
                focus:placeholder-transparent focus:outline-none
              "
              placeholder="Date of Birth"
            />
            {errors.dob && (
              <p className="text-red-500 text-[15px] mt-1">{errors.dob}</p>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div className="w-[90%] md:w-[348.28px] flex flex-col items-center">
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              autoComplete="off"
              className="
                w-full
                h-[56.08px]
                border border-[#008080]
                rounded-[10px] px-[10px]
                text-black placeholder-[#b0a9a9]
                bg-white/80 shadow-lg
                focus:placeholder-transparent focus:outline-none
              "
              placeholder="New Password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-[15px] mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="w-[90%] md:w-[348.28px] flex flex-col items-center">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              autoComplete="off"
              className="
                w-full
                h-[56.08px]
                border border-[#008080]
                rounded-[10px] px-[10px]
                text-black placeholder-[#b0a9a9]
                bg-white/80 shadow-lg
                focus:placeholder-transparent focus:outline-none
              "
              placeholder="Confirm New Password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-[15px] mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="
              w-[90%] md:w-[348px]
              h-[56px]
              bg-[#008080]
              rounded-[20px]
              text-white text-[15px]
              shadow-lg
              flex items-center justify-center
            "
          >
            Submit
          </button>

        </div>
      </div>
    </div>
  );
}