'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    phone: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }
    
    // Check if user exists in our database and fetch their data
    const fetchUserData = async () => {
      try {
        // First, ensure the user exists in our database
        const ensureResponse = await fetch('/api/users/ensure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clerkId: user.id }),
        });
        
        if (!ensureResponse.ok) {
          throw new Error('Failed to ensure user exists');
        }
        
        // Now fetch the user data
        const response = await fetch(`/api/users/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        
        // Check if user has already completed onboarding
        if (userData.bio && userData.location) {
          // User has already completed onboarding, redirect to dashboard
          await user.update({
            unsafeMetadata: {
              onboardingComplete: true,
            },
          });
          router.push('/dashboard');
          return;
        }
        
        // Pre-fill form with existing data
        setFormData({
          name: userData.name || user.fullName || '',
          location: userData.location || '',
          bio: userData.bio || '',
          phone: userData.phone || '',
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Fallback to Clerk data
        setFormData({
          name: user.fullName || '',
          location: '',
          bio: '',
          phone: '',
        });
        
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, isLoaded, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hasCompletedOnboarding: true,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      // Update Clerk metadata directly
      await user.update({
        unsafeMetadata: {
          onboardingComplete: true,
        },
      });
      
      toast.success('Profile updated successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Tell us a bit more about yourself to get started with HomeShare
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.imageUrl} alt={formData.name} />
                  <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground mb-2">
                  Your profile photo is imported from your account
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => user?.update({ unsafeMetadata: { onboardingComplete: true } })}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo in Account Settings
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
