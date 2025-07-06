import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import ScrollToTop from "./components/helper/scroll-to-top";
import Navbar from "./components/navbar";
import Model3D from "./components/3d-model/Model3D";
import GlobalParticleCanvas from "./components/3d-model/GlobalParticleCanvas";
import "./css/card.scss";
import "./css/globals.scss";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Portfolio of Nguyen Anh Duyet - Software Developer",
  description:
    "This is the portfolio of Nguyen Anh Duyet. I am a full stack developer and a self taught developer. I love to learn new things.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
          <Navbar />
          {children}
          <ScrollToTop />
          
          {/* Mô hình 3D hiển thị ở góc phải phía dưới */}
          <div className="fixed bottom-8 right-8 w-64 h-64 md:w-80 md:h-80 z-50">
            <Model3D 
              className="w-full h-full"
            />
          </div>
          
        
          <div className="fixed inset-0 w-full h-full z-10 pointer-events-none">
            <GlobalParticleCanvas count={300} />
          </div>
        </main>
        <Footer />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
    </html>
  );
}
