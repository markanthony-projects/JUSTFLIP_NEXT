"use client";

import { useRouter } from "next/navigation";

export default function SuccessModal({ isOpen }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
        <p className="text-gray-500 mb-8">
          Your broker account has been successfully created. Welcome aboard!
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="w-full bg-[#0B8019] text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition shadow-lg shadow-green-200"
        >
          Go to My Profile
        </button>
      </div>
    </div>
  );
}
