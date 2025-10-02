import ReportModal from "../ReportModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ReportModalExample() {
  const [open, setOpen] = useState(false);

  const mockData = [
    { id: 1, Organisation: "Company A", "SLM Score": 10, " Category ": "Tech", "First Contact Y/N": "Yes" },
    { id: 2, Organisation: "Company B", "SLM Score": 8, " Category ": "Tech", "First Contact Y/N": "No Contact" },
    { id: 3, Organisation: "Company C", "SLM Score": 9, " Category ": "Finance", "First Contact Y/N": "Yes" },
    { id: 4, Organisation: "Company D", "SLM Score": 7, " Category ": "Tech", "First Contact Y/N": "Yes" },
    { id: 5, Organisation: "Company E", "SLM Score": 6, " Category ": "Healthcare", "First Contact Y/N": "No Contact" },
  ];

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Report</Button>
      <ReportModal
        open={open}
        onClose={() => setOpen(false)}
        columnKey="SLM Score"
        columnName="SLM Score"
        data={mockData}
      />
    </div>
  );
}
