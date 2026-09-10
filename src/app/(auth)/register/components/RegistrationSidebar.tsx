import Link from "next/link";
import Logo from "@/src/components/Logo/Logo";

export default function RegistrationSidebar() {
  const bannerData = [
    { id: 1, title: 'Seamless Listing', description: 'Easily list your property with our quick and simple process.' },
    { id: 2, title: 'High Visibility', description: 'Get maximum exposure to reach the right buyers fast.' },
    { id: 3, title: 'Dedicated Support', description: 'Count on our expert team for guidance at every step.' },
  ];

  return (
    <div className="hidden md:flex flex-col bg-primary relative overflow-hidden min-h-screen shadow-2xl">
      <div className="pt-10 px-10 relative z-10 flex flex-col flex-grow">
        <div>
          {/* Back to Home Button */}
          <div className="mb-8">
            <Link 
              href='/' 
              className="inline-flex items-center py-2 px-4 text-xs font-semibold text-white bg-blue-900/60 border border-blue-700/50 rounded-xl hover:bg-blue-900 transition-all duration-300 shadow-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 mr-2 transition-transform duration-300 group-hover:-translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Header Texts */}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
            Sign Up as <br />
            <span className="text-secondary">Broker</span>
          </h1>
          <p className="text-sm font-medium text-slate-200">
            Already registered? Please{" "}
            <Link href="/login" className="font-semibold text-white underline underline-offset-4 hover:text-secondary transition-colors">
              login
            </Link>
          </p>
        </div>

        {/* Feature List Banner Items */}
        <div className="mt-12 flex flex-col gap-6">
          {bannerData?.map(item => (
            <div 
              key={item.id} 
              className="flex gap-4 items-start p-4 rounded-2xl bg-[#002044] border border-blue-800/60 transition-all duration-300 hover:bg-[#001c3b] hover:translate-x-1"
            >
              <div className="bg-secondary shadow-md rounded-xl w-9 h-9 flex items-center justify-center font-bold text-slate-950 text-sm shrink-0 mt-3">
                {item.id}
              </div>
              <div>
                <p className="text-lg font-bold text-white mb-0.5 tracking-wide">{item.title}</p>
                <p className="text-xs font-normal text-slate-300 leading-relaxed max-w-[260px]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
