import { HTMLAttributeAnchorTarget } from 'react';

export enum SpaceTypes {
  General = 'general',
  AFF = 'aff',
  Women = 'women_safe_space',
  Admin = 'admin',
  Community = 'community',
}

export class CustomLink {
  title: string;
  alt?: string;
  route: string;
  anchor?: boolean;
  space: SpaceTypes;
  target?: HTMLAttributeAnchorTarget;

  constructor(
    title: string,
    route: string,
    space = SpaceTypes.General,
    alt = '',
    anchor = false,
    target = '_self'
  ) {
    this.title = title;
    this.route = route;
    this.anchor = anchor;
    this.space = space;
    this.alt = alt;
    this.target = target;
  }
}
