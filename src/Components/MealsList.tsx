import React from "react";
import { fetchMeals, insertMeals } from "@/utils/database";
import Image from "next/image";
import { Meal } from "@/types";

type MealsListType = {
  meals?: Meal[];
  heading: string;
};

type MealItemProps = {
  meal: Meal;
};

const MealItem: React.FC<MealItemProps> = ({ meal: item }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        className="w-full h-48 object-cover"
        src={item.image}
        alt={item.title}
        width={100}
        height={100}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            <p>
              <span className="font-semibold">Created by:</span> {item.creator}
            </p>
            <p>{item.email}</p>
          </div>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-lg">
            {item.summary}
          </span>
        </div>
      </div>
    </div>
  );
};

// create a MealItem component

const MealsList: React.FC<MealsListType> = ({ meals = [], heading }) => {
  return (
    <div>
      <h1>{heading}</h1>
      <div className="grid grid-cols-4 gap-4 sm: grid-cols-1  px-4">
        {meals.map((meal) => (
          <MealItem meal={meal} key={meal.id} />
        ))}
      </div>
    </div>
  );
};

export default MealsList;
