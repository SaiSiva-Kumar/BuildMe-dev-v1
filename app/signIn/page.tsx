"use client";

import { useState } from "react";

export default function SignInPage() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    emailOrMobile: false,
    password: false,
    apiEmailError: "",
    apiPasswordError: ""
  });

  async function handleSignIn() {
    const newErrors = {
      emailOrMobile: emailOrMobile.trim() === "",
      password: password.trim() === "",
      apiEmailError: "",
      apiPasswordError: ""
    };

    setErrors(newErrors);

    const hasError =
      newErrors.emailOrMobile === true || newErrors.password === true;
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
          apiEmailError: "Account does not exist."
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

      console.log("SUCCESS:", data);

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

          {/* EMAIL OR MOBILE */}
          <input
            value={emailOrMobile}
            onChange={(e) => {
              setEmailOrMobile(e.target.value);
              setErrors((prev) => ({
                ...prev,
                emailOrMobile: false,
                apiEmailError: ""
              }));
            }}
            autoComplete="off"
            className={`
              w-[90%] md:w-[348.28px]
              h-[56.08px]
              border ${errors.emailOrMobile || errors.apiEmailError ? "border-red-500" : "border-[#008080]"}
              rounded-[10px] px-[10px]
              text-black placeholder-[#b0a9a9]
              bg-white/80 shadow-lg
              transition-all duration-200
              focus:placeholder-transparent focus:outline-none
            `}
            placeholder="Email or Mobile"
          />

          {errors.apiEmailError && (
            <div className="text-red-500 text-[15px] font-inter mt-2 w-[90%] md:w-[348.28px] text-center">
              {errors.apiEmailError}
            </div>
          )}

          {/* PASSWORD */}
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: false,
                apiPasswordError: ""
              }));
            }}
            type="password"
            autoComplete="off"
            className={`
              w-[90%] md:w-[348.28px]
              h-[56.08px]
              border ${errors.password || errors.apiPasswordError ? "border-red-500" : "border-[#008080]"}
              rounded-[10px] px-[10px]
              text-black placeholder-[#b0a9a9]
              bg-white/80 shadow-lg
              transition-all duration-200
              focus:placeholder-transparent focus:outline-none
              mt-[21px]
            `}
            placeholder="Password"
          />

          {errors.apiPasswordError && (
            <div className="text-red-500 text-[15px] font-inter mt-2 w-[90%] md:w-[348.28px] text-center">
              {errors.apiPasswordError}
            </div>
          )}

          {/* FORGET PASSWORD */}
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

          {/* BUTTON */}
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

          {/* NEW USER */}
          <div className="mt-[22px] text-[15px] font-inter flex items-center justify-center">
            <span className="text-black">New User? </span>
            <span
              className="text-[#008080] ml-1 cursor-pointer"
              onClick={() => (window.location.href = "/signUp")}
            >
              Register
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}