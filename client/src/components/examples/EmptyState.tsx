import EmptyState from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="min-h-screen bg-background">
      <EmptyState onUpload={() => console.log("Upload triggered")} />
    </div>
  );
}
