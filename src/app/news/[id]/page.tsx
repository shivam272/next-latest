import { notFound } from "next/navigation";
import { JSX } from "react";

interface INewPageDetailProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const NewsDetailsPage = ({
  params,
  searchParams,
}: INewPageDetailProps): JSX.Element => {
  const { id } = params;
  console.log("ID:", id);

  if (id === "1") {
    notFound();
  }
  return <div>News Details Page {id}</div>;
};

export default NewsDetailsPage;
