import Link from "next/link";
import React from "react";
import MealsList from "@/Components/MealsList";
import { fetchMeals } from "@/utils/database";
import { Meal } from "@/types";

const Meals: React.FC = async () => {
  const mealsData = (await fetchMeals()) as Meal[];
  return (
    <div>
      <div>Meals page</div>
      <Link href="/meals/share" className="text-blue-500 hover:underline">
        Meals share
      </Link>
      <Link href={`/meals/${2342}`} className="text-blue-500 hover:underline">
        Meals Details
      </Link>
      <div>
        <MealsList heading="Meals list" meals={mealsData} />
      </div>
    </div>
  );
};

export default Meals;
