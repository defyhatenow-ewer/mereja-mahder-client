import { IUserWithoutPassword } from "../types/users.types";

const useCachedUser = (): { user: IUserWithoutPassword | null } => {
  const userString =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  let user: IUserWithoutPassword | null = null;
  if (userString) {
    user = JSON.parse(userString) as IUserWithoutPassword;
  }
  return { user };
};

export default useCachedUser;
