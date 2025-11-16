"use client";

import { useState } from "react";

export default function SignUpCard() {
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [dobFocused, setDobFocused] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    dob: false,
    gender: false,
    mobile: false,
    email: false,
    password: false,
    confirmPassword: false,
    confirmMismatch: false,
    passwordPattern: false
  });

  async function handleRegister() {
    const passwordRegex = /^(?=.[A-Z])(?=.\d)(?=.*[\W_]).{8,}$/;

    const newErrors = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      dob: dob.trim() === "",
      gender: gender.trim() === "",
      mobile: mobile.trim() === "",
      email: email.trim() === "",
      password: password.trim() === "",
      confirmPassword: confirmPassword.trim() === "",
      confirmMismatch: confirmPassword !== password,
      passwordPattern: !passwordRegex.test(password)
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((v) => v === true);
    if (hasError) return;

    const payload = {
      firstName,
      lastName,
      dateOfBirth: dob,
      gender,
      mobileNumber: mobile,
      emailId: email,
      password
    };

    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("API Response:", data);
    } catch (err) {
      console.log("Error calling signup:", err);
    }
  }

  return (
    <div className="w-full min-h-[100dvh] bg-white md:bg-[#d8eefe] overflow-hidden flex justify-center">
      
      <div className="w-full md:w-[412px] min-h-[100dvh] relative overflow-hidden">

        <img
          src="/signUpbackground.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 mt-[35px] flex flex-col items-center space-y-[35px] pb-[40px]">

          <div className="w-[120px] h-[120px] bg-[#D9D9D9] rounded-full"></div>

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.firstName ? "border-red-500" : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg 
            transition-all duration-200 focus:placeholder-transparent 
            focus:outline-none focus:border-[#008080] focus:ring-0`}
            placeholder="First Name"
          />

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.lastName ? "border-red-500" : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg 
            transition-all duration-200 focus:placeholder-transparent 
            focus:outline-none focus:border-[#008080] focus:ring-0`}
            placeholder="Last Name"
          />

          <div
            className={`w-[348.28px] h-[56.08px] border ${
              errors.dob ? "border-red-500" : "border-[#008080]"
            } rounded-[10px] shadow-lg flex items-center px-[10px]`}
          >
            <span
              className={`text-[#b0a9a9] mr-2 transition-opacity duration-200 ${
                dob || dobFocused ? "opacity-0" : "opacity-100"
              }`}
            >
              Date of Birth
            </span>

            <input
              type="date"
              value={dob}
              onFocus={() => setDobFocused(true)}
              onBlur={() => setDobFocused(false)}
              onChange={(e) => setDob(e.target.value)}
              className="flex-1 text-black outline-none bg-transparent focus:border-[#008080] focus:ring-0"
            />
          </div>

          <div className="flex justify-between w-[348.28px]">

            <div
              onClick={() => {
                setGender("Male");
                setErrors((e) => ({ ...e, gender: false }));
              }}
              className={`w-[88px] h-[56.08px] border ${
                errors.gender ? "border-red-500" : "border-[#008080]"
              } rounded-[10px] shadow-lg flex items-center justify-center cursor-pointer transition-all ${
                gender === "Male" ? "bg-[#008080] text-white font-bold" : "text-[#b0a9a9]"
              }`}
            >
              Male
            </div>

            <div
              onClick={() => {
                setGender("Female");
                setErrors((e) => ({ ...e, gender: false }));
              }}
              className={`w-[88px] h-[56.08px] border ${
                errors.gender ? "border-red-500" : "border-[#008080]"
              } rounded-[10px] shadow-lg flex items-center justify-center cursor-pointer transition-all ${
                gender === "Female" ? "bg-[#008080] text-white font-bold" : "text-[#b0a9a9]"
              }`}
            >
              Female
            </div>

            <div
              onClick={() => {
                setGender("Other");
                setErrors((e) => ({ ...e, gender: false }));
              }}
              className={`w-[88px] h-[56.08px] border ${
                errors.gender ? "border-red-500" : "border-[#008080]"
              } rounded-[10px] shadow-lg flex items-center justify-center cursor-pointer transition-all ${
                gender === "Other" ? "bg-[#008080] text-white font-bold" : "text-[#b0a9a9]"
              }`}
            >
              Other
            </div>

          </div>

          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.mobile ? "border-red-500" : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 
            focus:placeholder-transparent focus:outline-none 
            focus:border-[#008080] focus:ring-0`}
            placeholder="Mobile"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.email ? "border-red-500" : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 
            focus:placeholder-transparent focus:outline-none 
            focus:border-[#008080] focus:ring-0`}
            placeholder="Email"
          />

          <div className="flex flex-col items-center w-full">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="off"
              className={`w-[348.28px] h-[56.08px] border ${
                errors.password || errors.passwordPattern
                  ? "border-red-500"
                  : "border-[#008080]"
              } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 
              focus:placeholder-transparent focus:outline-none 
              focus:border-[#008080] focus:ring-0`}
              placeholder="Password"
            />

            {errors.passwordPattern && (
              <div className="text-red-500 text-[15px] font-inter mt-2 text-center w-[348.28px]">
                Password must be 8+ chars, 1 uppercase, 1 number, 1 special character
              </div>
            )}
          </div>

          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.confirmPassword || errors.confirmMismatch
                ? "border-red-500"
                : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 
            focus:placeholder-transparent focus:outline-none 
            focus:border-[#008080] focus:ring-0`}
            placeholder="Confirm Password"
          />

          {errors.confirmMismatch && (
            <div className="text-red-500 text-[15px] font-inter mt-[-25px] text-center w-full">
              Make sure, confirm password match with password
            </div>
          )}

          <button
            onClick={handleRegister}
            className="mt-[40px] w-[348.28px] h-[56.08px] bg-[#008080] rounded-[20px] text-white text-[15px] font-inter flex items-center justify-center shadow-lg px-[10px]"
          >
            Register
          </button>

          <div className="mt-[22px] text-[15px] font-inter flex items-center justify-center">
            <span className="text-black">Already have an account? </span>
            <span
              className="text-[#008080] ml-1 cursor-pointer"
              onClick={() => (window.location.href = "/signIn")}
            >
              Sign in
            </span>
          </div>

        </div>  

      </div>
    </div>
  );
}