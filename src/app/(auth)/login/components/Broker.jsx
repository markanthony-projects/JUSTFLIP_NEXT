"use client";

import { TextField } from "@/src/components/Inputs";
import AuthService from "@/src/services/AuthService";
import { useAuthStore } from "@/src/stores/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Broker = () => {
    const router = useRouter();
    const { brokerLogin } = useAuthStore();

    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Both email and password are required");
            return;
        }

        try {
            setLoading(true);
            const res = await brokerLogin({ email, password });
            if (res.success) {
                toast.success("Welcome back!");
                router.replace("/");
            } else {
                setError(res.error || "Invalid email or password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        if (e) e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address first");
            return;
        }

        try {
            setLoading(true);
            await AuthService.forgotBrokerPassword({ email });
            toast.success("Reset link sent to your email!");
            setMode("login");
        } catch (err) {
            setError(err?.message || "Could not process request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={mode === "login" ? handleLogin : handleForgotPassword} className="w-full flex flex-col space-y-2" >
            <TextField
                label="Email Address"
                required
                type="email"
                placeholder="broker@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={mode === "forgot" && error}
            />

            {mode === "login" && (
                <TextField
                    label="Password"
                    required
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={error}
                />
            )}

            <div className="flex items-center justify-between text-[11px]">
                {mode === "login" ? (
                    <>
                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="text-gray-500 hover:text-[#002b5b] transition underline underline-offset-2"
                        >
                            Create an account
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setMode("forgot");
                                setError("");
                            }}
                            className="text-[#002b5b] font-medium hover:underline transition"
                        >
                            Forgot Password?
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setMode("login");
                            setError("");
                        }}
                        className="text-gray-500 hover:text-[#002b5b] transition font-medium"
                    >
                        ← Back to Login
                    </button>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-[#002b5b] text-white text-sm font-semibold 
                           transition-all hover:bg-[#003b7b] disabled:opacity-50 active:scale-[0.98]"
            >
                {loading ? "Processing..." : mode === "login" ? "Login" : "Send Reset Link"}
            </button>

            {mode === "login" && (
                <p className="text-[10px] text-gray-400 text-center">
                    Agent access is reserved for registered partners.
                </p>
            )}
        </form>
    );
};

export default Broker;

