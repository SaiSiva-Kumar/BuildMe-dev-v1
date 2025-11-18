"use client";

import { useState } from "react";

export default function SignInPage() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    emailOrMobile: false,
    password: false,
    apiPasswordError: "",
    frontendEmailOrMobile: "",
    passwordLengthError: "",
    apiAccountNotFound: "",
    successMessage: ""
  });

  function validateEmailOrMobile(value: string) {
    if (/[a-zA-Z]/.test(value) || value.includes("@")) {
      if (!value.includes("@")) return "Invalid email format.";
      const parts = value.split("@");
      if (parts.length !== 2 || parts[0].length === 0 || !parts[1].includes(".")) {
        return "Invalid email format.";
      }
      return "";
    }

    if (/^\d+$/.test(value)) {
      if (value.length !== 10) return "Mobile number must be 10 digits.";
      return "";
    }

    return "Invalid input.";
  }

  async function handleSignIn() {
    const emailMobileError =
      emailOrMobile.trim() === "" ? "" : validateEmailOrMobile(emailOrMobile);

    const passwordLengthError =
      password.trim() === ""
        ? ""
        : password.trim().length < 8
        ? "Password should be at least 8 characters"
        : "";

    const newErrors = {
      emailOrMobile: emailOrMobile.trim() === "" || emailMobileError !== "",
      password: password.trim() === "" || passwordLengthError !== "",
      apiPasswordError: "",
      frontendEmailOrMobile: emailOrMobile.trim() === "" ? "" : emailMobileError,
      passwordLengthError: password.trim() === "" ? "" : passwordLengthError,
      apiAccountNotFound: "",
      successMessage: ""
    };

    setErrors(newErrors);

    const hasError = newErrors.emailOrMobile || newErrors.password;
    if (hasError) return;

    try {
      const res = await fetch("/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrMobile, password })
      });

      const data = await res.json();

      if (data.error === "Account does not exist.") {
        setErrors((prev) => ({
          ...prev,
          apiAccountNotFound: "Account does not exist."
        }));
        return;
      }

      if (data.error === "Invalid password.") {
        setErrors((prev) => ({
          ...prev,
          apiPasswordError: "Invalid password."
        }));
        return;
      }

      if (data.message === "success") {
        setErrors((prev) => ({
          ...prev,
          successMessage: "Thanks for testing our user onboarding page 😎😎"
        }));
      }
    } catch (err) {
      console.log("Sign-in error:", err);
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

        <div className="absolute top-[35vh] md:top-[280px] w-full flex flex-col items-center">

          <input
            value={emailOrMobile}
            onChange={(e) => {
              setEmailOrMobile(e.target.value);
              setErrors((prev) => ({
                ...prev,
                emailOrMobile: false,
                frontendEmailOrMobile: "",
                apiAccountNotFound: "",
                successMessage: ""
              }));
            }}
            autoComplete="off"
            className={`
              w-[90%] md:w-[348.28px]
              h-[56.08px]
              border ${
                errors.emailOrMobile || errors.frontendEmailOrMobile
                  ? "border-red-500"
                  : "border-[#008080]"
              }
              rounded-[10px] px-[10px]
              text-black placeholder-[#b0a9a9]
              bg-white/80 shadow-lg
              transition-all duration-200
              focus:placeholder-transparent focus:outline-none
            `}
            placeholder="Email or Mobile"
          />

          {errors.frontendEmailOrMobile && emailOrMobile.trim() !== "" && (
            <div className="text-red-500 text-[15px] font-inter mt-2 w-[90%] md:w-[348.28px] text-center">
              {errors.frontendEmailOrMobile}
            </div>
          )}

          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: false,
                apiPasswordError: "",
                passwordLengthError: "",
                successMessage: ""
              }));
            }}
            type="password"
            autoComplete="off"
            className={`
              w-[90%] md:w-[348.28px]
              h-[56.08px]
              border ${
                errors.password || errors.apiPasswordError || errors.passwordLengthError
                  ? "border-red-500"
                  : "border-[#008080]"
              }
              rounded-[10px] px-[10px]
              text-black placeholder-[#b0a9a9]
              bg-white/80 shadow-lg
              transition-all duration-200
              focus:placeholder-transparent focus:outline-none
              mt-[21px]
            `}
            placeholder="Password"
          />

          {errors.passwordLengthError && password.trim() !== "" && (
            <div className="text-red-500 text-[15px] font-inter mt-2 w-[90%] md:w-[348.28px] text-center">
              {errors.passwordLengthError}
            </div>
          )}

          {errors.apiPasswordError && (
            <div className="text-red-500 text-[15px] font-inter mt-2 w-[90%] md:w-[348.28px] text-center">
              {errors.apiPasswordError}
            </div>
          )}

          <div
            className="
              w-[90%] md:w-[348.28px]
              mt-[21px]
              text-right
              text-[#008080]
              text-[15px]
              font-inter
            "
          >
            <span className="cursor-pointer" onClick={() => (window.location.href = "/forgetPassword")}>
              Forget Password?
            </span>
          </div>

          <button
            onClick={handleSignIn}
            className="
              w-[90%] md:w-[348px]
              h-[56px]
              bg-[#008080]
              rounded-[20px]
              text-white
              text-[15px]
              font-inter 
              flex items-center justify-center
              mt-[41px]
              shadow-lg
              cursor-pointer
            "
          >
            Sign In
          </button>

          <div className="mt-[22px] text-[15px] font-inter flex items-center justify-center">
            <span className="text-black">New User? </span>
            <span
              className="text-[#008080] ml-1 cursor-pointer"
              onClick={() => (window.location.href = "/signUp")}
            >
              Register
            </span>
          </div>

          {errors.apiAccountNotFound && (
            <div className="text-red-500 text-[15px] font-inter mt-2 w-[90%] md:w-[348.28px] text-center">
              {errors.apiAccountNotFound}
            </div>
          )}

          {errors.successMessage && (
            <div className="text-green-600 text-[15px] font-inter mt-2 w-[90%] md:w-[348.28px] text-center">
              {errors.successMessage}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}