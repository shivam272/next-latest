import type { TNewsArticle } from "@/types";

export const getYearsArr = (news: TNewsArticle[]) => {
  const years = news.map((article) => new Date(article.date).getFullYear());
  return Array.from(new Set(years)).sort((a, b) => b - a);
};

export const getNewsByYear = (news: TNewsArticle[], year?: number) => {
  if (!year) return [];
  return news.filter(
    (article) => new Date(article.date).getFullYear() === year
  );
};
