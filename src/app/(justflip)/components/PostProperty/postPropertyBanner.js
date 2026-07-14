import img from "@/public/post.png";
import Image from "next/image";
import { RiSpeedUpLine, RiEyeLine } from "react-icons/ri";

export const PostPropertyBanner = () => (
    <div className="md:col-span-3 hidden lg:flex relative rounded-2xl overflow-hidden h-full min-h-[650px] shadow-lg">
        <Image
            src={img} 
            alt="Post Property Information" 
            fill
            className="object-cover"
            loading="eager"
            fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70"></div>
        
        <div className="absolute inset-0 p-12 flex flex-col justify-center text-white z-10">
            <h1 className="text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight">
                List Your Property with<br/>Confidence.
            </h1>
            <p className="text-[17px] mb-12 max-w-[420px] font-medium text-white/95 leading-relaxed">
                Experience the gold standard of real estate listing with Luxe Realty's bespoke advisory and global reach.
            </p>
            
            <div className="space-y-5 max-w-[420px]">
                {/* Card 1 */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
                        <RiSpeedUpLine className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white mb-0.5">Seamless Listing</h3>
                        <p className="text-[14px] text-white/80">Quick and simple guided process.</p>
                    </div>
                </div>
                
                {/* Card 2 */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
                        <RiEyeLine className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white mb-0.5">High Visibility</h3>
                        <p className="text-[14px] text-white/80">Access to our elite global network.</p>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
                        <RiEyeLine className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white mb-0.5">Dedicated Support</h3>
                        <p className="text-[14px] text-white/80">Our team is always ready to assist you.</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
);