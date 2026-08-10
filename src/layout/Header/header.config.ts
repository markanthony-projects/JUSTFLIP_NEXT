/**
 * Shared pill styling for every action in the header — mobile CTA, desktop nav,
 * mobile menu, city selector. Defined once so the set stays visually identical.
 *
 * 24px tall on mobile, 26px from `lg`: these sit inside a 60px bar alongside the
 * city selector, so they stay deliberately small.
 *
 * `HEADER_PILL_SKIN` is the look and size without any display/layout rules — for
 * elements that bring their own flex layout, such as the city selector's button.
 * `HEADER_PILL` adds the centring an ordinary link or button needs.
 */
export const HEADER_PILL_SKIN =
    "h-6 px-2.5 text-[11px] lg:h-[26px] lg:px-3 lg:text-xs " +
    "rounded-md border border-white/50 bg-white/10 backdrop-blur-sm " +
    "text-white font-semibold whitespace-nowrap " +
    "transition-colors duration-200 hover:bg-white/20 active:scale-[0.97]";

export const HEADER_PILL = `inline-flex items-center justify-center ${HEADER_PILL_SKIN}`;

export interface NavItem {
    href: string;
    label: string;
}

export interface HeaderVariantConfig {
    sticky: boolean;
    bg: string;
    showSearch: boolean;
    showProfile: boolean;
    mobileCta: NavItem | null;
    navItems: NavItem[];
}

export const HEADER_VARIANTS: Record<string, HeaderVariantConfig> = {
    normal: {
        sticky: true,
        bg: "bg-[#002B5B]",
        showSearch: true,
        showProfile: true,
        // No mobile CTA: below `lg` this header is the search bar edge to edge.
        mobileCta: null,
        navItems: [
            { href: "/post-property", label: "Post Your Property" },
            { href: "/login", label: "Login" },
        ],
    },

    incharge: {
        sticky: false,
        bg: "bg-transparent",
        showSearch: false,
        showProfile: false,
        // This header has no search bar, so the right side is free for a CTA.
        mobileCta: { href: "/post-property", label: "Post Property" },
        navItems: [
            { href: "/post-property", label: "Post Your Property" },
            { href: "/login", label: "Login" },
        ],
    },
};
