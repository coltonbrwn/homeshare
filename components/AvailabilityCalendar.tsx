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
          numberOfMonths={1}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          disabled={[
            { before: new Date() }
          ]}
          className="rounded-md border-0"
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
