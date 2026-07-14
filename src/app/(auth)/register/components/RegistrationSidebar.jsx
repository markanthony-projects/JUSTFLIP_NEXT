import Link from "next/link";
import Logo from "@/src/components/Logo/Logo";

export default function RegistrationSidebar() {
  const bannerData = [
    { id: 1, title: 'Seamless Listing', description: 'Easily list your property with our quick and simple process.' },
    { id: 2, title: 'High Visibility', description: 'Get maximum exposure to reach the right buyers fast.' },
    { id: 3, title: 'Dedicated Support', description: 'Count on our expert team for guidance at every step.' },
  ];

  return (
    <div className="hidden md:flex flex-col bg-[#002B5B] relative overflow-hidden h-full">
      {/* Soft radial gradient at top right */}
      <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl mix-blend-screen pointer-events-none" />
      
      <div className="pt-10 px-10 relative z-10 flex flex-col flex-grow">
        <div>
          <div className="mb-8">
            <Link href='/' className="inline-flex items-center py-2 px-4 font-semibold text-white border border-white/20 rounded-md hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Go Back Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Sign Up as<br />Broker</h1>
          <p className="text-sm font-medium text-gray-300">
            Already registered? Please{" "}
            <Link href="/login" className="text-white underline hover:text-gray-200">
              login
            </Link>{" "}
            here.
          </p>            
        </div>

        <div className="mt-16 flex flex-col gap-8">
          {bannerData?.map(item => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="bg-white rounded-full min-w-[28px] h-7 flex items-center justify-center font-bold text-[#0B2046] text-sm mt-0.5">
                {item.id}
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{item.title}</p>
                <p className="text-md font-medium text-gray-400 leading-relaxed max-w-[200px]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto mb-10 pb-4">
          <Logo className="w-32 h-auto" />
        </div>
      </div>
    </div>
  );
}
