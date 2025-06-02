'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenTool, MapPin, Home } from 'lucide-react';
import type { User } from '@/app/types';

export function HostSearch({ initialHosts }: { initialHosts: User[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter hosts based on search term
  const filteredHosts = initialHosts.filter(host => 
    host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (host.location && host.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div>
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search hosts by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mx-auto"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHosts.length > 0 ? (
          filteredHosts.map(host => (
            <Link href={`/community/${host.id}`} key={host.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={host.avatar} alt={host.name} />
                      <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-1">{host.name}</h3>
                    {host.location && (
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{host.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-primary mb-2">
                      <PenTool className="h-4 w-4 mr-1" />
                      <span>{host.tokens} tokens earned</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Home className="h-4 w-4 mr-1" />
                      <span>{host.listingsCount || 0} listings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No hosts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
