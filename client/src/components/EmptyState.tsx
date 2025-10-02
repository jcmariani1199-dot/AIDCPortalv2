import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  onUpload: () => void;
}

export default function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-12 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary/10 p-6">
            <FileSpreadsheet className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">No Data Loaded</h2>
        <p className="text-muted-foreground mb-8">
          Upload your Excel spreadsheet to view and manage your portal data
          with our modern, intuitive interface.
        </p>
        <Button
          size="lg"
          onClick={onUpload}
          data-testid="button-upload-empty"
        >
          <Upload className="h-4 w-4" />
          Upload Excel File
        </Button>
      </Card>
    </div>
  );
}
