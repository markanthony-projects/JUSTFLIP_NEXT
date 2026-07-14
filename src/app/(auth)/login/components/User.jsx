"use client";

import { TextField } from "@/src/components/Inputs";
import AuthService from "@/src/services/AuthService";
import { useAuthStore } from "@/src/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePencilAlt } from "react-icons/hi";

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

const User = () => {
    const router = useRouter();
    const { visitorLogin } = useAuthStore();

    const [step, setStep] = useState("input");
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [timer, setTimer] = useState(RESEND_TIME);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);
    const timerRef = useRef(null);

    const startResendTimer = () => {
        setCanResend(false);
        setTimer(RESEND_TIME);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const sendOtp = async () => {
        setError("");
        if (!identifier) {
            setError("Email or Phone is required");
            return;
        }

        try {
            setLoading(true);
            await AuthService.sendOtp(identifier);
            toast.success("OTP sent successfully!");
            setStep("otp");
            setOtp(Array(OTP_LENGTH).fill(""));
            startResendTimer();
        } catch (err) {
            setError(err?.message || "Failed to send OTP.");
            toast.error(err?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setError("");
        const otpValue = otp.join("");

        if (otpValue.length !== OTP_LENGTH) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            const res = await visitorLogin({ email: identifier, otp: otpValue });
            if (res.success) {
                toast.success("Login successful!");
                router.replace("/");
            } else {
                setError(res.error || "Invalid OTP");
            }
        } catch (err) {
            setError("Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const paste = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
        if (!/^\d+$/.test(paste)) return;
        const newOtp = paste.split("");
        setOtp([...newOtp, ...Array(OTP_LENGTH - newOtp.length).fill("")]);
        inputRefs.current[Math.min(paste.length, OTP_LENGTH - 1)]?.focus();
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {step === "input" ? (
                <div className="flex flex-col gap-4">
                    <TextField
                        label="Enter Phone Number or Email"
                        placeholder="Mobile number or email address"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        error={error}
                        required
                    />
                    <button
                        onClick={sendOtp}
                        disabled={loading || !identifier}
                        className="h-11 rounded-lg bg-[#002b5b] text-white text-sm font-semibold transition-all hover:bg-[#003b7b] disabled:opacity-50 active:scale-[0.98]"
                    >
                        {loading ? "Sending OTP..." : "Get Started"}
                    </button>
                    <p className="text-[10px] text-gray-500 text-center px-4">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-1">
                        <h3 className="text-xl font-bold text-[#002b5b]">Verify Identity</h3>
                        <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                            Code sent to <span className="font-semibold">{identifier}</span>
                            <button
                                onClick={() => setStep("input")}
                                className="text-blue-600 hover:text-blue-800 transition"
                            >
                                <HiOutlinePencilAlt size={16} />
                            </button>
                        </p>
                    </div>

                    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                maxLength={1}
                                inputMode="numeric"
                                className="h-12 w-10 md:h-12 md:w-12 text-center text-lg font-bold
                                           rounded-lg border border-gray-200 outline-none
                                           focus:border-[#002b5b] focus:ring-2 focus:ring-[#002b5b]/10 
                                           transition-all bg-gray-50 focus:bg-white"
                            />
                        ))}
                    </div>

                    {error && <p className="text-center text-xs font-medium text-red-500">{error}</p>}

                    <div className="space-y-4">
                        <button
                            onClick={handleVerify}
                            disabled={loading || otp.join("").length !== OTP_LENGTH}
                            className="w-full h-11 rounded-lg bg-[#002b5b] text-white text-sm font-semibold 
                                       transition-all hover:bg-[#003b7b] disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? "Verifying..." : "Verify & Log In"}
                        </button>

                        <div className="text-center text-sm">
                            {!canResend ? (
                                <p className="text-gray-500 text-xs">
                                    Resend code in <span className="font-bold text-[#002b5b]">{timer}s</span>
                                </p>
                            ) : (
                                <button
                                    onClick={sendOtp}
                                    className="text-[#002b5b] text-xs font-bold hover:underline transition"
                                >
                                    Didn't receive the code? Resend OTP
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;

