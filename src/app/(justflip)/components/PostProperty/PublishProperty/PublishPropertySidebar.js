import React from 'react';
import { IoCallOutline } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
import BannerImage from "@/public/assets/UploadPropBanner.png";
import Image from '@/src/components/atoms/Image';
import SimpleButton from '@/src/components/atoms/SimpleButton';


const PublishPropertySidebar = () => {
    const HandleCall = () => {
        window.location.href = "tel:+918431362126";
    }

    const handleWhatsApp = () => {
        const message = "Hi, I am facing an issue while uploading property. Please help me.";
        const encodedMessage = encodeURIComponent(message);

        window.open(
            `https://wa.me/918431362126?text=${encodedMessage}`,
            "_blank"
        );
    };

    return (
        <div className="h-max w-full md:w-[350px] lg:w-[400px] shadow-2xl shadow-slate-200 p-6 flex flex-col items-center gap-8 rounded-xl bg-white border border-gray-300">
            <div className='relative w-full aspect-[4/3] rounded-xl overflow-hidden' >
                <Image src={BannerImage} alt="Upload Banner" wrapperClassName="h-full w-full" />
            </div>

            <div className="w-full text-wrap text-xs/[15.6px] font-[500] text-[#585858]">
                Need help with the form?
                Feel free to call or message us on WhatsApp anytime—we’re here for you.
            </div>
            <div className="flex flex-wrap items-center gap-[12px] w-full text-xs md:text-[14px] font-[600] text-white">
                <SimpleButton
                    onClick={() => HandleCall()}
                    className="flex-1 h-[40px] bg-[#002B5B] rounded-[16px] flex items-center justify-center gap-[12px] px-[12px]"
                    label={<span className="flex items-center gap-2">Call For Help <IoCallOutline fontSize='18px' /></span>}
                />
                <SimpleButton
                    onClick={() => handleWhatsApp()}
                    className='flex-1 h-[40px] bg-[#057748] rounded-[16px] flex items-center justify-center gap-[12px] px-[12px] hover:bg-[#04633c]'
                    label={<span className="flex items-center gap-2">Whatsapp <FaWhatsapp fontSize='18px' /></span>}
                />
            </div>
        </div>
    );
};

export default PublishPropertySidebar;
