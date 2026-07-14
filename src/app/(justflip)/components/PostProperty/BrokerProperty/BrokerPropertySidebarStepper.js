import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { IoCallOutline } from 'react-icons/io5';
import { FaWhatsapp, FaCheck, FaHome } from 'react-icons/fa';
import BannerImage from "@/public/assets/UploadPropBanner.png";
import Image from '@/src/components/atoms/Image';
import SimpleButton from '@/src/components/atoms/SimpleButton';

const steps = [
    { id: 1, title: 'Basic Details' },
    { id: 2, title: 'Property Details' },
    { id: 3, title: 'Other Details' },
    { id: 4, title: 'Files' },
];

const BrokerPropertySidebarStepper = ({ currentStep }) => {
    const router = useRouter();
    
    // Calculate progress percentage
    const progress = Math.round((currentStep / steps.length) * 100);

    const HandleCall = () => {
        window.location.href = "tel:+918431362126";
    }

    const handleWhatsApp = () => {
        const message = "Hi, I am facing an issue while uploading property. Please help me.";
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/918431362126?text=${encodedMessage}`, "_blank");
    };

    return (
        <div className="w-full lg:w-[320px] shrink-0 bg-white rounded-xl p-5 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.08)] hidden md:flex">
            {/* Stepper Section */}
            <div className="flex flex-col gap-5">
                {/* Title Section */}
                <div className="space-y-0.5 mt-1">
                    <h2 className="text-[20px] font-bold text-[#002B5B] tracking-tight flex items-center gap-2">
                        <FaHome className="text-2xl text-[#002B5B]" /> Post your property
                    </h2>
                    {/* <p className="text-[13px] font-medium text-slate-500">Sell or rent your property</p> */}
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-600 w-8 text-right">{progress}%</span>
                </div>

                {/* Stepper */}
                <div className="flex flex-col gap-0 mt-2">
                    {steps.map((step, index) => {
                        const isCompleted = step.id < currentStep;
                        const isCurrent = step.id === currentStep;
                        const isPending = step.id > currentStep;
                        const isLast = index === steps.length - 1;

                        return (
                            <div key={step.id} className="flex gap-3">
                                {/* Icon & Line Column */}
                                <div className="flex flex-col items-center">
                                    {/* Icon */}
                                    <div className="z-10 bg-white py-1">
                                        {isCompleted && (
                                            <div className="w-7 h-7 rounded-full bg-[#057748] flex items-center justify-center shadow-md shadow-[#057748]/20">
                                                <FaCheck className="text-white text-[10px]" />
                                            </div>
                                        )}
                                        {isCurrent && (
                                            <div className="w-7 h-7 rounded-full border-[2.5px] border-[#002B5B] p-[2.5px] flex items-center justify-center bg-white">
                                                <div className="w-full h-full rounded-full bg-[#002B5B]"></div>
                                            </div>
                                        )}
                                        {isPending && (
                                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center"></div>
                                        )}
                                    </div>
                                    {/* Vertical Line (only if not last) */}
                                    {!isLast && (
                                        <div className="flex-1 w-[2px] min-h-[20px] my-0.5 rounded-full overflow-hidden flex flex-col">
                                            <div className={`h-full ${isCompleted ? 'bg-[#057748]' : isCurrent ? 'bg-gradient-to-b from-[#002B5B] to-slate-100' : 'bg-slate-100'}`}></div>
                                        </div>
                                    )}
                                </div>

                                {/* Content Column */}
                                <div className={`pt-1 pb-4 flex flex-col ${isLast ? 'pb-1' : ''}`}>
                                    <h3 className={`text-[14px] font-bold ${isCurrent ? 'text-[#002B5B]' : 'text-slate-600'}`}>
                                        {step.title}
                                    </h3>
                                    
                                    <div className="mt-1">
                                        {isCompleted && (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e6f2eb] text-[#057748]">
                                                Completed
                                            </span>
                                        )}
                                        {isCurrent && (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e6eaef] text-[#002B5B]">
                                                In progress
                                            </span>
                                        )}
                                        {isPending && (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-400">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Need Help Section */}
            <div className="mt-0 pt-4 border-t border-slate-400 flex flex-col gap-4">
                {/* <div className='relative w-full aspect-[4/3] rounded-lg overflow-hidden' >
                    <Image src={BannerImage} alt="Upload Banner" wrapperClassName="h-full w-full" />
                </div> */}

                <div className="w-full text-wrap text-[11.5px] leading-relaxed font-medium text-slate-500 text-center">
                    Need help with the form? Feel free to call or message us on WhatsApp anytime!
                </div>
                
                <div className="flex flex-col gap-2 w-full text-[12px] font-bold text-white">
                    <SimpleButton
                        onClick={() => HandleCall()}
                        className="w-full h-[36px] bg-[#002B5B] rounded-lg flex items-center justify-center gap-2 px-3 hover:bg-[#001D3D]"
                        label={<span className="flex items-center gap-2">Call For Help <IoCallOutline className="text-sm" /></span>}
                    />
                    <SimpleButton
                        onClick={() => handleWhatsApp()}
                        className='w-full h-[36px] bg-[#057748] rounded-lg flex items-center justify-center gap-2 px-3 hover:bg-[#04633c]'
                        label={<span className="flex items-center gap-2">Whatsapp <FaWhatsapp className="text-sm" /></span>}
                    />
                </div>
            </div>
        </div>
    );
};

export default BrokerPropertySidebarStepper;
