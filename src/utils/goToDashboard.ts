import { routes } from '../routing';
import { IUserWithoutPassword } from '../types/users.types';
import { SpaceTypes } from './CustomLink';

const goToDashboard = (user: IUserWithoutPassword) => {
  if (user.space && typeof user.space !== 'string') {
    switch (user.space.title) {
      case SpaceTypes.AFF:
        return routes.Fellows.absolute;
      case SpaceTypes.Community:
        return routes.Community.absolute;
      case SpaceTypes.Women:
        return routes.WomenSafeSpace.absolute;

      default:
        return routes.Dashboard.absolute;
    }
  }
  return routes.Dashboard.absolute;
};

export default goToDashboard;
