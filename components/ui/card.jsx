import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-white/70 bg-white/85 p-6 shadow-glow backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
