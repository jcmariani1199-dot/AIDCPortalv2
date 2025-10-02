import { useState, useMemo, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface ColumnFilterMenuProps {
  column: string;
  allValues: string[];
  selectedValues: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onClear: () => void;
  getCount: (value: string) => number;
  totalCount: number;
}

export default function ColumnFilterMenu({
  column,
  allValues,
  selectedValues,
  onSelectionChange,
  onClear,
  getCount,
  totalCount,
}: ColumnFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredValues = useMemo(() => {
    if (!debouncedSearch) return allValues;
    const query = debouncedSearch.toLowerCase();
    return allValues.filter((value) => value.toLowerCase().includes(query));
  }, [allValues, debouncedSearch]);

  const isAllSelected = filteredValues.length > 0 && 
    filteredValues.every((value) => selectedValues.has(value));
  
  const isSomeSelected = filteredValues.some((value) => selectedValues.has(value));
  
  const isIndeterminate = isSomeSelected && !isAllSelected;

  const handleSelectAll = () => {
    const newSelection = new Set(selectedValues);
    
    if (isAllSelected) {
      // Deselect all visible items
      filteredValues.forEach((value) => newSelection.delete(value));
    } else {
      // Select all visible items
      filteredValues.forEach((value) => newSelection.add(value));
    }
    
    onSelectionChange(newSelection);
  };

  const handleToggle = (value: string) => {
    const newSelection = new Set(selectedValues);
    
    if (newSelection.has(value)) {
      newSelection.delete(value);
    } else {
      newSelection.add(value);
    }
    
    onSelectionChange(newSelection);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    onClear();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
    }
  };

  const selectedCount = selectedValues.size;

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={selectedCount > 0 ? "default" : "outline"}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            data-testid={`button-filter-${column}`}
          >
            <Filter className="h-3 w-3" />
            {selectedCount > 0 && (
              <Badge 
                variant="secondary" 
                className="h-4 px-1 text-xs font-mono"
              >
                {selectedCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 p-0" 
          align="start"
          data-testid={`popover-filter-${column}`}
        >
          <div className="flex flex-col">
            {/* Search Input */}
            <div className="p-2 border-b">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs"
                data-testid={`input-filter-search-${column}`}
              />
            </div>

            {/* Select All */}
            <div className="p-2 border-b">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isAllSelected ? true : isIndeterminate ? "indeterminate" : false}
                  onCheckedChange={handleSelectAll}
                  data-testid={`checkbox-select-all-${column}`}
                />
                <label 
                  className="text-xs font-medium cursor-pointer"
                  onClick={handleSelectAll}
                >
                  Select All {debouncedSearch && `(${filteredValues.length})`}
                </label>
              </div>
            </div>

            {/* Options List */}
            <ScrollArea className="h-64">
              <div className="p-1">
                {filteredValues.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No results found
                  </div>
                ) : (
                  filteredValues.map((value) => {
                    const count = getCount(value);
                    const isSelected = selectedValues.has(value);
                    
                    return (
                      <div
                        key={value}
                        className="flex items-center gap-2 p-2 rounded-md hover-elevate cursor-pointer"
                        onClick={() => handleToggle(value)}
                        data-testid={`checkbox-filter-${column}-${value}`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            // Stop event bubbling to prevent double-toggle
                            handleToggle(value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                          <span className="text-xs truncate">{value}</span>
                          <span className="text-xs text-muted-foreground font-mono shrink-0">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            {selectedCount > 0 && (
              <div className="p-2 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {selectedCount} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 text-xs"
                  data-testid={`button-clear-filter-${column}`}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {selectedCount > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleClear}
          data-testid={`button-clear-filter-quick-${column}`}
          title="Clear filter"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
