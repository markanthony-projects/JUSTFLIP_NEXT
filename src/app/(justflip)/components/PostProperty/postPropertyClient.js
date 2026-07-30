"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth.store";

import { useUserPropertyFormStore } from "@/src/stores/userPropertyForm.store";
import { useBrokerPropertyFormStore } from "@/src/stores/brokerPropertyForm.store";

import LoginModal from "@/src/components/organisms/LoginModal";
import { PostPropertyBanner } from "./postPropertyBanner";
import { PostPropertyForm } from "./postPropertyForm";
import { PostPropertyHeader } from "./postPropertyHeader";
import { PostPropertySelection } from "./postPropertySelection";
import { PostProperty } from "./postProperty";
import SimpleButton from "@/src/components/atoms/SimpleButton";
import FAQ from "../FAQ";
import { JUSTFLIP } from "@/src/lib/axios/api";
import { RiHome4Line, RiBuilding4Line, RiPriceTag3Line, RiHistoryLine, RiKey2Line, RiShieldCheckLine } from "react-icons/ri";
import { FiUser, FiTool } from "react-icons/fi";
import { FaRegHandshake } from "react-icons/fa";
import { toast } from "@/src/utils/toast";

const DEFAULT_FAQS = [
    {
        question: "Is listing a property on JustFlip free?",
        answer: "Yes, listing your property as an individual owner is completely free on JustFlip. Join thousands of owners selling today."
    },
    {
        question: "How long does it take for my property to go live?",
        answer: "Once submitted, our team reviews the listing for quality assurance. It usually takes 24-48 hours to appear on the platform."
    },
    {
        question: "What documents do I need to prepare?",
        answer: "While not mandatory for listing, having clear property photos, floor plans, and digital copies of Title Deeds helps build trust."
    },
    {
        question: "Can I list both residential and commercial properties?",
        answer: "Absolutely! You can list apartments, villas, plots, office spaces, and retail shops in just a few clicks."
    }
];

