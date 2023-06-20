export interface PropertyMetadata {
  permission: PermissionProperty;
  type: TypeProperty;
}

export interface TravelIdInterface {
  travelId: number;
  organizerId: number;
}

export enum TypeProperty {
  TRAVEL = 'Travel',
  ACTIVITY = 'Activity',
  PICTURE = 'Picture',
}

export enum PermissionProperty {
  TRAVELER = 'TRAVELER',
  ORGANIZER = 'ORGANIZER',
}
