import Header from "@/src/layout/Header/Header.server";

export default async function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className={`flex-1  w-full  `}>
        {children}
      </main>
    </>

  );
}