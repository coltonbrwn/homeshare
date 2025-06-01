'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays } from 'lucide-react';
import { format, isAfter, isBefore, parseISO, isWithinInterval, addDays } from 'date-fns';

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
  
  // Parse availability dates once
  const availabilityPeriods = useMemo(() => {
    return availability.map(period => ({
      id: period.id,
      startDate: parseISO(period.startDate),
      endDate: parseISO(period.endDate),
    }));
  }, [availability]);
  
  // Function to check if a date is available
  const isDateAvailable = (date: Date) => {
    // If no availability periods, nothing is available
    if (availabilityPeriods.length === 0) return false;
    
    // Check if the date falls within any availability period
    return availabilityPeriods.some(period => 
      isWithinInterval(date, { start: period.startDate, end: period.endDate })
    );
  };
  
  // Function to disable dates that are not available
  const disableDate = (date: Date) => {
    return !isDateAvailable(date);
  };
  
  // Function to check if a date range is valid (all dates are available)
  const isRangeValid = (from: Date, to: Date) => {
    // Check if the entire range falls within a single availability period
    return availabilityPeriods.some(period => 
      isAfter(from, period.startDate) && 
      isBefore(to, period.endDate)
    );
  };
  
  // Handle date selection with validation
  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    // If clearing the selection or just selecting the start date
    if (!range.from || !range.to) {
      setDateRange(range);
      return;
    }
    
    // Check if the selected range is valid
    if (isRangeValid(range.from, range.to)) {
      setDateRange(range);
    } else {
      // Find the availability period that contains the start date
      const containingPeriod = availabilityPeriods.find(period => 
        isWithinInterval(range.from!, { start: period.startDate, end: period.endDate })
      );
      
      if (containingPeriod) {
        // Limit the end date to the end of the containing period
        const limitedEndDate = isBefore(range.to, containingPeriod.endDate) 
          ? range.to 
          : containingPeriod.endDate;
          
        setDateRange({
          from: range.from,
          to: limitedEndDate
        });
      } else {
        // Just set the start date if no containing period found
        setDateRange({
          from: range.from,
          to: undefined
        });
      }
    }
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
  const earliestDate = availabilityPeriods.length > 0 
    ? availabilityPeriods.reduce((earliest, period) => 
        period.startDate < earliest ? period.startDate : earliest, 
        availabilityPeriods[0].startDate)
    : new Date();
    
  const latestDate = availabilityPeriods.length > 0
    ? availabilityPeriods.reduce((latest, period) => 
        period.endDate > latest ? period.endDate : latest, 
        availabilityPeriods[0].endDate)
    : new Date();
  
  // Custom modifiers for the calendar to highlight availability
  const modifiers = {
    available: (date: Date) => isDateAvailable(date),
    unavailable: (date: Date) => !isDateAvailable(date),
  };
  
  // Custom styles for the calendar
  const modifiersStyles = {
    available: { backgroundColor: 'rgba(52, 211, 153, 0.1)' },
    unavailable: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#9CA3AF', textDecoration: 'line-through' },
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        {availabilityPeriods.length > 0 ? (
          <>
            Available from {format(earliestDate, 'MMM d, yyyy')} to {format(latestDate, 'MMM d, yyyy')}
            {availabilityPeriods.length > 1 && ` (${availabilityPeriods.length} periods)`}
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
            disabled={availabilityPeriods.length === 0}
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
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-100"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-100"></div>
              <span>Unavailable</span>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={availabilityPeriods.length > 0 ? earliestDate : new Date()}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={disableDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            fromDate={earliestDate}
            toDate={latestDate}
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
        disabled={!dateRange.from || !dateRange.to || availabilityPeriods.length === 0}
      >
        Book your stay
      </Button>
    </div>
  );
}
