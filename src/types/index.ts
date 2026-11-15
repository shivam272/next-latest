import { Types } from "mongoose";

export type Meal = {
  id: number; // Unique numeric ID
  slug: string; // UUID for the slug
  name: string; // Name of the dish (country or food name)
  title: string; // Title or name of the dish
  description: string; // Food description
  summary: string; // Short summary (adjective)
  creator: string; // Creator's full name
  email: string; // Creator's email
  image: string; // URL of the food image
};

export type TNewsArticle = {
  id: string; // Unique string ID
  title: string; // Title of the news article
  date: string; // Publication date in YYYY-MM-DD format
  image: string; // URL of the news image
  source: string; // Source of the news article
  content: string; // Full content of the news article
  author: string; // Author of the news article
  category: string; // Category of the news article
};

export enum EGenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

export interface IFormInput {
  age: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: EGenderEnum;
  password: string;
  confirmPassword: string;
  terms: boolean;
  phone: string[];
  cities: {
    name: string;
  }[];
}

export interface IAccountInput {
  email: string;
  password: string;
  name: string;
}

export interface IRegistrationInput {
  email: string;
  name: string;
  barId: string;
  password: string;
}

export enum ETokenType {
  INVALID_TOKEN = "INVALID_TOKEN",
}

export interface IVenueInput {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  capacity: string;
  adhaarCard?: FileList; // Use FileList for react-hook-form
  amenities: {
    name: string;
  }[];
}

export interface IAdhaarCard {
  data: Buffer<ArrayBuffer>;
  filename: string;
  mimeType: string;
  uploadedAt: Date;
}

export interface IVenueServerInput extends Omit<IVenueInput, "adhaarCard"> {
  adhaarCard: IAdhaarCard[];
}

export interface IVenueRecords extends IVenueInput {
  id: string;
}

export interface IEventInput {
  name: string;
  description: string;
  date: string;
  time: string;
  organizer: string;
  artist: string;
  capacity: string;
  price: string;
  ageRestriction: string;
  duration: string;
  addOns: {
    name: string;
  }[];
}

export interface IEventRecords extends IEventInput {
  id: string;
  venueName: string;
  venueCity: string;
}

export interface IEventInputSchema extends IEventInput {
  venueId: Types.ObjectId;
}

export type TApiResponse<T> = {
  data?: T;
  success?: boolean;
  status: number;
  message: string;
};

export interface IEventPaginationResponse {
  events: IEventRecords[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IVenuePaginationResponse {
  venues: IVenueRecords[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ISignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  barId: string;
}

/** The three upload fields of a document profile. */
export enum EDocumentField {
  IMAGE = "image",
  ADHAAR = "adhaar",
  QUALIFICATION = "qualification",
}

/** A file stored in Vercel Blob: its public URL and size in bytes. */
export interface IStoredFile {
  path: string;
  size: number;
}

export interface IDocumentProfileInput {
  name: string;
  image: IStoredFile;
  adhaar: IStoredFile;
  qualification: IStoredFile[];
}

export interface IDocumentProfile extends IDocumentProfileInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** The form's values. Files are optional on edit, where the stored ones are kept. */
export interface IDocumentProfileFormValues {
  name: string;
  image?: FileList;
  adhaar?: FileList;
  qualification?: FileList;
  keptQualification: IStoredFile[];
}

export interface IActionResult<TData = undefined> {
  success: boolean;
  message: string;
  data?: TData;
}

export interface ICompleteProfileForm extends Pick<
  ISignUpForm,
  "name" | "email" | "barId"
> {
  userId: string;
  telephone: string;
  gender: EGenderEnum;
  age: string;
}
