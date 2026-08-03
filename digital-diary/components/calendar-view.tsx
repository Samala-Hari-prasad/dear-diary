"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CalendarItem {
  id: string;
  title: string;
  eventDate: string;
}

export function CalendarView({ items }: { items: CalendarItem[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground" aria-live="polite">
          {format(currentDate, dateFormat)}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth} 
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors border border-transparent hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth} 
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors border border-transparent hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border shadow-sm">
        {weekDays.map(day => (
          <div key={day} className="bg-muted/50 p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const dayItems = items.filter(item => {
            if (!item || !item.id || !item.eventDate) return false;
            try {
              return isSameDay(parseISO(item.eventDate), day);
            } catch (e) {
              return false;
            }
          });
          const isCurrentMonth = isSameMonth(day, monthStart);
          const hasItems = dayItems.length > 0;
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={idx} 
              className={cn(
                "min-h-[120px] bg-background p-2 transition-colors relative group",
                !isCurrentMonth && "text-muted-foreground/30 bg-muted/10",
                hasItems && "hover:bg-muted/30"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-sm font-medium flex items-center justify-center rounded-full w-7 h-7 transition-colors",
                  isToday ? "bg-foreground text-background" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {format(day, "d")}
                </span>
              </div>
              
              <div className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar">
                {dayItems.map(item => (
                  <Link 
                    key={item.id} 
                    href={`/entry/${item.id}`}
                    className="block text-xs font-medium bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground px-2 py-1.5 rounded truncate transition-all shadow-sm"
                    title={item.title || "Untitled"}
                  >
                    {item.title || "Untitled"}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
