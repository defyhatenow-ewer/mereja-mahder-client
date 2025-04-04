import { Outlet } from "react-router-dom";
import { CustomToast } from "../../components";
import Footer from "./Footer";
import FrontNavbar from "./FrontNavbar";

const Main = () => {
  return (
    <>
      <CustomToast />
      <main className="min-h-screen flex flex-col justify-between items-start">
        <div className="fixed z-[99] top-0 left-0 w-full">
          <FrontNavbar />
        </div>
        <div className="w-full pt-20 md:pt-32">
          <Outlet />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Main;
