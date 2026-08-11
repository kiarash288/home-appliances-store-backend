import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import CartSidebar from "@/components/shop/CartSidebar";

export default function ShopLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
