/** Routes of the document upload pages. */
export const DOCUMENT_PATHS = {
  list: "/dashboard/documents",
  create: "/dashboard/documents/new",
  edit: (id: string) => `/dashboard/documents/${id}/edit`,
} as const;
