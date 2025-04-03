import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "../components";
import { routes } from ".";
import { useMeQuery } from "../features/auth.api";

const Admin = () => {
  const { data, isFetching } = useMeQuery();

  if (isFetching) return <Loader />;

  if (!isFetching && !data) return <Navigate to={routes.Login.absolute} />;

  if (!data) return <Loader />;

  if (data.user.role !== "admin")
    return (
      <div className="text-black">
        Sorry you are not allowed to view this page
      </div>
    );
  return <Outlet />;
};

export default Admin;
