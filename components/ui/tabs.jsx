"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ defaultValue, items, children }) {
  const [value, setValue] = useState(defaultValue ?? items?.[0]?.value);

  return children({ value, setValue, items });
}

export function TabsList({ items, value, onChange, className }) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm",
        className
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
