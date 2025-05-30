import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { CustomToast, Loader } from "../../components";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { routes } from "../../routing";
import { useMeQuery, useRefreshTokenMutation } from "../../features/auth.api";
import { useEffect } from "react";
import DashboardFooter from "./DashboardFooter";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useMeQuery();
  const [refresh] = useRefreshTokenMutation();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = Cookies.get("token");
      const exp = Cookies.get("exp");
      if (token && exp) {
        const timeUntilExpiry = Number(exp) * 1000 - Date.now();
        if (timeUntilExpiry < 600000) {
          refresh()
            .unwrap()
            .then((payload) => {
              Cookies.set("token", payload.refreshedToken, {
                expires: 1 / 12,
              });
              Cookies.set("exp", payload.exp.toString());
            })
            .catch(() => {
              navigate(routes.Login.absolute);
            });
        }
      } else {
        navigate(routes.Login.absolute);
      }
    };

    checkAndRefreshToken();
  }, [navigate, refresh]);

  if (isLoading) return <Loader />;

  if (!isLoading && !data) return <Navigate to={routes.Login.absolute} />;

  return (
    <main className="min-h-screen">
      <CustomToast />
      <div className="bg-white w-full min-h-screen flex flex-col relative gap-5 md:gap-10">
        <div className="fixed top-0 left-0 pt-5 w-full px-5 z-[999] bg-white md:left-64 md:w-[calc(100%-256px)] md:pt-5 md:px-8">
          <Navbar />
        </div>
        <div className="absolute top-20 left-0 px-5 w-full z-0 bg-white pb-16 md:w-[calc(100%-256px)] md:px-8 md:pb-20 md:left-64 md:top-24">
          <Outlet />
        </div>
        <div className="fixed top-0 left-0 w-64 h-screen z-[999] justify-between hidden md:flex">
          <Sidebar />
          <div className="w-[1px] bg-[#e2e2e2] h-full" />
        </div>
        <footer className="fixed bottom-0 left-0 flex flex-col justify-between w-full px-5 z-[999] bg-white md:flex-row md:left-64 md:w-[calc(100%-256px)] md:px-8">
          <DashboardFooter />
        </footer>
      </div>
    </main>
  );
};

export default Dashboard;
