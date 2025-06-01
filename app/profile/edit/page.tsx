'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    phone: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }
    
    // Fetch user data from our database
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        
        setFormData({
          name: userData.name || user.fullName || '',
          bio: userData.bio || '',
          location: userData.location || '',
          phone: userData.phone || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
        
        // Fallback to Clerk data
        setFormData({
          name: user.fullName || '',
          bio: '',
          location: '',
          phone: '',
        });
      } finally {
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
    
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      toast.success('Profile updated successfully');
      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading profile data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.push('/profile')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.imageUrl} alt={formData.name} />
                  <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground">
                  Profile photo is managed through your account settings
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>
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
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
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
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.push('/profile')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
