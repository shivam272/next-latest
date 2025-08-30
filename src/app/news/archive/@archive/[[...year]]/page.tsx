import { getNewsByYear, getYearsArr } from "@/utils/actions";
import { NewsList } from "@/Components";
import { NEWS_DATA } from "@/constants/data";
import Link from "next/link";
import { JSX } from "react";

interface INewsByYearProps {
  params?: Promise<{ year?: string[] }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

const NewsByYear = async ({
  params,
}: INewsByYearProps): Promise<JSX.Element> => {
  const years = await params;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
        📰 Explore the News Archive
      </h1>
      <p className="text-gray-600 mb-4">
        Browse news stories by year and revisit the highlights.
      </p>
      <ul className="flex gap-2 my-4">
        {getYearsArr(NEWS_DATA).map((year) => (
          <Link
            className="font-bold text-lg cursor-pointer underline hover:text-blue-600"
            key={year}
            href={`/news/archive/${year}`}
          >
            {year}
          </Link>
        ))}
      </ul>
      <NewsList
        news={getNewsByYear(NEWS_DATA, parseInt(years?.year?.[0] ?? "0"))}
        selectedYear={parseInt(years?.year?.[0] ?? "0")}
      />
    </div>
  );
};

export default NewsByYear;
