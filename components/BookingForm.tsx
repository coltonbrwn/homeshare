'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays } from 'lucide-react';
import { format, isAfter, isBefore, parseISO, isWithinInterval } from 'date-fns';

interface BookingFormProps {
  listingId: string;
  availability: {
    id: string;
    startDate: string;
    endDate: string;
  }[];
}

export default function BookingForm({ listingId, availability }: BookingFormProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Function to check if a date is available
  const isDateAvailable = (date: Date) => {
    // If no availability periods, nothing is available
    if (availability.length === 0) return false;
    
    // Check if the date falls within any availability period
    return availability.some(period => {
      const startDate = parseISO(period.startDate);
      const endDate = parseISO(period.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };
  
  // Function to disable dates that are not available
  const disableDate = (date: Date) => {
    return !isDateAvailable(date);
  };
  
  const handleBooking = async () => {
    if (!dateRange.from || !dateRange.to) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    // In a real app, you would call a server action to create the booking
    // For now, just redirect to a success page
    router.push(`/booking/success?listingId=${listingId}&checkIn=${dateRange.from.toISOString()}&checkOut=${dateRange.to.toISOString()}`);
  };
  
  // Get the earliest and latest availability dates for display
  const earliestDate = availability.length > 0 
    ? parseISO(availability.reduce((earliest, period) => 
        period.startDate < earliest ? period.startDate : earliest, 
        availability[0].startDate))
    : new Date();
    
  const latestDate = availability.length > 0
    ? parseISO(availability.reduce((latest, period) => 
        period.endDate > latest ? period.endDate : latest, 
        availability[0].endDate))
    : new Date();
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        {availability.length > 0 ? (
          <>
            Available from {format(earliestDate, 'MMM d, yyyy')} to {format(latestDate, 'MMM d, yyyy')}
            {availability.length > 1 && ` (${availability.length} periods)`}
          </>
        ) : (
          <span className="text-destructive">No availability set for this listing</span>
        )}
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              !dateRange.from && 'text-muted-foreground'
            }`}
            disabled={availability.length === 0}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Select your stay dates"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={availability.length > 0 ? earliestDate : new Date()}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            disabled={disableDate}
          />
        </PopoverContent>
      </Popover>
      
      {dateRange.from && dateRange.to && (
        <div className="py-2">
          <div className="flex justify-between text-sm">
            <span>Check-in:</span>
            <span className="font-medium">{format(dateRange.from, 'EEE, MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Check-out:</span>
            <span className="font-medium">{format(dateRange.to, 'EEE, MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between text-sm mt-2 pt-2 border-t">
            <span>Total nights:</span>
            <span className="font-medium">
              {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
        </div>
      )}
      
      <Button 
        className="w-full" 
        size="lg" 
        onClick={handleBooking}
        disabled={!dateRange.from || !dateRange.to || availability.length === 0}
      >
        Book your stay
      </Button>
    </div>
  );
}
