import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Logo = ({ className, withWord = true }: { className?: string; withWord?: boolean }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <div className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-moon shadow-glow">
      <Moon className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
    </div>
    {withWord && (
      <span className="font-display text-2xl tracking-tight">Somion</span>
    )}
  </div>
);
