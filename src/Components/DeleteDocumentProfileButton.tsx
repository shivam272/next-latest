"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { deleteDocumentProfileAction } from "@/actions/documentProfile.action";

interface IDeleteDocumentProfileButtonProps {
  id: string;
  name: string;
}

export const DeleteDocumentProfileButton = ({
  id,
  name,
}: IDeleteDocumentProfileButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (
      !window.confirm(
        `Delete the documents for "${name}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteDocumentProfileAction(id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <button
      type="button"
      className="btn btn-error btn-outline btn-sm"
      onClick={onDelete}
      disabled={isPending}
    >
      {isPending && <span className="loading loading-spinner loading-xs" />}
      Delete
    </button>
  );
};
