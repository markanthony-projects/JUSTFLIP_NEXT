export const HEADER_VARIANTS = {
    normal: {
        sticky: true,
        bg: "bg-[#002B5B]",
        showSearch: true,
        showProfile: true,
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
        navItems: [
            { href: "/post-property", label: "Post Your Property" },
            { href: "/login", label: "Login" },
        ],
    },
};
