import { useMeQuery } from "../features/auth.api";
import { IUserWithToken } from "../types/auth.types";

const useCurrentUser = (): [IUserWithToken | undefined, boolean, boolean] => {
  const { data, isLoading, isFetching } = useMeQuery();

  return [data, isFetching, isLoading];
};

export default useCurrentUser;
