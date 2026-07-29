import Link from "next/link";
import React, { Suspense } from "react";
import MealsList from "@/components/MealsList";
import { fetchMeals } from "@/utils/database";
import { Meal } from "@/types";

const MealsDataComponent = async () => {
  const mealsData = (await fetchMeals()) as Meal[];
  return <MealsList heading="Meals list" meals={mealsData} />;
};

const Meals: React.FC = async () => {
  return (
    <div>
      <h1>This is a heading</h1>
      <Link href="/meals/share" className="text-blue-500 hover:underline">
        Meals share
      </Link>
      <Link href={`/meals/${2342}`} className="text-blue-500 hover:underline">
        Meals Details
      </Link>
      <Suspense
        fallback={<div className="flex flex-center">Loading suspense ...</div>}
      >
        <MealsDataComponent />
      </Suspense>
    </div>
  );
};

export default Meals;
