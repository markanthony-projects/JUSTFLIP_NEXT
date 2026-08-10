"use client";

import Link from "next/link";
import Logo from "../components/Logo/Logo";
import { FaFacebook, FaInstagram, FaYoutube, FaSquareXTwitter, } from "react-icons/fa6";

const sections = [
    {
        title: "Justflip.in",
        links: [
            { label: "Our Services", url: "/" },
            { label: "Price Trends", url: "/price-trends" },
            { label: "Post Your Property", url: "/post-property" },
            { label: "Real Estate Investments", url: "/investments" },
            { label: "Builders in India", url: "/builders" },
            { label: "Area Converter", url: "/area-converter" },
            { label: "Customer Service", url: "/contact-us" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", url: "/about" },
            { label: "Contact Us", url: "/contact-us" },
            { label: "Careers", url: "/" },
            { label: "Terms & Conditions", url: "/terms-conditions" },
            { label: "Privacy Policy", url: "/privacy-policy" },
            { label: "Feedback", url: "/" },
            { label: "Report a Problem", url: "/" },
            { label: "Safety Guide", url: "/" },
        ],
    },
    {
        title: "Explore",
        links: [
            { label: "Blogs", url: "/blog" },
            { label: "Sitemap", url: "/sitemap.xml", target: "_blank" },
            { label: "Mortgage Calculator", url: "/#mortgage-calculator" },
        ],
    },
];

const socialLinks = [
    {
        icon: FaFacebook,
        url: "https://facebook.com",
        label: "Facebook",
    },
    {
        icon: FaInstagram,
        url: "https://instagram.com",
        label: "Instagram",
    },
    {
        icon: FaSquareXTwitter,
        url: "https://twitter.com",
        label: "Twitter",
    },
    {
        icon: FaYoutube,
        url: "https://youtube.com",
        label: "YouTube",
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const phoneNumber = "918431362126";
    const email = "support@justflip.in";

    const mailUrl = `mailto:${email}?subject=${encodeURIComponent(
        "Support Request"
    )}&body=${encodeURIComponent("Hello JustFlip Team,")}`;

    return (
        <footer className="bg-[#002B5B] text-gray-300 ">
            <div className="py-10 md:py-15 px-4  lg:px-6  max-w-[1240px] mx-auto overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[20%_20%_20%_40%] gap-6">

                    {/* Sections */}
                    {sections.map((section) => (
                        <nav key={section.title} aria-label={section.title}>

                            {section.title === "Justflip.in" ? (
                                <div className="mb-2">
                                    <Logo />
                                </div>
                            ) : (
                                <h3 className="text-white font-semibold text-lg mb-4">
                                    {section.title}
                                </h3>
                            )}

                            <ul className="space-y-3 text-sm">
                                {section.links.map((link) => {
                                    const isExternal = link.target === "_blank";

                                    return (
                                        <li key={link.label}>
                                            <Link
                                                href={link.url}
                                                target={isExternal ? "_blank" : "_self"}
                                                rel={isExternal ? "noopener noreferrer" : undefined}
                                                className="hover:text-white transition-colors duration-200"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    ))}

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-5">
                            Contact Us
                        </h3>

                        <div className="text-sm space-y-2">
                            <a
                                href={`tel:${phoneNumber}`}
                                className="text-white font-medium block"
                            >
                                Toll Free – +91 8431362126
                            </a>

                            <p className="text-gray-400">
                                9:30 AM to 6:30 PM (Mon–Sun)
                            </p>

                            <p>
                                Email:
                                <a
                                    href={mailUrl}
                                    className="text-blue-400 hover:text-blue-300 ml-1"
                                >
                                    {email}
                                </a>
                            </p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-5 text-xl mt-6">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                return (
                                    <a
                                        key={social.label}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="hover:scale-110 transition-transform duration-200"
                                    >
                                        <Icon />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Footer Bottom */}
                        <div className="mt-8 space-y-3 text-sm">
                            <p className="line-clamp-2 w-auto lg:w-80 lg:w-auto ">
                                All trademarks are the property of their respective owners.
                            </p>
                            <p>
                                © {currentYear} Justflip.in All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}