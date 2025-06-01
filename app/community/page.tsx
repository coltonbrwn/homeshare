'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenTool, Search, MapPin } from 'lucide-react';
import { MOCK_HOSTS } from '@/app/mock-data';


export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredHosts = MOCK_HOSTS.filter(host => 
    host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    host.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Host Community</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the amazing hosts who make HomeShare possible. Browse through our community
            and discover unique homes around the world.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search hosts by name or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Host Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHosts.map((host) => (
            <Card key={host.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={host.avatar} alt={host.name} />
                    <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{host.name}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{host.location}</span>
                    </div>
                    <div className="flex items-center text-primary mt-1">
                      <PenTool className="h-4 w-4 mr-1" />
                      <span className="font-medium">{host.tokens} tokens earned</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground mb-4">{host.bio}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {host.listingsCount} {host.listingsCount === 1 ? 'listing' : 'listings'}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      window.location.href = `/community/${host.id}`;
                      console.log(host.id);
                     }}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hosts found matching your search criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}
