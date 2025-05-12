import { SignJWT } from "jose";
import { IUserWithoutPassword } from "../types/users.types";
import { config } from "../config";

const setLoginCookie = async (user: IUserWithoutPassword) => {
  const nodebbToken = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(config.env.jwtSecret));

  document.cookie = `nodebb-token=${nodebbToken}; domain=${config.env.domain}; HttpOnly;`;
};

export default setLoginCookie;
