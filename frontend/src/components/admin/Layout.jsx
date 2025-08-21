import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="bg-pale-yellow text-deep-green min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto my-4 px-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
