"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import AuthService from "@/src/services/AuthService";
import { useAuthStore } from "@/src/stores/auth.store";
import { HiPencilSquare } from "react-icons/hi2";
import { toast } from "@/src/utils/toast";

export default function LoginModal({ isOpen, closeModal, onSuccess }) {
    const visitorLogin = useAuthStore((s) => s.visitorLogin);
    const [email, setEmail] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [error, setError] = useState("");
    const [inputError, setInputError] = useState(false);
    const [otpError, setOtpError] = useState(false);

    const inputRefs = useRef([]);
    const joinedOtp = otp.join("");
    const resendOtpDisabled = resendTimer > 0;
    const resendOtpCountdown = resendTimer;
    const userData = { input: email };


    useEffect(() => {
        if (!showOtp) return;
        if (resendTimer === 0) return;

        const timer = setTimeout(() => {
            setResendTimer((p) => p - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendTimer, showOtp]);

    const handleSendOtp = async () => {
        if (!email) {
            setInputError(true);
            setError("Enter Email or Phone");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await AuthService.sendOtp(email);
            toast.success("otp sended Successfully")
            setShowOtp(true);
            setTimeout(() => {
                setShowForm(true);
            }, 50);
            setResendTimer(30);
        } catch {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (joinedOtp.length < 6) {
            setOtpError(true);
            setError("Enter valid OTP");
            return;
        }

        try {
            setLoading(true);
            setOtpError(false);
            const result = await visitorLogin({ email, otp: joinedOtp, });
            if (result?.success) {
                closeModal();
                onSuccess?.();
                toast.success("Login Successfully");
            } else {
                setError(result?.error || "Login failed");
                toast.warn("OTP incorrect");
            }
        } catch {
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(paste)) return;

        const arr = paste.split("");
        const newOtp = [...otp];
        arr.forEach((v, i) => { newOtp[i] = v; });
        setOtp(newOtp);
    };


    const handleChange = (e) => {
        const value = e.target.value;
        if (value.trim() !== "") {
            setInputError(false);
        }
        setEmail(value);
    };

    const handleResendOtp = async () => {
        if (resendOtpDisabled) return;

        try {
            setLoading(true);
            await AuthService.sendOtp(email);
            setResendTimer(30);
        } catch {
            setError("Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <div className="relative">
                <form onSubmit={handleLogin}>
                    <div className={`${showOtp ? 'hidden' : ' space-y-1'}`}>
                        <h2 className={`text-start text-2xl font-bold text-[#002B5B] `}>
                            Find Your Dream Home
                        </h2>

                        <p className={`text-sm font-bold mb-4 grid justify-start text-gray-600 `}>
                            Access saved searches and favorites
                        </p>
                        <div className={`mb-1`}>
                            <label className="block text-sm font-bold text-[#484747] mb-1">
                                Enter Phone Number
                            </label>

                            <input
                                type="text"
                                // name="input"
                                autoComplete="on"
                                onChange={handleChange}
                                value={email}
                                placeholder="Enter your phone number"
                                required
                                className={`w-full p-3 h-11.5 text-[#002B5B] text-xs outline-none bg-white border rounded-lg
                            ${inputError ? 'border-red-500' : 'border-gray-300'}`}
                            />

                            {inputError && (
                                <p className="text-red-500 text-sm ml-1 mt-1">
                                    Phone number is required
                                </p>
                            )}
                        </div>

                        <button
                            className={` bg-[#002B5B] text-white mt-4 h-10 py-1 w-full rounded-lg text-sm font-semibold transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2  focus:border-transparent`}
                            type="button"
                            onClick={handleSendOtp}
                        >
                            Get OTP
                        </button>
                    </div>




                    <div className={`w-60 md:w-full relative  ${!showOtp ? "pointer-events-none opacity-0" : "opacity-100 h-60"} `}                   >
                        <div className={`absolute left-0 w-full z-50 bottom-0 transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${showForm ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-95 opacity-0 pointer-events-none"}`}>
                            <h1 className='text-xl lg:text-2xl text-center text-[#002B5B] font-bold py-1'>
                                Confirm Your Phone Number
                            </h1>

                            <p className='text-center text-[9px] md:text-[10px]'>
                                Please enter the four digit verification code we sent to
                            </p>

                            <p
                                className='text-center flex justify-center text-[12px] cursor-pointer'
                                onClick={() => {
                                    setShowForm(false);
                                    setTimeout(() => {
                                        setShowOtp(false);
                                    }, 300);
                                    setOtp(["", "", "", "", "", ""]);
                                }}
                            >
                                <span className="font-semibold">{userData.input}</span>
                                <HiPencilSquare className='ml-1 h-4 w-4 text-[#002B5B]' />
                            </p>

                            <div className="flex justify-center gap-2 my-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        onKeyDown={(e) => handleBackspace(e, index)}
                                        onPaste={handlePaste}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        className={`w-10 h-10 border ${otpError ? "border-red-500" : "border-gray-400"
                                            } rounded-full text-center text-sm focus:outline-none bg-gray-300 focus:border-black focus:bg-white`}
                                    />
                                ))}
                            </div>

                            <button
                                className="bg-[#002B5B] text-white text-sm font-semibold mt-3 p-3 w-full rounded-lg transition-transform duration-300 hover:scale-105 focus:outline-none"
                                type="submit"
                            >
                                {loading ? "Logging in..." : "CONFIRM"}
                            </button>

                            <div className="pt-4 md:pt-6 flex justify-center">
                                <p className='font-medium text-[10px] md:text-[13px] pr-1'>
                                    Didn't get the Phone Number?
                                </p>

                                <button
                                    className={`text-[10px] md:text-[13px] text-[#002B5B] font-medium focus:outline-none hover:scale-105 ${resendOtpDisabled ? "cursor-not-allowed" : ""
                                        }`}
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendOtpDisabled}
                                >
                                    {resendOtpDisabled
                                        ? `Resend OTP (${resendOtpCountdown}s)`
                                        : "Resend OTP"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}