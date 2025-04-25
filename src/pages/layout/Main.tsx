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
        <div className="w-full absolute top-20 md:top-28">
          <Outlet />
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Main;
