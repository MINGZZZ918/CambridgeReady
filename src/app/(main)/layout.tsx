import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExpiryBanner from "@/components/membership/ExpiryBanner";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-20">
        <ExpiryBanner />
        <main className="min-h-screen">{children}</main>
      </div>
      <Footer />
    </>
  );
}
