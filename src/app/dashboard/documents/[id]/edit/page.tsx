import { notFound } from "next/navigation";
import { DocumentProfileForm } from "@/components";
import { documentProfileIdSchema } from "@/schema";
import { getDocumentProfile } from "@/services";

export const dynamic = "force-dynamic";

interface IEditDocumentsPageProps {
  params: Promise<{ id: string }>;
}

const EditDocumentsPage = async ({ params }: IEditDocumentsPageProps) => {
  const { id } = await params;
  if (!documentProfileIdSchema.safeParse(id).success) {
    notFound();
  }

  const profile = await getDocumentProfile(id);
  if (!profile) {
    notFound();
  }

  return <DocumentProfileForm profile={profile} />;
};

export default EditDocumentsPage;
