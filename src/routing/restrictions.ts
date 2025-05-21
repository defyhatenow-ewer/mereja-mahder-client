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
  fellow: ["fellow", "editor", "admin", "basic"],
  partner: ["partner", "editor", "admin", "basic"],
  partnerAndCurator: ["partner", "curator", "editor", "admin", "basic"],
  curator: ["curator", "editor", "admin", "basic"],
  admin: ["admin"],
};

export default restrictions;
