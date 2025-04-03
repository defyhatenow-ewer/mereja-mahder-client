export enum SpaceTypes {
  General = "general",
  AFF = "aff",
  Partner = "partners",
  Women = "women_safe_space",
  Admin = "admin",
}

export class CustomLink {
  title: string;
  alt?: string;
  route: string;
  anchor?: boolean;
  space: SpaceTypes;

  constructor(
    title: string,
    route: string,
    space = SpaceTypes.General,
    alt = "",
    anchor = false
  ) {
    this.title = title;
    this.route = route;
    this.anchor = anchor;
    this.space = space;
    this.alt = alt;
  }
}
