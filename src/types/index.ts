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
