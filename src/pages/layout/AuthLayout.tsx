import { Link, Outlet, useLocation } from "react-router-dom";
import { CustomToast } from "../../components";
import { amharicText, logo } from "../../assets/images";
import { routes } from "../../routing";
import { translate } from "../../i18n";

const AuthLayout = () => {
  const location = useLocation();

  const setPageTitle = (): Promise<string> | string => {
    switch (location.pathname) {
      case routes.Login.absolute:
        return translate("login");
      case routes.Register.absolute:
        return translate("register");
      case routes.ForgotPassword.absolute:
        return `${translate("forgotPassword")}?`;
      case routes.ResetPassword.absolute:
        return translate("resetPassword");
      default:
        return translate("login");
    }
  };

  return (
    <>
      <CustomToast />
      <main className="min-h-screen flex flex-col justify-between items-start bg-white md:h-screen md:flex-row">
        <div className="hidden flex-col flex-grow justify-start gap-5 relative bg-white h-[calc(100%-96px)] w-full ml-8 mt-24 md:flex md:w-1/2">
          <div className="flex flex-col justify-center gap-5 p-5 bg-primary h-[calc(100%-192px)] rounded-bl-4xl rounded-t-4xl bg-[url('/src/assets/images/white_stripe.png')] bg-no-repeat bg-center bg-[length:auto_70%] md:p-12 md:ps-16 md:gap-8">
            <h1>{setPageTitle()}</h1>
            <h2 className="font-poppins-semi-bold">Mereja Mahder</h2>
            <img
              src={amharicText}
              className="bg-secondary rounded-full px-12 py-3 w-4/10"
            />
          </div>
          <div className="absolute bottom-0 left-0 bg-primary h-48 w-full"></div>
          <div className="absolute bottom-0 left-0 z-99 bg-white h-48 rounded-tr-4xl w-8/10"></div>
          <div className="absolute bottom-0 left-0 z-999 bg-primary h-32 -ml-8 rounded-tr-4xl w-2/5"></div>
        </div>

        <div className="hidden flex-col relative justify-center items-center w-full h-full md:flex md:w-1/2">
          <div className="absolute top-0 right-0 bg-primary h-40 rounded-bl-4xl w-1/8"></div>
          <div className="flex bg-primary mt-12 h-[calc(100%-112px)] w-full">
            <div className="flex flex-col justify-center items-center gap-5 bg-white h-full w-full rounded-bl-4xl md:gap-8">
              <div className="w-full max-w-sm">
                <Link to={routes.Home.absolute} className="cursor-pointer">
                  <img src={logo} className="h-12 md:h-14 2xl:h-16" />
                </Link>
              </div>

              <Outlet />
            </div>
          </div>
          <div className="flex flex-grow w-full">
            <div className="bg-primary w-9/10 rounded-tr-4xl"></div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex flex-col justify-between items-center gap-5 p-3 bg-white h-screen w-screen md:hidden">
          <div className="flex flex-col h-full justify-center items-center p-6 gap-5 bg-primary rounded-3xl">
            <div className="flex flex-col justify-center items-center gap-8 bg-[url('/src/assets/images/white_stripe.png')] bg-no-repeat bg-center bg-[length:auto_100%]">
              <h1 className="text-center">{setPageTitle()}</h1>
              <img src={logo} className="w-1/2" />
            </div>
            <div className="bg-white rounded-3xl p-5">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
