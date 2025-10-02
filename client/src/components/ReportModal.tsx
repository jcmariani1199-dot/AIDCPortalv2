import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, TooltipProps, Sector } from "recharts";
import { DataRow } from "./DataTable";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  columnKey: string;
  columnName: string;
  data: DataRow[];
  onNavigateToRow?: (rowId: string | number) => void;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(210 100% 60%)",
  "hsl(145 65% 50%)",
  "hsl(35 90% 55%)",
  "hsl(280 70% 55%)",
  "hsl(0 75% 55%)",
];

export default function ReportModal({ open, onClose, columnKey, columnName, data, onNavigateToRow }: ReportModalProps) {
  const [drillDownCategory, setDrillDownCategory] = useState<string | null>(null);
  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const generateReport = () => {
    const columnValue = data[0]?.[columnKey];
    
    // Check if it's a numeric column for Top 40
    if (typeof columnValue === "number" || !isNaN(Number(columnValue))) {
      const sortedData = [...data]
        .filter((row) => row[columnKey] != null && row[columnKey] !== "")
        .sort((a, b) => Number(b[columnKey]) - Number(a[columnKey]))
        .slice(0, 40)
        .map((row) => ({
          name: String(row.Organisation || row.UID || "Unknown").slice(0, 30),
          value: Number(row[columnKey]),
          fullData: row,
        }));

      // Generate score distribution for pie chart
      const scoreDistribution: Record<string, { count: number; items: DataRow[] }> = {};
      
      data.forEach((row) => {
        const scoreValue = row[columnKey];
        if (scoreValue != null && scoreValue !== "") {
          const score = String(Number(scoreValue));
          if (!scoreDistribution[score]) {
            scoreDistribution[score] = { count: 0, items: [] };
          }
          scoreDistribution[score].count++;
          scoreDistribution[score].items.push(row);
        }
      });

      const scoreData = Object.entries(scoreDistribution)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([name, data]) => ({
          name: `Score ${name}`,
          value: data.count,
          items: data.items,
        }));

      return { type: "top40", data: sortedData, scoreDistribution: scoreData };
    }

    // For categorical data
    const categoryCounts: Record<string, { count: number; items: DataRow[] }> = {};
    
    data.forEach((row) => {
      const value = String(row[columnKey] || "Unknown");
      if (!categoryCounts[value]) {
        categoryCounts[value] = { count: 0, items: [] };
      }
      categoryCounts[value].count++;
      categoryCounts[value].items.push(row);
    });

    const categoryData = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([name, data]) => ({
        name,
        value: data.count,
        items: data.items,
      }));

    return { type: "category", data: categoryData };
  };

  const report = generateReport();

  const handleBarClick = (entry: any) => {
    if (report.type === "category" && entry.name) {
      setDrillDownCategory(drillDownCategory === entry.name ? null : entry.name);
    } else if (report.type === "top40") {
      // Navigate to the organization in the main table
      // Handle different Recharts versions (entry.fullData or entry.payload.fullData)
      const fullData = entry.fullData || entry.payload?.fullData;
      if (fullData?.id) {
        handleNavigateToRow(fullData.id);
      }
    }
  };

  const handlePieClick = (entry: any) => {
    if (entry.name) {
      setSelectedPieSlice(selectedPieSlice === entry.name ? null : entry.name);
      setDrillDownCategory(entry.name);
    }
  };

  const handleNavigateToRow = (rowId: string | number) => {
    onClose();
    if (onNavigateToRow) {
      onNavigateToRow(rowId);
    }
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg border border-border shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-foreground mt-1">
            {report.type === "top40" && <span className="text-muted-foreground">Score: </span>}
            <span className="font-mono">{data.value}</span>
            {report.type === "category" && " organizations"}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => {
    const total = data.length;
    const uniqueValues = new Set(data.map(row => row[columnKey])).size;
    
    let avgValue = 0;
    if (report.type === "top40") {
      // Calculate average for only the top 40 shown
      const top40Values = report.data.map(item => item.value);
      avgValue = top40Values.reduce((sum, val) => sum + val, 0) / top40Values.length;
    }

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {report.type === "top40" ? "Average Score (Top 40)" : "Categories"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {report.type === "top40" ? avgValue.toFixed(1) : uniqueValues}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBarChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          {report.type === "top40" ? `Top 40 by ${columnName}` : `Distribution by ${columnName}`}
        </CardTitle>
        <CardDescription>
          {report.type === "top40" 
            ? "Click any bar to view organization details" 
            : "Click on any bar to see detailed breakdown"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={report.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              hide={true}
            />
            <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              onClick={handleBarClick}
              cursor="pointer"
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {report.data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  opacity={drillDownCategory === entry.name ? 1 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, opacity, midAngle } = props;
    
    // Calculate the direction to move the segment outward
    const RADIAN = Math.PI / 180;
    const distance = 12; // Distance to pop out
    const dx = Math.cos(-midAngle * RADIAN) * distance;
    const dy = Math.sin(-midAngle * RADIAN) * distance;
    
    return (
      <g
        style={{
          transform: `translate(${dx}px, ${dy}px) scale(1.06)`,
          transformOrigin: 'center',
          transformBox: 'fill-box',
          transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={opacity}
          style={{
            filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4))',
            transition: 'filter 250ms ease',
          }}
        />
      </g>
    );
  };

  const renderPieChart = () => {
    // For score reports, use scoreDistribution; for category reports, use regular data
    const pieData = report.type === "top40" && 'scoreDistribution' in report 
      ? report.scoreDistribution 
      : report.data.slice(0, 10);

    const title = report.type === "top40" && 'scoreDistribution' in report
      ? `Score Distribution - ${columnName}`
      : "Distribution Overview";

    if (!pieData || pieData.length === 0) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Hover over segments for details, click to drill down</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                onClick={handlePieClick}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                cursor="pointer"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    opacity={selectedPieSlice === null || selectedPieSlice === entry.name ? 1 : 0.3}
                    style={{ 
                      transition: 'opacity 0.3s ease-in-out',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderDrillDown = () => {
    if (!drillDownCategory) return null;

    // For score reports, check scoreDistribution first
    let categoryData;
    if (report.type === "top40" && 'scoreDistribution' in report && report.scoreDistribution) {
      categoryData = report.scoreDistribution.find((d: any) => d.name === drillDownCategory);
    } else {
      categoryData = report.data.find(d => d.name === drillDownCategory);
    }
    
    if (!categoryData || !('items' in categoryData) || !categoryData.items) return null;

    // Get all unique column keys from the items
    const sampleItem = categoryData.items[0];
    const columnKeys = Object.keys(sampleItem).filter(key => 
      key !== 'id' && sampleItem[key] !== null && sampleItem[key] !== undefined
    );

    return (
      <Card className="mt-6 border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Drill-Down: {drillDownCategory}
          </CardTitle>
          <CardDescription>{categoryData.items.length} organizations in this category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  {columnKeys.map((key) => (
                    <TableHead key={key} className="font-semibold whitespace-nowrap">
                      {key}
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.items.map((item: DataRow, index: number) => (
                  <TableRow key={index} className="hover-elevate">
                    {columnKeys.map((key) => (
                      <TableCell key={key} className="whitespace-nowrap">
                        {key === "First Contact Y/N" ? (
                          <Badge variant={item[key] === "Yes" ? "default" : "secondary"}>
                            {item[key]}
                          </Badge>
                        ) : key === " Category " ? (
                          <Badge variant="outline">{item[key]}</Badge>
                        ) : (
                          <span className={typeof item[key] === 'number' ? 'font-mono' : ''}>
                            {item[key]}
                          </span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {onNavigateToRow && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleNavigateToRow(item.id)}
                          data-testid={`button-navigate-${item.id}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            {columnName} Report
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="chart" data-testid="tab-chart">Bar Chart</TabsTrigger>
            <TabsTrigger value="distribution" data-testid="tab-distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
            <div className="grid grid-cols-2 gap-4">
              {renderBarChart()}
              {report.type === "category" && renderPieChart()}
            </div>
            {renderDrillDown()}
          </TabsContent>

          <TabsContent value="chart" className="mt-6">
            {renderBarChart()}
            {renderDrillDown()}
          </TabsContent>

          <TabsContent value="distribution" className="mt-6">
            {renderPieChart()}
            {renderDrillDown()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
