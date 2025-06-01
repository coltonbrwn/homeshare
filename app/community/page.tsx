import { Suspense } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenTool, MapPin, Loader2 } from 'lucide-react';
import { getHosts } from '@/app/actions';
import { HostSearch } from '@/components/HostSearch';

// Server component to fetch and display hosts
async function HostDirectory() {
  const hosts = await getHosts();
  
  if (!hosts || hosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hosts found in our community yet.</p>
      </div>
    );
  }
  
  return (
    <div>
      <HostSearch initialHosts={hosts} />
    </div>
  );
}

export default function CommunityPage() {
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

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading hosts...</span>
          </div>
        }>
          <HostDirectory />
        </Suspense>
      </div>
    </main>
  );
}
