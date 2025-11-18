"use client";

import { useState, useEffect } from "react";

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
    passwordPattern: false,
    mobileInvalid: false,
    emailInvalid: false,
    apiError: ""
  });

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("signup_avatar");
    if (stored) {
      setAvatar(stored);
      return;
    }

    const list = [
      "apple.png",
      "avocado.png",
      "kiwi.png",
      "mango.png",
      "pineapple.png"
    ];
    const pick = list[Math.floor(Math.random() * list.length)];
    setAvatar(pick);
    localStorage.setItem("signup_avatar", pick);
  }, []);

  function handleDobInput(value: string) {
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

  async function handleRegister() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const mobileIsNumber = /^\d+$/.test(mobile);
    const emailHasAt = email.includes("@");

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
      passwordPattern: errors.passwordPattern,
      mobileInvalid:
        mobile.trim() !== "" &&
        (!mobileIsNumber || mobile.length !== 10),
      emailInvalid: email.trim() !== "" && !emailHasAt,
      apiError: ""
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

      if (data.error === "Email already exists." || data.error === "Mobile number already exists.") {
        setErrors((prev) => ({
          ...prev,
          apiError: data.error
        }));
        return;
      }

      if (data.message === "success") {
        window.location.href = "/signIn";
      }
    } catch (err) {
      console.log("Error calling signup:", err);
    }
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  return (
    <div className="w-full min-h-[100dvh] bg-white md:bg-[#d8eefe] overflow-hidden flex justify-center">
      <div className="w-full md:w-[412px] min-h-[100dvh] relative overflow-hidden">
        <img
          src="/signUpbackground.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 mt-[35px] flex flex-col items-center space-y-[35px] pb-[40px]">

          <div className="w-[120px] h-[120px] bg-[#D9D9D9] rounded-full overflow-hidden flex items-center justify-center">
            {avatar && (
              <img
                src={`/${avatar}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors((prev) => ({ ...prev, firstName: false }));
            }}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.firstName ? "border-red-500" : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 focus:placeholder-transparent focus:outline-none focus:border-[#008080] focus:ring-0`}
            placeholder="First Name"
          />

          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors((prev) => ({ ...prev, lastName: false }));
            }}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.lastName ? "border-red-500" : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 focus:placeholder-transparent focus:outline-none focus:border-[#008080] focus:ring-0`}
            placeholder="Last Name"
          />

          <input
            value={dob}
            onChange={(e) => {
              handleDobInput(e.target.value);
              setErrors((prev) => ({ ...prev, dob: false }));
            }}
            onFocus={() => setDobFocused(true)}
            onBlur={() => setDobFocused(false)}
            maxLength={10}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.dob ? "border-red-500" : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 focus:placeholder-transparent focus:outline-none focus:border-[#008080] focus:ring-0`}
            placeholder="Date of Birth, example format 04-04-2004"
          />

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
            onChange={(e) => {
              setMobile(e.target.value);
              setErrors((prev) => ({
                ...prev,
                mobile: false,
                mobileInvalid: false
              }));
            }}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.mobile || errors.mobileInvalid
                ? "border-red-500"
                : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 focus:placeholder-transparent focus:outline-none focus:border-[#008080] focus:ring-0`}
            placeholder="Mobile"
          />

          {errors.mobileInvalid && (
            <div className="text-red-500 text-[15px] font-inter mt-[-25px] text-center w-[348.28px]">
              Enter a valid 10 digital mobile number
            </div>
          )}

          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({
                ...prev,
                email: false,
                emailInvalid: false
              }));
            }}
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.email || errors.emailInvalid
                ? "border-red-500"
                : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 focus:placeholder-transparent focus:outline-none focus:border-[#008080] focus:ring-0`}
            placeholder="Email"
          />

          {errors.emailInvalid && (
            <div className="text-red-500 text-[15px] font-inter mt-[-25px] text-center w-[348.28px]">
              Enter a valid email id
            </div>
          )}

          <div className="flex flex-col items-center w-full">
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  password: false,
                  passwordPattern:
                    e.target.value !== "" &&
                    !passwordRegex.test(e.target.value)
                }));
              }}
              onFocus={() =>
                setErrors((prev) => ({ ...prev, passwordPattern: false }))
              }
              type="password"
              autoComplete="off"
              className={`w-[348.28px] h-[56.08px] border ${
                errors.password || errors.passwordPattern
                  ? "border-red-500"
                  : "border-[#008080]"
              } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 focus:placeholder-transparent focus:outline-none focus:border-[#008080] focus:ring-0`}
              placeholder="Password"
            />

            {errors.passwordPattern && (
              <div className="text-red-500 text-[15px] font-inter mt-2 text-center w-[348.28px]">
                Password must contain and continue that 1 capital letter, 1 lowercase letter, 1 special character, and a minimum of 8 characters
              </div>
            )}
          </div>

          <input
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                confirmPassword: false,
                confirmMismatch:
                  e.target.value !== "" && e.target.value !== password
              }));
            }}
            onFocus={() =>
              setErrors((prev) => ({ ...prev, confirmMismatch: false }))
            }
            type="password"
            autoComplete="off"
            className={`w-[348.28px] h-[56.08px] border ${
              errors.confirmPassword || errors.confirmMismatch
                ? "border-red-500"
                : "border-[#008080]"
            } rounded-[10px] px-[10px] text-black placeholder-[#b0a9a9] shadow-lg transition-all duration-200 focus:placeholder-transparent focus:outline-none focus:border-[#008080] focus:ring-0`}
            placeholder="Confirm Password"
          />

          {errors.confirmMismatch && (
            <div className="text-red-500 text-[15px] font-inter mt-[-25px] text-center w-full">
              Make sure, confirm password match with password
            </div>
          )}

          <button
            onClick={handleRegister}
            className="mt-[40px] w-[348.28px] h-[56.08px] bg-[#008080] rounded-[20px] text-white text-[15px] font-inter flex items-center justify-center shadow-lg px-[10px] cursor-pointer"
          >
            Register
          </button>

          {errors.apiError && (
            <div className="text-red-500 text-[15px] font-inter text-center mt-2 w-[348.28px]">
              {errors.apiError}
            </div>
          )}

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