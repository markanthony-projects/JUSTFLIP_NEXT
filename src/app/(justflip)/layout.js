import Header from "@/src/layout/Header/Header.server";

export default async function JustflipLayout({ children }) {
    return (
        <main>
            <Header />
            <div className={`flex-1 w-full mx-auto px-2 md:px-8 lg:px-24`}>
                {children}
            </div>
        </main>

    );
}