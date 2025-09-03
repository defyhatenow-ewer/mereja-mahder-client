import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CustomToast } from '../../components';
import Footer from './Footer';
import FrontNavbar from './FrontNavbar';

const Main = () => {
  return (
    <>
      <Helmet>
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <CustomToast />
      <main className="min-h-screen flex flex-col justify-between items-start">
        <div className="fixed z-[99] top-0 left-0 w-full">
          <FrontNavbar />
        </div>
        <div className="w-full absolute top-20 md:top-28 mdl:top-36 nav:top-28">
          <Outlet />
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Main;
