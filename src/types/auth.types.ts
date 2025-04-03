import { IUser } from "./users.types";

export type IRegisterRequest = Omit<
  IUser,
  "id" | "isEmailVerified" | "role" | "isApproved"
>;

export type IUserWithoutPassword = Omit<IUser, "password">;

export interface ITokenPayload {
  token: string;
  exp: number;
  message: string;
}

export interface AccessAndRefreshTokens {
  access: ITokenPayload;
  refresh: ITokenPayload;
}

export interface ILoginResponse {
  user: IUserWithoutPassword;
  token: string;
  exp: number;
  message: string;
}

export interface IRegisterResponse {
  user: IUserWithoutPassword;
  token: string;
  exp: number;
  message: string;
}

export type ILoginRequest = Pick<IUser, "email" | "password">;

export type AuthState = {
  user: IUserWithoutPassword | null;
  token: ITokenPayload["token"] | null;
};

export interface ILogoutRequest {
  refreshToken: ITokenPayload["token"];
}

export interface IUserWithToken {
  user: IUserWithoutPassword;
  token: string;
  exp: number;
  message: string;
}

export interface IUserWithRefreshToken {
  user: IUserWithoutPassword;
  refreshedToken: string;
  exp: number;
  message: string;
}

export interface IRefreshTokenRequest {
  refreshToken: ITokenPayload["token"];
}

export type IForgotPasswordRequest = Pick<IUser, "email">;

export type IResetPasswordRequestBody = Pick<IUser, "password"> &
  Pick<ITokenPayload, "token">;

export type IResetPasswordRequestParams = Pick<ITokenPayload, "token">;

export interface IResetPasswordRequest {
  body: IResetPasswordRequestBody;
  params: IResetPasswordRequestParams;
}

export type IVerifyEmailRequestParams = Pick<ITokenPayload, "token">;
