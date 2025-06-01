'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export default function SearchBar() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (location) {
      params.append('location', location);
    }
    
    if (dateRange.from) {
      params.append('fromDate', dateRange.from.toISOString());
    }
    if (dateRange.to) {
      params.append('toDate', dateRange.to.toISOString());
    }
    
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-lg shadow-lg">
      <div className="relative flex-grow">
        <Input 
          placeholder="Where are you going?" 
          className="pl-10"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full sm:w-auto justify-start text-left font-normal ${
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
              "Select dates"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      
      <Button onClick={handleSearch}>
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  );
}