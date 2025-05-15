import { SignJWT } from "jose";
import Cookies from "js-cookie";
import { IUserWithoutPassword } from "../types/users.types";
import { config } from "../config";

const setLoginCookie = async (user: IUserWithoutPassword) => {
  const nodebbToken = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(config.env.jwtSecret));

  document.cookie = `${config.env.nodebbTokenName}=${nodebbToken}; domain=${config.env.domain}; HttpOnly;`;
  Cookies.set(config.env.nodebbTokenName, nodebbToken, {
    domain: config.env.domain,
    secure: true,
  });
};

export default setLoginCookie;
