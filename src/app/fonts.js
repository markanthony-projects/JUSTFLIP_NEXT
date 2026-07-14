import localFont from "next/font/local";

export const firaSans = localFont({
    src: [
        {
            path: "../fonts/FiraSans-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/FiraSans-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../fonts/FiraSans-SemiBold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "../fonts/FiraSans-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],

    display: "swap",

    preload: true,

    fallback: [
        "system-ui",
        "sans-serif",
    ],
});