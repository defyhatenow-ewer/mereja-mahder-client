import { ReactNode } from "react";
import { IUser } from "../types/users.types";
import { useMeQuery } from "../features/auth.api";
import { Navigate } from "react-router-dom";
import routes from "./routes";
import { Loader } from "../components";

type Props = {
  restrictedTo?: IUser["role"][];
  children: ReactNode;
};

const ProtectedRoute = ({ restrictedTo, children }: Props) => {
  const { data, isFetching } = useMeQuery();
  if (!restrictedTo) return children;
  if (isFetching) return <Loader />;
  if (!isFetching && !data) return <Navigate to={routes.Login.absolute} />;

  if (
    !isFetching &&
    data !== undefined &&
    !restrictedTo.includes(data.user.role)
  ) {
    return <Navigate to={routes.DashboardForbidden.absolute} />;
  }
  return children;
};

export default ProtectedRoute;
