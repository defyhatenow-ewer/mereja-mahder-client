import { IUser } from '../types/users.types';

type Restrictions = {
  none: IUser['role'][];
  fellow: IUser['role'][];
  community: IUser['role'][];
  communityAndCurator: IUser['role'][];
  curator: IUser['role'][];
  admin: IUser['role'][];
};

const restrictions: Restrictions = {
  none: ['admin', 'editor', 'fellow', 'community', 'curator', 'basic'],
  fellow: ['fellow', 'editor', 'admin', 'basic'],
  community: ['community', 'editor', 'admin', 'basic', 'partner'],
  communityAndCurator: ['community', 'curator', 'editor', 'admin', 'basic'],
  curator: ['curator', 'editor', 'admin', 'basic'],
  admin: ['admin'],
};

export default restrictions;
