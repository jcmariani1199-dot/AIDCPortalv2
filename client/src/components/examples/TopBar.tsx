import TopBar from "../TopBar";
import { useState } from "react";

export default function TopBarExample() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <TopBar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onUpload={() => console.log("Upload triggered")}
      onDownload={() => console.log("Download triggered")}
      recordCount={42}
    />
  );
}
