import { Navigate } from "react-router-dom";
import { useMeQuery } from "../../features/auth.api";
import { Loader } from "../../components";
import { routes } from "../../routing";
import ProtectedRoute from "../../routing/ProtectedRoute";
import restrictions from "../../routing/restrictions";
import { PartnerOverview } from "../partners";
import { FellowsOverview } from "../fellows";
import { WomenOverview } from "../womenSafeSpaces";
import { SpaceTypes } from "../../utils";
import { Profile } from "../auth";

const Overview = () => {
  const { data, isFetching } = useMeQuery();

  if (isFetching) return <Loader />;

  if (!isFetching && !data) return <Navigate to={routes.Login.absolute} />;

  if (
    data?.user.role === "admin" ||
    data?.user.role === "partner" ||
    (data?.user.space &&
      typeof data?.user.space !== "string" &&
      data.user.space.title === SpaceTypes.Partner)
  ) {
    return (
      <ProtectedRoute
        children={<PartnerOverview />}
        restrictedTo={restrictions.partner}
      />
    );
  }

  if (
    data?.user.role === "fellow" ||
    (data?.user.space &&
      typeof data?.user.space !== "string" &&
      data.user.space.title === SpaceTypes.AFF)
  ) {
    return (
      <ProtectedRoute
        children={<FellowsOverview />}
        restrictedTo={restrictions.fellow}
      />
    );
  }

  if (
    data?.user.role === "curator" ||
    (data?.user.space &&
      typeof data?.user.space !== "string" &&
      data.user.space.title === SpaceTypes.Women)
  ) {
    return (
      <ProtectedRoute
        children={<WomenOverview />}
        restrictedTo={restrictions.curator}
      />
    );
  }
  return <Profile />;
};

export default Overview;
