import { IUser } from "../types/users.types";

type Restrictions = {
  none: IUser["role"][];
  fellow: IUser["role"][];
  partner: IUser["role"][];
  partnerAndCurator: IUser["role"][];
  curator: IUser["role"][];
  admin: IUser["role"][];
};

const restrictions: Restrictions = {
  none: ["admin", "editor", "fellow", "partner", "curator", "basic"],
  fellow: ["fellow", "editor", "admin"],
  partner: ["partner", "editor", "admin"],
  partnerAndCurator: ["partner", "curator", "editor", "admin"],
  curator: ["curator", "editor", "admin"],
  admin: ["admin"],
};

export default restrictions;
