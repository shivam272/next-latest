import { NewsList } from "@/components";
import { getNewsByYear } from "@/utils/actions";
import { NEWS_DATA } from "@/constants/data";

const LatestPage = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
        📰 Stay Updated: Latest News Highlights
      </h1>
      <NewsList
        news={getNewsByYear(NEWS_DATA, currentYear)}
        selectedYear={currentYear}
      />
    </div>
  );
};

export default LatestPage;
