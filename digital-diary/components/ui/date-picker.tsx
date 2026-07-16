"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, className = "", disabled = false }: DatePickerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    if (e.target.value && e.target.value !== value) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      if (e.currentTarget.value && e.currentTarget.value !== value) {
        onChange(e.currentTarget.value);
      }
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const displayDate = new Date(value + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="date"
        defaultValue={value}
        disabled={disabled}
        className={`bg-transparent border-b border-foreground/20 text-sm focus:outline-none focus:border-foreground/50 py-0.5 ${className}`}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setIsEditing(true)}
      className={`flex items-center gap-2 hover:text-foreground transition-colors group disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Change date"
    >
      <CalendarIcon size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
      <span>{displayDate}</span>
    </button>
  );
}
