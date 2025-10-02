import { Search, Upload, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import nokiaLogo from "@assets/NOK_logo_1759328245623.png";
import { apiRequest } from "@/lib/queryClient";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUpload: () => void;
  onNeoCloudPositioning: () => void;
  recordCount: number;
}

export default function TopBar({
  searchQuery,
  onSearchChange,
  onUpload,
  onNeoCloudPositioning,
  recordCount,
}: TopBarProps) {
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-full flex items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <img 
            src={nokiaLogo} 
            alt="Nokia Logo" 
            className="h-6"
            data-testid="img-nokia-logo"
          />
          <h1 className="text-xl font-semibold tracking-tight">
            AI DC & Cloud Network Portal
          </h1>
          <div className="text-sm text-muted-foreground font-mono">
            {recordCount} records
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search across all fields..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={onNeoCloudPositioning}
            data-testid="button-neo-cloud"
          >
            <FileText className="h-4 w-4" />
            Neo Cloud Positioning
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={onUpload}
            data-testid="button-upload"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
