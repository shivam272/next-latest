import type { TNewsArticle } from "@/types";
import Image from "next/image";
import Link from "next/link";

type TNewCardProps = {
  title: string;
  id: string;
  date: string;
  image: string;
  source: string;
};

const NewsCard: React.FC<TNewCardProps> = ({
  title,
  id,
  date,
  image,
  source,
}) => {
  return (
    <div className="max-w-sm rounded-md overflow-hidden shadow-lg bg-white">
      <Image
        className="object-cover"
        src={image}
        alt={title}
        width={400}
        height={200}
      />
      <div className="p-4">
        <Link
          href={`/news/${id}`}
          className="font-bold text-xl mb-2 cursor-pointer underline"
        >
          {title}
        </Link>
        <div className="text-gray-600 text-md flex justify-between mt-2">
          <span>{date}</span>
          <span className="font-bold">{source}</span>
        </div>
      </div>
    </div>
  );
};

const NewsList = ({
  news,
  selectedYear,
}: {
  news: TNewsArticle[];
  selectedYear?: number;
}) => {
  if (selectedYear && news.length === 0)
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg font-semibold">
          No news articles found for the given year.
        </p>
        <span className="text-gray-400 text-sm mt-2">
          Please check back later for updates.
        </span>
      </div>
    );
  return (
    <div className="flex flex-wrap gap-8 justify-start max-w-[1681px] mx-auto">
      {news.map((article) => (
        <NewsCard key={article.id} {...article} />
      ))}
    </div>
  );
};

export default NewsList;
