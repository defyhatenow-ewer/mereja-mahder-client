import { z } from "zod";
import IQueryFilter from "./IQueryFilter";
import { ISpace } from "./space.types";
import { IMedia } from "./media.types";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["admin", "editor", "fellow", "partner", "curator", "basic"]),
  email: z.string().email(),
  password: z.string(),
  isEmailVerified: z.boolean(),
  isApproved: z.boolean(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  loginAttempts: z.number().min(0).optional(),
});

export type IUser = z.infer<typeof UserSchema> & {
  space?: ISpace | string;
  avatar?: IMedia;
};

// export interface IUser extends IDoc {
//   id: string;
//   name: string;
//   role: string;
//   email: string;
//   password: string;
//   isEmailVerified: boolean;
//   isApproved: boolean;
//   avatar?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   loginAttempts?: number;
// }

export type IUserWithoutPassword = Omit<IUser, "password">;

export type ICreateUserRequest = Omit<
  IUser,
  "id" | "isEmailVerified" | "isApproved"
>;

export type IUserFilterFields = Pick<IUser, "name" | "role">;

export type IGetUsersRequestParams = Partial<IUserFilterFields & IQueryFilter>;

export type IGetSingleUserRequest = Pick<IUser, "id">;

export type UserUpdateFields = Omit<IUser, "id" | "role" | "isEmailVerified">;

export interface IUpdateUserRequest {
  id: IUser["id"];
  body: Partial<UserUpdateFields>;
}

export type IDeleteUserRequest = Pick<IUser, "id">;
