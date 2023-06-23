
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateActivityInput {
    name: string;
    price: number;
    location: string;
    members: number;
    time: string;
    date: Date;
    travelId: number;
    categoryId: number;
}

export class UpdateActivityInput {
    name?: Nullable<string>;
    price?: Nullable<number>;
    location?: Nullable<string>;
    members?: Nullable<number>;
    time?: Nullable<string>;
    date?: Nullable<Date>;
    categoryId?: Nullable<number>;
}

export class SignUpInput {
    email: Email;
    password: Password;
    confirmPassword: string;
    firstname: string;
    lastname: string;
}

export class UpdateAccountInput {
    email?: Nullable<Email>;
    password?: Nullable<Password>;
    confirmPassword?: Nullable<string>;
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
}

export class SignInInput {
    email: Email;
    password: string;
}

export class CreateCategoryInput {
    name: string;
}

export class UpdateCategoryInput {
    name: string;
}

export class CreateTravelInput {
    title: string;
    from: string;
    to: string;
    departureDate: Date;
    arrivalDate: Date;
    budget: number;
    numberOfTravelers: number;
    organizerId: number;
}

export class UpdateTravelInput {
    title?: Nullable<string>;
    from?: Nullable<string>;
    to?: Nullable<string>;
    departureDate?: Nullable<Date>;
    arrivalDate?: Nullable<Date>;
    budget?: Nullable<number>;
    numberOfTravelers?: Nullable<number>;
}

export class CreateUserInput {
    email: Email;
    firstname: string;
    lastname: string;
    password: Password;
    confirmPassword: string;
}

export class UpdateUserInput {
    email?: Nullable<Email>;
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    password?: Nullable<Password>;
    confirmPassword?: Nullable<string>;
}

export class Activity {
    __typename?: 'Activity';
    id: number;
    name: string;
    price: number;
    location: string;
    members: number;
    time: Time;
    date: Date;
    travelId: number;
    categoryId: number;
    travel: Travel;
    category: Category;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract activitiesByDate(date: Date, id: number): Activity[] | Promise<Activity[]>;

    abstract me(): User | Promise<User>;

    abstract categories(): Nullable<Category>[] | Promise<Nullable<Category>[]>;

    abstract category(id: number): Nullable<Category> | Promise<Nullable<Category>>;

    abstract travels(): Nullable<Travel>[] | Promise<Nullable<Travel>[]>;

    abstract travel(id: number): Nullable<Travel> | Promise<Nullable<Travel>>;

    abstract travelBySlug(slug: string): Nullable<Travel> | Promise<Nullable<Travel>>;

    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract createActivity(createActivityInput: CreateActivityInput): Activity | Promise<Activity>;

    abstract updateActivity(id: number, updateActivityInput: UpdateActivityInput): Activity | Promise<Activity>;

    abstract removeActivity(id: number): boolean | Promise<boolean>;

    abstract signUp(signUpInput: SignUpInput): Auth | Promise<Auth>;

    abstract signIn(signInInput: SignInInput): Auth | Promise<Auth>;

    abstract updateAccount(updateAccountInput: UpdateUserInput): User | Promise<User>;

    abstract deleteAccount(): boolean | Promise<boolean>;

    abstract refreshToken(refreshToken: string): Token | Promise<Token>;

    abstract createCategory(createCategoryInput: CreateCategoryInput): Category | Promise<Category>;

    abstract updateCategory(id: number, updateCategoryInput: UpdateCategoryInput): Category | Promise<Category>;

    abstract removeCategory(id: number): boolean | Promise<boolean>;

    abstract createTravel(createTravelInput: CreateTravelInput): Travel | Promise<Travel>;

    abstract addTravelerToTravel(id: number, token: string): Travel | Promise<Travel>;

    abstract removeTravelerFromTravel(id: number, travelerId: number): boolean | Promise<boolean>;

    abstract updateTravel(id: number, updateTravelInput: UpdateTravelInput): Travel | Promise<Travel>;

    abstract removeTravel(id: number): boolean | Promise<boolean>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(id: number, updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: number): boolean | Promise<boolean>;
}

export class Auth {
    __typename?: 'Auth';
    user: User;
    token: Token;
}

export class Token {
    __typename?: 'Token';
    accessToken: string;
    refreshToken: string;
}

export class Category {
    __typename?: 'Category';
    id: number;
    name: string;
}

export class Travel {
    __typename?: 'Travel';
    id: number;
    title: string;
    slug: string;
    from: string;
    to: string;
    departureDate: Date;
    arrivalDate: Date;
    budget: number;
    numberOfTravelers: number;
    organizerId: number;
    organizer: Traveler;
    travelers: Traveler[];
    activities: Activity[];
    invitationLink?: Nullable<string>;
}

export class Traveler {
    __typename?: 'Traveler';
    id: number;
    firstname: string;
    lastname: string;
    email: string;
}

export class User {
    __typename?: 'User';
    id: number;
    email: Email;
    firstname: string;
    lastname: string;
    isBanned: boolean;
    role: Role;
    travels: Travel[];
}

export class Role {
    __typename?: 'Role';
    id: number;
    name: string;
}

export type Time = unknown;
export type Password = string;
export type Email = unknown;
type Nullable<T> = T | null;
