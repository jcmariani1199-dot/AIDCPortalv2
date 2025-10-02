import DataTable, { DataRow } from "../DataTable";
import { useState } from "react";

export default function DataTableExample() {
  const [data, setData] = useState<DataRow[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      company: "Tech Corp",
      status: "Active",
      firstContact: true,
      priority: "High",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@business.com",
      company: "Business Inc",
      status: "Pending",
      firstContact: false,
      priority: "Medium",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@startup.io",
      company: "Startup IO",
      status: "Active",
      firstContact: true,
      priority: "High",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@enterprise.com",
      company: "Enterprise Ltd",
      status: "Inactive",
      firstContact: false,
      priority: "Low",
    },
  ]);

  const handleContactToggle = (id: string | number, value: string) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, firstContact: value } : row
      )
    );
  };

  return (
    <div className="p-6">
      <DataTable
        data={data}
        onContactToggle={handleContactToggle}
        contactColumnKey="firstContact"
      />
    </div>
  );
}