const PostPropertyClient = () => {
    const router = useRouter();
    // const user = useAuthStore((state) => state.user);
    const { user, isAuthenticated, authType } = useAuthStore();
    const setUserFormData = useUserPropertyFormStore((state) => state.setFormData)
    const setBrokerFormData = useBrokerPropertyFormStore((state) => state.setFormData)

    const [residenceType, setResidenceType] = useState('Residential');
    const [transactionType, setTransactionType] = useState('Sale');
    // const uploaderRole = authType === "broker" ? "Broker" : authType === "visitor" ? "User" : "";
    const [uploaderRole, setUploaderRole] = useState("");
    // console.log("uploaderRole:", uploaderRole); 
    // console.log(authType, "authType");
    // console.log("isAuthenticated:", isAuthenticated);
    
    useEffect(() => {
        if (!isAuthenticated) return;

        if (authType === "visitor") {
            setUploaderRole("User");
        } else if (authType === "broker") {
            setUploaderRole("Broker");
        } else if (authType === "developer") {
            setUploaderRole("Developer");
        }
    }, [isAuthenticated, authType]);

    useEffect(() => {
        const pending = sessionStorage.getItem("postPropertyData");

        if (!pending) return;

        const data = JSON.parse(pending);

        if (data.uploaderRole) {
            setUploaderRole(data.uploaderRole);
        }

        if (data.residenceType) {
            setResidenceType(data.residenceType);
        }

        if (data.transactionType) {
            setTransactionType(data.transactionType);
        }

    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        const pending = sessionStorage.getItem("postPropertyData");

        if (!pending) return;

        proceedToNextPage();

        sessionStorage.removeItem("postPropertyData");

    }, [isAuthenticated]);
    
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [faqs, setFaqs] = useState(DEFAULT_FAQS);

    const residenceOptions = [
        { label: "Residential", value: "Residential", icon: <RiHome4Line /> },
        { label: "Commercial", value: "Commercial", icon: <RiBuilding4Line /> },
    ];

    const transactionOptions = [
        { label: "Sale", value: "Sale", icon: <RiPriceTag3Line /> },
        { label: "Re-Sale", value: "Re-Sale", icon: <RiHistoryLine /> },
        { label: "Rent", value: "Rent", icon: <RiKey2Line /> }
    ];

    const roleOptions = [
        { label: "User", value: "User", icon: <FiUser /> },
        { label: "Broker", value: "Broker", icon: <FaRegHandshake /> },
        { label: "Developer", value: "Developer", icon: <FiTool /> }
    ];

    // const handleRoleChange = (role) => {
    //     setUploaderRole(role);
    // };

    const proceedToNextPage = () => {
        const activeId = useAuthStore.getState().user?.id
        const auth = useAuthStore.getState().authType

        if(uploaderRole === "User"){
            setUserFormData((prev) => ({
                ...prev,
                residenceType,
                type: transactionType,
                ownerId: activeId,
                uploadedBy: auth
            }))
            router.push("/post-property/publish-property")
        }

        else if(uploaderRole === "Broker"){
            setBrokerFormData((prev) => ({
                ...prev,
                residenceType,
                type: transactionType,
                brokerId: activeId
            }))
            router.push("/post-property/list-your-properties")
        }

        else if(uploaderRole === "Developer"){
            router.push("/contact-us")
        }
    }
    
    const handleStart = () => {
        if(!uploaderRole){
            toast.warn("Please Select Who You are.")
            return;
        }

        if(uploaderRole === "Developer"){
            router.push("/contact-us");
            return;
        }

        if(!isAuthenticated){
            sessionStorage.setItem(
                "postPropertyData",
                JSON.stringify({
                    uploaderRole,
                    residenceType,
                    transactionType
                })
            );

            sessionStorage.setItem(
                "loginType",
                uploaderRole === "Broker" ? "agent" : "user"
            )

            router.push("/login");
            return;
        }

        proceedToNextPage();
    }

    const handleLoginSuccess = () => {
        proceedToNextPage()
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await JUSTFLIP.get("/faq", { params: { associatedWith: 'project_faqs', approval: 'approved' } });
                const fetchedFaqs = response?.data?.faqs;
                if (fetchedFaqs && fetchedFaqs.length > 0) {
                    setFaqs(fetchedFaqs);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    
    return (
        <div className="min-h-screen">
            <PostProperty>
                <PostPropertyBanner />
                <PostPropertyForm>
                    <PostPropertyHeader title="Start Selling Your Property" subtitle="Join thousands of owners who list their property every day." />
                    <div className="space-y-8">
                        <PostPropertySelection
                            label="Residence Type"
                            options={residenceOptions}
                            value={residenceType}
                            onChange={(val) => {
                                setResidenceType(val);
                                setUserFormData((prev) => ({ ...prev, residenceType: val }));
                                setBrokerFormData((prev) => ({ ...prev, residenceType: val }));
                            }}
                        />

                        <PostPropertySelection
                            label="Transaction Type"
                            options={transactionOptions}
                            value={transactionType}
                            onChange={(val) => {
                                setTransactionType(val);
                                setUserFormData((prev) => ({ ...prev, type: val }));
                                setBrokerFormData((prev) => ({ ...prev, type: val }));
                            }}
                        />

                        <PostPropertySelection 
                            label="Who Are You?"
                            options={roleOptions.map((option) => ({
                                ...option,
                                disabled: isAuthenticated && option.value !== uploaderRole
                            }))}
                            value={uploaderRole}
                            onChange={(val) => {
                                if(!isAuthenticated) setUploaderRole(val)
                            }}
                        />

                        <div className="pt-2">
                            <SimpleButton label="Get Started" onClick={handleStart} iconStart={true} className="bg-[#032B5B] hover:bg-[#001D3D]" />

                            <div className="flex items-center justify-center gap-2 mt-5 text-slate-400">
                                <RiShieldCheckLine className="text-lg" />
                                <span className="text-[11px] font-bold tracking-wide">100% Secure & Private Listing</span>
                            </div>
                        </div>
                    </div>
                </PostPropertyForm>
            </PostProperty>

            <FAQ data={faqs} />

            <LoginModal isOpen={isLoginModalOpen} closeModal={() => setIsLoginModalOpen(false)} onSuccess={handleLoginSuccess} />
        </div>
    );
};

export default PostPropertyClient;
