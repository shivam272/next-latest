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
