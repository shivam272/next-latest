import Link from "next/link";
import React from "react";
import MealsList from "@/Components/MealsList";

const Meals: React.FC = () => {
  const random = Math.ceil(Math.random() * 100000);
  return (
    <div>
      <div>Meals page</div>
      <Link href="/meals/share" className="text-blue-500 hover:underline">
        Meals share
      </Link>
      <Link href={`/meals/${random}`} className="text-blue-500 hover:underline">
        Meals Details
      </Link>
      <div>
        <MealsList heading="Meals list" />
      </div>
    </div>
  );
};

export default Meals;
