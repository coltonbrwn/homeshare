'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays } from 'lucide-react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

interface BookingFormProps {
  listingId: string;
  availableFrom: string;
  availableTo: string;
}

export default function BookingForm({ listingId, availableFrom, availableTo }: BookingFormProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Parse the available dates
  const fromDate = parseISO(availableFrom);
  const toDate = parseISO(availableTo);
  
  // Function to disable dates outside the available range
  const disableDate = (date: Date) => {
    return isBefore(date, fromDate) || isAfter(date, toDate);
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
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Available from {format(fromDate, 'MMM d, yyyy')} to {format(toDate, 'MMM d, yyyy')}
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              !dateRange.from && 'text-muted-foreground'
            }`}
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
            defaultMonth={fromDate}
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
        disabled={!dateRange.from || !dateRange.to}
      >
        Book your stay
      </Button>
    </div>
  );
}