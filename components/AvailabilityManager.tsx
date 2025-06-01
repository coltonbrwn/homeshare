'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addAvailabilityPeriod, removeAvailabilityPeriod } from '@/app/actions';
import { cn } from '@/lib/utils';

export default function AvailabilityManager({ listingId, availability }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  
  // Add a new availability period
  const handleAddAvailability = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select a date range');
      return;
    }
    
    setIsAdding(true);
    
    try {
      await addAvailabilityPeriod({
        listingId,
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
      });
      
      toast.success('Availability period added');
      setDateRange({ from: undefined, to: undefined });
      
      // Refresh the page to show the new availability
      window.location.reload();
    } catch (error) {
      console.error('Error adding availability:', error);
      toast.error('Failed to add availability period');
    } finally {
      setIsAdding(false);
    }
  };
  
  // Remove an availability period
  const handleRemoveAvailability = async (id) => {
    setIsRemoving(true);
    
    try {
      await removeAvailabilityPeriod(id);
      
      toast.success('Availability period removed');
      
      // Refresh the page to update the availability list
      window.location.reload();
    } catch (error) {
      console.error('Error removing availability:', error);
      toast.error('Failed to remove availability period');
    } finally {
      setIsRemoving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Add New Availability Period</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[300px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={[
                  { before: new Date() }
                ]}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleAddAvailability} 
            disabled={!dateRange.from || !dateRange.to || isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Period
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Availability Periods</h3>
        {availability.length === 0 ? (
          <p className="text-muted-foreground">No availability periods set</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {availability.map((period) => (
              <div 
                key={period.id} 
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div>
                  <span className="font-medium">
                    {format(new Date(period.startDate), "MMM d, yyyy")}
                  </span>
                  <span className="mx-2">to</span>
                  <span className="font-medium">
                    {format(new Date(period.endDate), "MMM d, yyyy")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAvailability(period.id)}
                  disabled={isRemoving}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground pt-4 border-t">
        Note: Removing an availability period will make your listing unavailable for those dates.
      </p>
    </div>
  );
}
