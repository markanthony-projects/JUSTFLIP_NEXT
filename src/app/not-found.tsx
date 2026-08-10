import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center" style={{ textAlign: "center", padding: "100px" }}>
            <div>
                <h1 style={{ fontSize: "48px" }}>404</h1>
                <p>This page does not exist.</p>
                <Link href="/">Go back home</Link>
            </div>
        </div>
    );
}