import { notFound } from "next/navigation";
import { JSX } from "react";

interface INewPageDetailProps {
  params: Promise<{ id: string }>;
}

const NewsDetailsPage = async ({
  params,
}: INewPageDetailProps): Promise<JSX.Element> => {
  const { id } = await params;

  if (id === "1") {
    notFound();
  }
  return <div>News Details Page {id}</div>;
};

export default NewsDetailsPage;
