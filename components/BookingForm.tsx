'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, PenTool, Loader2 } from 'lucide-react';
import { format, isAfter, isBefore, parseISO, isWithinInterval, addDays, differenceInDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { getCurrentUser, createBookingWithTokenValidation } from '@/app/actions';
import { User } from '@/app/types';
import { toast } from 'sonner';
import TokenPurchaseDialog from '@/components/TokenPurchaseDialog';

interface BookingFormProps {
  listingId: string;
  listingPrice: number;
  availability: {
    id: string;
    startDate: string;
    endDate: string;
  }[];
}

export default function BookingForm({ listingId, listingPrice, availability }: BookingFormProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  
  // Load current user data
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  // Parse availability dates once
  const availabilityPeriods = useMemo(() => {
    return availability.map(period => ({
      id: period.id,
      startDate: parseISO(period.startDate),
      endDate: parseISO(period.endDate),
    }));
  }, [availability]);

  // Calculate booking details
  const bookingDetails = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return null;
    }

    const nights = differenceInDays(dateRange.to, dateRange.from);
    const totalPrice = nights * listingPrice;

    return { nights, totalPrice };
  }, [dateRange.from, dateRange.to, listingPrice]);
  
  // Function to check if a date is available
  const isDateAvailable = (date: Date) => {
    // If no availability periods, nothing is available
    if (availabilityPeriods.length === 0) return false;
    
    // Check if the date falls within any availability period
    return availabilityPeriods.some(period => 
      isWithinInterval(date, { start: period.startDate, end: period.endDate })
    );
  };
  
  // Function to disable dates that are not available or before tomorrow
  const disableDate = (date: Date) => {
    const tomorrow = addDays(new Date(), 1);
    // Disable if date is before tomorrow or not available
    return isBefore(date, tomorrow) || !isDateAvailable(date);
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
  const handleDateSelect = (range: DateRange | undefined) => {
    // If clearing the selection or just selecting the start date
    if (!range || !range.from || !range.to) {
      setDateRange({ from: range?.from, to: range?.to });
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
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to make a booking');
      return;
    }

    if (!bookingDetails) {
      toast.error('Unable to calculate booking details');
      return;
    }

    setIsBooking(true);

    try {
      const result = await createBookingWithTokenValidation({
        listingId,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        totalPrice: bookingDetails.totalPrice,
      });

      if (result.success && result.booking) {
        toast.success('Booking created successfully!');
        router.push(`/booking/success?bookingId=${result.booking.id}`);
      } else if (result.insufficientTokens) {
        setShowTokenDialog(true);
      } else {
        toast.error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  const handleTokenPurchaseComplete = (newBalance: number) => {
    setCurrentUser(prev => prev ? { ...prev, tokens: newBalance } : null);
    // Automatically retry booking after token purchase
    if (bookingDetails && newBalance >= bookingDetails.totalPrice) {
      handleBooking();
    }
  };
  
  // Get the earliest and latest availability dates for display
  const earliestAvailableDate = availabilityPeriods.length > 0
    ? availabilityPeriods.reduce((earliest, period) =>
        period.startDate < earliest ? period.startDate : earliest,
        availabilityPeriods[0].startDate)
    : new Date();

  const latestDate = availabilityPeriods.length > 0
    ? availabilityPeriods.reduce((latest, period) =>
        period.endDate > latest ? period.endDate : latest,
        availabilityPeriods[0].endDate)
    : new Date();

  // Set minimum booking date to tomorrow
  const tomorrow = addDays(new Date(), 1);
  const minBookingDate = earliestAvailableDate > tomorrow ? earliestAvailableDate : tomorrow;
  
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
            Available from {format(earliestAvailableDate, 'MMM d, yyyy')} to {format(latestDate, 'MMM d, yyyy')}
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
            defaultMonth={new Date()}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={disableDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            fromDate={minBookingDate}
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
      
      {/* Booking Summary */}
      {bookingDetails && (
        <div className="p-3 bg-muted rounded-lg mb-4">
          <div className="flex justify-between items-center text-sm">
            <span>Total ({bookingDetails.nights} night{bookingDetails.nights !== 1 ? 's' : ''})</span>
            <div className="flex items-center gap-1">
              <PenTool className="h-3 w-3 text-primary" />
              <span className="font-medium">{bookingDetails.totalPrice} tokens</span>
            </div>
          </div>
          {currentUser && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span>Your balance</span>
              <div className="flex items-center gap-1">
                <PenTool className="h-3 w-3 text-primary" />
                <span className={`font-medium ${
                  currentUser.tokens >= bookingDetails.totalPrice ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentUser.tokens} tokens
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleBooking}
        disabled={!dateRange.from || !dateRange.to || availabilityPeriods.length === 0 || isBooking || isLoadingUser}
      >
        {isBooking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating booking...
          </>
        ) : (
          'Book your stay'
        )}
      </Button>

      {/* Token Purchase Dialog */}
      {showTokenDialog && currentUser && bookingDetails && (
        <TokenPurchaseDialog
          open={showTokenDialog}
          onOpenChange={setShowTokenDialog}
          currentTokens={currentUser.tokens}
          requiredTokens={bookingDetails.totalPrice}
          onPurchaseComplete={handleTokenPurchaseComplete}
        />
      )}
    </div>
  );
}
