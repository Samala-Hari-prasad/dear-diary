import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search memories..." }: SearchBarProps) {
  return (
    <div className="relative w-full flex items-center select-none">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center pr-3">
        <Search className="h-3.5 w-3.5 text-foreground/35" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 rounded-sm border border-border bg-foreground/[0.01] pl-9 pr-8 text-xs font-normal placeholder:text-foreground/30 focus:outline-none focus:ring-0 focus:border-foreground/20 text-foreground transition-all duration-200"
        placeholder={placeholder}
        aria-label="Search memories"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/40 hover:text-foreground/70"
          aria-label="Clear search input"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
