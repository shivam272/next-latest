import Link from "next/link";
import React, { Suspense } from "react";
import MealsList from "@/components/MealsList";

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
        <MealsList heading="Meals list" meals={[]} />
      </Suspense>
    </div>
  );
};

export default Meals;
