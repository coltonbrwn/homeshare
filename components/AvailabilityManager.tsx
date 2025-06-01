'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { addAvailabilityPeriod, removeAvailabilityPeriod } from '@/app/actions';
import { toast } from '@/components/ui/use-toast';

interface AvailabilityManagerProps {
  listingId: string;
  availability: {
    id: string;
    startDate: string;
    endDate: string;
  }[];
}

export default function AvailabilityManager({ listingId, availability }: AvailabilityManagerProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityPeriods, setAvailabilityPeriods] = useState(availability);
  
  // Function to check if a date is already within an existing availability period
  const isDateInExistingPeriod = (date: Date) => {
    return availabilityPeriods.some(period => {
      const startDate = parseISO(period.startDate);
      const endDate = parseISO(period.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };
  
  // Function to check if a new range overlaps with existing periods
  const doesRangeOverlap = (from: Date, to: Date) => {
    return availabilityPeriods.some(period => {
      const startDate = parseISO(period.startDate);
      const endDate = parseISO(period.endDate);
      
      // Check if either end of the new range falls within an existing period
      return (
        isWithinInterval(from, { start: startDate, end: endDate }) ||
        isWithinInterval(to, { start: startDate, end: endDate }) ||
        // Or if the new range completely encompasses an existing period
        (from <= startDate && to >= endDate)
      );
    });
  };
  
  // Add a new availability period
  const handleAddPeriod = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }
    
    if (doesRangeOverlap(dateRange.from, dateRange.to)) {
      toast({
        title: "Error",
        description: "This date range overlaps with an existing availability period",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newPeriod = await addAvailabilityPeriod({
        listingId,
        startDate: dateRange.from.toISOString().split('T')[0],
        endDate: dateRange.to.toISOString().split('T')[0],
      });
      
      setAvailabilityPeriods([...availabilityPeriods, newPeriod]);
      setDateRange({ from: undefined, to: undefined });
      
      toast({
        title: "Success",
        description: "Availability period added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add availability period",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Remove an availability period
  const handleRemovePeriod = async (id: string) => {
    setIsSubmitting(true);
    
    try {
      await removeAvailabilityPeriod(id);
      setAvailabilityPeriods(availabilityPeriods.filter(period => period.id !== id));
      
      toast({
        title: "Success",
        description: "Availability period removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove availability period",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Custom modifiers for the calendar to highlight existing availability
  const modifiers = {
    available: (date: Date) => isDateInExistingPeriod(date),
  };
  
  // Custom styles for the calendar
  const modifiersStyles = {
    available: { backgroundColor: 'rgba(52, 211, 153, 0.1)' },
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Add New Availability Period</h3>
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
                  "Select availability dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-100"></div>
                  <span>Existing availability</span>
                </div>
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleAddPeriod} 
            disabled={!dateRange.from || !dateRange.to || isSubmitting}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Availability Period
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Current Availability Periods</h3>
          {availabilityPeriods.length > 0 ? (
            <div className="space-y-2">
              {availabilityPeriods.map((period) => (
                <div 
                  key={period.id} 
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <span>
                    {format(parseISO(period.startDate), "MMM d, yyyy")} - {format(parseISO(period.endDate), "MMM d, yyyy")}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemovePeriod(period.id)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-muted rounded-md">
              <p className="text-muted-foreground">No availability periods set</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>Set multiple availability periods to define when your listing can be booked.</p>
      </CardFooter>
    </Card>
  );
}