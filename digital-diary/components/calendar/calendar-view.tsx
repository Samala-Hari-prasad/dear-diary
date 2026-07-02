"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DiaryPageSummary } from "@/types/models/diary-summary";
import { formatDateKey } from "@/lib/calendar/timeline";

interface CalendarViewProps {
  pages: DiaryPageSummary[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export function CalendarView({ pages, selectedDate, onSelectDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Create date mappings for fast dot rendering
  const dateMap = pages.reduce((acc, page) => {
    const key = formatDateKey(page.updatedAt);
    if (key) {
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Get start day of month (0 = Sun, 1 = Mon, etc.)
  // Shift to start week on Monday (0 = Mon, 6 = Sun)
  const startDayRaw = new Date(year, month, 1).getDay();
  const startDay = startDayRaw === 0 ? 6 : startDayRaw - 1;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysGrid: (number | null)[] = [];
  // Fill empty leading slots
  for (let i = 0; i < startDay; i++) {
    daysGrid.push(null);
  }
  // Fill month days
  for (let i = 1; i <= totalDays; i++) {
    daysGrid.push(i);
  }

  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Month Selector Header */}
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-medium text-foreground/70">
          {monthNames[month]} {year}
        </h4>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-6 w-6 items-center justify-center rounded-sm text-foreground/55 hover:bg-foreground/5 hover:text-foreground transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-6 w-6 items-center justify-center rounded-sm text-foreground/55 hover:bg-foreground/5 hover:text-foreground transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Weekday Labels Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-semibold text-foreground/35">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
        {daysGrid.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }

          const dayStr = day.toString().padStart(2, "0");
          const monthStr = (month + 1).toString().padStart(2, "0");
          const dateKey = `${year}-${monthStr}-${dayStr}`;

          const entryCount = dateMap[dateKey] || 0;
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : dateKey)}
              aria-label={`Select date ${dateKey}`}
              aria-pressed={isSelected}
              className={`relative flex h-7 w-7 mx-auto items-center justify-center rounded-sm transition-all duration-150 ${
                isSelected
                  ? "bg-foreground text-background font-medium"
                  : "text-foreground/75 hover:bg-foreground/5"
              }`}
            >
              <span>{day}</span>
              {/* Dot Indicators */}
              {entryCount > 0 && (
                <span
                  className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                    isSelected ? "bg-background" : "bg-foreground/40"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
