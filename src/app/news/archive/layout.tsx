export default function ArchiveLayout({
  archive,
  latest,
}: Readonly<{
  archive: React.ReactNode;
  latest: React.ReactNode;
}>) {
  return (
    <div>
      <div>{archive}</div>
      <div>{latest}</div>
    </div>
  );
}
