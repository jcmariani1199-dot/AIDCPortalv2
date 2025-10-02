import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, BarChart3 } from "lucide-react";
import ContactToggle from "./ContactToggle";
import ReportModal from "./ReportModal";
import ColumnFilterMenu from "./ColumnFilterMenu";
import { cn } from "@/lib/utils";

export interface DataRow {
  id: string | number;
  [key: string]: any;
}

interface DataTableProps {
  data: DataRow[];
  onContactToggle: (id: string | number, value: string) => void;
  searchQuery?: string;
  contactColumnKey?: string;
}

type SortDirection = "asc" | "desc" | null;

export default function DataTable({
  data,
  onContactToggle,
  searchQuery = "",
  contactColumnKey = "firstContact",
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [reportColumn, setReportColumn] = useState<{ key: string; name: string } | null>(null);
  const [highlightRowId, setHighlightRowId] = useState<string | number | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, Set<string>>>({});

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key !== "id");
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data;

    // Apply column filters (OR within column, AND across columns)
    Object.entries(columnFilters).forEach(([column, selectedValues]) => {
      if (selectedValues && selectedValues.size > 0) {
        result = result.filter((row) => selectedValues.has(String(row[column])));
      }
    });

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    return result;
  }, [data, searchQuery, columnFilters]);

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (column: string, selectedValues: Set<string>) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: selectedValues,
    }));
  };

  const handleClearFilter = (column: string) => {
    setColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  };

  // Get unique values and counts for a column (considering other filters)
  const getColumnOptions = useMemo(() => {
    return (column: string) => {
      // Get data filtered by all OTHER columns (not this one)
      let filteredForColumn = data;
      Object.entries(columnFilters).forEach(([filterColumn, selectedValues]) => {
        if (filterColumn !== column && selectedValues && selectedValues.size > 0) {
          filteredForColumn = filteredForColumn.filter((row) => 
            selectedValues.has(String(row[filterColumn]))
          );
        }
      });

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredForColumn = filteredForColumn.filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(query)
          )
        );
      }

      // Compute counts in a single pass
      const countMap = new Map<string, number>();
      filteredForColumn.forEach((row) => {
        const value = String(row[column]);
        if (value !== "") {
          countMap.set(value, (countMap.get(value) || 0) + 1);
        }
      });

      // Get unique values sorted
      const uniqueValues = Array.from(countMap.keys()).sort();

      // Get count from map
      const getCount = (value: string) => {
        return countMap.get(value) || 0;
      };

      return {
        values: uniqueValues,
        getCount,
        totalCount: filteredForColumn.length,
      };
    };
  }, [data, columnFilters, searchQuery]);

  const formatColumnName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const isReportableColumn = (column: string) => {
    const reportableColumns = [
      " Category ",
      "First Contact Y/N",
      "SLM Score",
      "DCF & DCI Consumer Score",
      "Nscale Opportunity Score",
      "AVERAGE",
    ];
    return reportableColumns.includes(column);
  };

  const handleReportClick = (column: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportColumn({ key: column, name: formatColumnName(column) });
  };

  const handleNavigateToRow = (rowId: string | number) => {
    setHighlightRowId(rowId);
    const element = document.querySelector(`[data-testid="row-data-${rowId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => setHighlightRowId(null), 3000);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm mt-2">Upload an Excel file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {reportColumn && (
        <ReportModal
          open={true}
          onClose={() => setReportColumn(null)}
          columnKey={reportColumn.key}
          columnName={reportColumn.name}
          data={data}
          onNavigateToRow={handleNavigateToRow}
        />
      )}
      <div className="rounded-xl border bg-card overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSort(column)}
                      className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-md transition-colors"
                      data-testid={`button-sort-${column}`}
                    >
                      {formatColumnName(column)}
                      <SortIcon column={column} />
                    </button>
                    {isReportableColumn(column) && (
                      <button
                        onClick={(e) => handleReportClick(column, e)}
                        className="p-1.5 rounded-md hover-elevate active-elevate-2 transition-colors text-primary"
                        data-testid={`button-report-${column}`}
                        title={`View ${formatColumnName(column)} report`}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
            <tr className="border-b bg-muted/30">
              {columns.map((column) => {
                const options = getColumnOptions(column);
                const selectedValues = columnFilters[column] || new Set<string>();
                
                return (
                  <th key={`filter-${column}`} className="px-4 py-2">
                    <ColumnFilterMenu
                      column={column}
                      allValues={options.values}
                      selectedValues={selectedValues}
                      onSelectionChange={(selected: Set<string>) => handleFilterChange(column, selected)}
                      onClear={() => handleClearFilter(column)}
                      getCount={options.getCount}
                      totalCount={options.totalCount}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b last:border-b-0 transition-colors hover-elevate",
                  index % 2 === 0 ? "bg-card" : "bg-muted/20",
                  highlightRowId === row.id && "ring-2 ring-primary"
                )}
                data-testid={`row-data-${row.id}`}
              >
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3">
                    {column === contactColumnKey ? (
                      <ContactToggle
                        value={row[column]}
                        onChange={(value) => onContactToggle(row.id, value)}
                        rowId={row.id}
                      />
                    ) : (
                      <span
                        className={cn(
                          "text-sm",
                          typeof row[column] === "number"
                            ? "font-mono"
                            : "font-normal"
                        )}
                        data-testid={`text-${column}-${row.id}`}
                      >
                        {String(row[column])}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
