import { NEWS_DATA } from "@/constants/data";
import { NewsList } from "@/components";

const NewsPage: React.FC = () => {
  return (
    <div className="flex p-4">
      <NewsList news={NEWS_DATA} />
    </div>
  );
};

export default NewsPage;
