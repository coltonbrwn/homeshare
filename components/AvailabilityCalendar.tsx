'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { addMonths, isWithinInterval, parseISO } from 'date-fns';

interface AvailabilityCalendarProps {
  availability: {
    id: string;
    startDate: string;
    endDate: string;
  }[];
  bookings: {
    id: string;
    startDate: string;
    endDate: string;
  }[];
}

export default function AvailabilityCalendar({ availability, bookings }: AvailabilityCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date());
  
  // Check if a date is within any availability period
  const isDateAvailable = (date: Date) => {
    return availability.some(period => 
      isWithinInterval(date, {
        start: parseISO(period.startDate),
        end: parseISO(period.endDate)
      })
    );
  };
  
  // Check if a date is booked
  const isDateBooked = (date: Date) => {
    return bookings.some(booking => 
      isWithinInterval(date, {
        start: parseISO(booking.startDate),
        end: parseISO(booking.endDate)
      })
    );
  };
  
  // Custom modifiers for the calendar
  const modifiers = {
    available: (date: Date) => isDateAvailable(date) && !isDateBooked(date),
    booked: (date: Date) => isDateBooked(date),
  };
  
  // Custom styles for the calendar
  const modifiersStyles = {
    available: { backgroundColor: 'rgba(52, 211, 153, 0.1)' },
    booked: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#9CA3AF' },
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-100"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-100"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <Calendar
          mode="single"
          selected={new Date()}
          onSelect={() => {}} // Read-only, so no selection
          month={month}
          onMonthChange={setMonth}
          numberOfMonths={2}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          disabled={[
            { before: new Date() }
          ]}
          className="rounded-md border-0"
          classNames={{
            months: "flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </div>
    </div>
  );
}

function ChevronLeft(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}