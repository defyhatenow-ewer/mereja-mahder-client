import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { CustomToast, Loader } from "../../components";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { routes } from "../../routing";
import { useMeQuery, useRefreshTokenMutation } from "../../features/auth.api";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isFetching } = useMeQuery();
  const [refresh] = useRefreshTokenMutation();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const rememberMe = localStorage.getItem("rememberMe");
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
      const exp = sessionStorage.getItem("exp") || localStorage.getItem("exp");
      if (token && exp) {
        const timeUntilExpiry = Number(exp) * 1000 - Date.now();
        if (timeUntilExpiry < 600000) {
          refresh()
            .unwrap()
            .then((payload) => {
              if (rememberMe === "true") {
                localStorage.setItem("token", payload.refreshedToken);
                localStorage.setItem("exp", payload.exp.toString());
                localStorage.setItem("userId", payload.user.id);
              } else {
                sessionStorage.setItem("token", payload.refreshedToken);
                sessionStorage.setItem("exp", payload.exp.toString());
                sessionStorage.setItem("userId", payload.user.id);
              }
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

  if (isFetching) return <Loader />;

  if (!isFetching && !data) return <Navigate to={routes.Login.absolute} />;

  return (
    <main className="min-h-screen">
      <CustomToast />
      <div className="bg-white w-full min-h-screen flex flex-col gap-5 md:gap-10">
        <div className="fixed pt-5 w-full px-5 z-[999] bg-white md:ml-64 md:w-[100%-256px] md:pt-5 md:px-8">
          <Navbar />
        </div>
        <div className="pt-28 px-5 w-full z-0 bg-white mb-5 md:mb-8 md:pr-8 md:pl-[18rem] md:pt-24">
          <Outlet />
        </div>
        <div className="fixed w-64 h-screen z-[999] justify-between hidden md:flex">
          <Sidebar />
          <div className="w-[1px] bg-[#e2e2e2] h-full" />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
