import db, { insertMeal } from "../../initdb";
import { faker } from "@faker-js/faker";

export const insertMeals = async () => {
  await new Promise((res) => {
    setTimeout(() => {
      res(23);
    }, 1000);
  });

  insertMeal.run({
    slug: faker.string.uuid(),
    title: faker.food.dish(),
    image: faker.image.urlLoremFlickr({ category: "food" }),
    summary: faker.food.adjective(),
    description: faker.food.description(),
    name: faker.food.ethnicCategory(),
    creator: faker.person.fullName(),
    creatorEmail: faker.internet.email(),
  });
};

export const fetchMeals = async (): Promise<any[]> => {
  await new Promise((res) => {
    setTimeout(() => {
      res(23);
    }, 1000);
  });
  // run is used for post & all is used with fetch data & single row get
  //   db.prepare("DELETE FROM meals WHERE id = 1").run();

  //   insertMeals();
  return db.prepare("SELECT * FROM meals").all();
};
