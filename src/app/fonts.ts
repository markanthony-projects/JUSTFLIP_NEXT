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

    declarations: [
        {
            prop: "unicode-range",
            value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
        }
    ],

    preload: true,

    fallback: [
        "system-ui",
        "sans-serif",
    ],
});