"use client";

import { useState } from "react";
import User from "./User";
import Broker from "./Broker";

export default function LoginTabs() {
    const [loginType, setLoginType] = useState("user");

    return (
        <>
            <div className="relative flex p-1 bg-gray-100 rounded-2xl mb-4 border border-gray-200 overflow-hidden">
                <div
                    className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
                        loginType === "user" ? "translate-x-0" : "translate-x-full"
                    }`}
                    style={{ background: "linear-gradient(135deg, #002b5b, #00509e, #00a8ff)" }}
                />

                <button
                    onClick={() => setLoginType("user")}
                    className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                        loginType === "user" ? "text-white scale-105" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Buyer / Owner
                </button>

                <button
                    onClick={() => setLoginType("agent")}
                    className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                        loginType === "agent" ? "text-white scale-105" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Agent / Broker
                </button>
            </div>

            <div className="min-h-[120px]">
                {loginType === "user" ? (
                    <div key="user-form" className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <User />
                    </div>
                ) : (
                    <div key="agent-form" className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <Broker />
                    </div>
                )}
            </div>
        </>
    );
}
