import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ContactToggleProps {
  value: string | boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  rowId: string | number;
}

export default function ContactToggle({
  value,
  onChange,
  disabled = false,
  rowId,
}: ContactToggleProps) {
  const isContacted = value === "Yes" || value === true;
  
  const handleToggle = (checked: boolean) => {
    onChange(checked ? "Yes" : "No Contact");
  };

  return (
    <div className="flex items-center justify-center">
      <Switch
        checked={isContacted}
        onCheckedChange={handleToggle}
        disabled={disabled}
        data-testid={`toggle-contact-${rowId}`}
        className="data-[state=checked]:bg-chart-2"
      />
      <span
        className={cn(
          "ml-3 text-sm font-medium transition-colors",
          isContacted ? "text-chart-2" : "text-muted-foreground"
        )}
      >
        {isContacted ? "Yes" : "No Contact"}
      </span>
    </div>
  );
}
