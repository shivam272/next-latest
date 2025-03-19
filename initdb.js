import Database from "better-sqlite3";

// Create or open a database
const db = new Database("meals.db", { verbose: console.log });

// Create a table and run the table
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        image TEXT NOT NULL,
        summary TEXT NOT NULL,
        description TEXT NOT NULL,
        name TEXT NOT NULL,
        creator TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )
`
).run();

// Insert a meal

export const insertMeal = db.prepare(`
    INSERT INTO meals (slug, title, image, summary, description, name, creator, email)
    VALUES (@slug, @title, @image, @summary, @description, @name, @creator, @creatorEmail)
`);

// insertMeal.run({
//   slug: "meal-slug",
//   title: "Meal Title",
//   image: "meal-image.jpg",
//   summary: "Meal Summary",
//   description: "Meal Description",
//   name: "Meal Name",
//   creator: "Meal Creator",
//   creatorEmail: "creator@example.com",
// });

export default db;
