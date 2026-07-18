//this component renders a breadcrumb navigation bar.  It takes an array of items, each with a label and optional href, and renders them as links or text.  The color and z-index can be customized via props.

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { buildBreadcrumbSchema } from "@/src/utils/schema";

export default function Breadcrumb({ items = [], color = "#002B5B", zTop = false }) {
    const router = useRouter();

    const schemaItems = [{ label: "Home", href: "/" }, ...items];
    const breadcrumbSchema = buildBreadcrumbSchema(schemaItems);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <nav className={`py-2 text-sm w-full overflow-hidden  ${zTop ? "text-white absolute top-1 z-30" : ""}`}>
            <ol className={`flex w-full text-xs items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hidden text-[${color}] ${zTop ? "flex-1 px-2 md:px-4 py-1 w-full  mx-auto md:max-w-[1440px]" : ""}`}>
                <li className="flex items-center shrink-0">
                    <Link href="/" className="hover:underline" style={{ color }}>Home</Link>
                </li>

                {items?.map((item, index) => (
                    <li key={index} className="flex items-center gap-1 shrink-0">
                        <MdOutlineKeyboardArrowRight />

                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:underline whitespace-nowrap"
                                style={{ color }}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-bold whitespace-nowrap" style={{ color }}>
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
        </>
    );
}