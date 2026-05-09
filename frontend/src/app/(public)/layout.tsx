import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/ui/BottomNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <Header />
      <Navigation />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
