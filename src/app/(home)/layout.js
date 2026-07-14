import Header from "@/src/layout/Header/Header.server";

export default function HomeLayout({ children }) {

    return (
        <div> 
        <Header />
            {children}
        </div>
    );
}