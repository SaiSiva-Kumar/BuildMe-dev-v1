"use client";

import { useState } from "react";

export default function ForgetPasswordPage() {
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    mobile: false,
    dob: false,
    newPassword: false,
    confirmPassword: false,
    mobileInvalid: false,
    passwordPattern: false,
    confirmMismatch: false,
    apiError: ""
  });

  function handleDobInput(value) {
    const numbers = value.replace(/\D/g, "");
    let output = numbers;

    if (numbers.length > 2) output = numbers.slice(0, 2) + "-" + numbers.slice(2);
    if (numbers.length > 4)
      output =
        numbers.slice(0, 2) +
        "-" +
        numbers.slice(2, 4) +
        "-" +
        numbers.slice(4);

    output = output.slice(0, 10);

    const parts = output.split("-");
    const dd = parts[0];
    const mm = parts[1];

    if (dd && Number(dd) > 31) return;
    if (mm && Number(mm) > 12) return;

    setDob(output);
  }

  async function handleSubmit() {
    let newErr = {
      mobile: false,
      dob: false,
      newPassword: false,
      confirmPassword: false,
      mobileInvalid: false,
      passwordPattern: errors.passwordPattern,
      confirmMismatch: errors.confirmMismatch,
      apiError: ""
    };

    if (mobile.trim() === "") newErr.mobile = true;
    if (dob.trim() === "") newErr.dob = true;
    if (newPassword.trim() === "") newErr.newPassword = true;
    if (confirmPassword.trim() === "") newErr.confirmPassword = true;

    if (mobile.trim() !== "" && (!/^\d{10}$/.test(mobile))) {
      newErr.mobileInvalid = true;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (newPassword.trim() !== "" && !passwordRegex.test(newPassword)) {
      newErr.passwordPattern = true;
    }

    if (confirmPassword.trim() !== "" && confirmPassword !== newPassword) {
      newErr.confirmMismatch = true;
    }

    setErrors(newErr);

    const hasError = Object.values(newErr).some((v) => v === true);
    if (hasError) return;

    try {
      const res = await fetch("/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: mobile,
          dateOfBirth: dob,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.message === "Password updated") {
        window.location.href = "/signIn";
        return;
      }

      if (data.error) {
        setErrors((prev) => ({
          ...prev,
          apiError: data.error
        }));
      }
    } catch (err) {
      console.log("Forget password error:", err);
    }
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  return (
    <div className="w-full min-h-[100dvh] bg-white md:bg-[#d8eefe] overflow-hidden flex justify-center">
      <div className="w-full md:w-[412px] min-h-[100dvh] md:h-[700px] relative overflow-hidden">

        <img
          src="/logo.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute top-[35vh] md:top-[280px] w-full flex flex-col items-center space-y-[25px]">

          <div className="w-[90%] md:w-[348.28px] flex flex-col items-center">
            <input
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  mobile: false,
                  mobileInvalid: false,
                  apiError: ""
                }));
              }}
              autoComplete="off"
              className={`w-full h-[56.08px] rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] bg-white/80 shadow-lg focus:placeholder-transparent focus:outline-none border ${
                errors.mobile || errors.mobileInvalid
                  ? "border-red-500"
                  : "border-[#008080]"
              }`}
              placeholder="Registered Mobile Number"
            />
            {errors.mobileInvalid && (
              <p className="text-red-500 text-[15px] mt-1">
                Enter a valid 10 digit mobile number
              </p>
            )}
          </div>

          <div className="w-[90%] md:w-[348.28px] flex flex-col items-center">
            <input
              value={dob}
              onChange={(e) => {
                handleDobInput(e.target.value);
                setErrors((prev) => ({ ...prev, dob: false, apiError: "" }));
              }}
              autoComplete="off"
              className={`w-full h-[56.08px] rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] bg-white/80 shadow-lg focus:placeholder-transparent focus:outline-none border ${
                errors.dob ? "border-red-500" : "border-[#008080]"
              }`}
              placeholder="Date of Birth"
            />
          </div>

          <div className="w-[90%] md:w-[348.28px] flex flex-col items-center">
            <input
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  newPassword: false,
                  passwordPattern:
                    e.target.value !== "" &&
                    !passwordRegex.test(e.target.value),
                  apiError: ""
                }));
              }}
              type="password"
              autoComplete="off"
              className={`w-full h-[56.08px] rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] bg-white/80 shadow-lg focus:placeholder-transparent focus:outline-none border ${
                errors.newPassword || errors.passwordPattern
                  ? "border-red-500"
                  : "border-[#008080]"
              }`}
              placeholder="New Password"
            />
            {errors.passwordPattern && (
              <div className="text-red-500 text-[15px] mt-2 text-center w-[348.28px]">
                Password must contain and continue that 1 capital letter, 1 lowercase letter, 1 special character, and a minimum of 8 characters
              </div>
            )}
          </div>

          <div className="w-[90%] md:w-[348.28px] flex flex-col items-center">
            <input
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: false,
                  confirmMismatch:
                    e.target.value !== "" && e.target.value !== newPassword,
                  apiError: ""
                }));
              }}
              type="password"
              autoComplete="off"
              className={`w-full h-[56.08px] rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] bg-white/80 shadow-lg focus:placeholder-transparent focus:outline-none border ${
                errors.confirmPassword || errors.confirmMismatch
                  ? "border-red-500"
                  : "border-[#008080]"
              }`}
              placeholder="Confirm New Password"
            />
            {errors.confirmMismatch && (
              <p className="text-red-500 text-[15px] mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-[90%] md:w-[348px] h-[56px] bg-[#008080] rounded-[20px] text-white text-[15px] shadow-lg flex items-center justify-center cursor-pointer"
          >
            Submit
          </button>

          {errors.apiError && (
            <p className="text-red-500 text-[15px] mt-1">
              {errors.apiError}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}