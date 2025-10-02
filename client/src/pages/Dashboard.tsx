import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import DataTable, { DataRow } from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import NeoCloudPositioningModal from "@/components/NeoCloudPositioningModal";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [data, setData] = useState<DataRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [neoCloudModalOpen, setNeoCloudModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const fileName = encodeURIComponent("Portal Data_1759325555331.xlsx");
        const url = `/attached_assets/${fileName}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Excel file: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const file = new File([blob], "Portal Data.xlsx");
        
        const { parseExcelFile } = await import("@/lib/excelParser");
        const excelData = await parseExcelFile(file);
        
        setData(excelData);
        setHasLoadedData(true);
        toast({
          title: "Data Loaded",
          description: `Successfully loaded ${excelData.length} records from your Excel file`,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error loading Excel file:", error);
        toast({
          title: "Error Loading Data",
          description: error instanceof Error ? error.message : "Failed to load Excel file",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [toast]);

  const handleContactToggle = (id: string | number, value: string) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, "First Contact Y/N": value } : row
      )
    );

    toast({
      title: "Contact Status Updated",
      description: `First contact status changed to "${value}"`,
      duration: 2000,
    });
  };

  const handleUpload = () => {
    console.log("Upload triggered");
    toast({
      title: "Upload Feature",
      description: "Excel file upload will be implemented in the full version",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUpload={handleUpload}
        onNeoCloudPositioning={() => setNeoCloudModalOpen(true)}
        recordCount={data.length}
      />

      <main className="container mx-auto px-6 py-8">
        {!hasLoadedData || data.length === 0 ? (
          <EmptyState onUpload={handleUpload} />
        ) : (
          <DataTable
            data={data}
            onContactToggle={handleContactToggle}
            searchQuery={searchQuery}
            contactColumnKey="First Contact Y/N"
          />
        )}
      </main>

      <NeoCloudPositioningModal
        open={neoCloudModalOpen}
        onOpenChange={setNeoCloudModalOpen}
      />
    </div>
  );
}
