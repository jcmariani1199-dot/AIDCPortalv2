import ContactToggle from "../ContactToggle";
import { useState } from "react";

export default function ContactToggleExample() {
  const [value, setValue] = useState("Yes");

  return (
    <div className="p-6 bg-card rounded-lg">
      <ContactToggle
        value={value}
        onChange={setValue}
        rowId="example"
      />
    </div>
  );
}
