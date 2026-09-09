import Header from "@/src/layout/Header/Header.server";

export default async function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      {children}
    </main>
  );
}