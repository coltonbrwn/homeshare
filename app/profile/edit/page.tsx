'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateUserProfile } from '@/app/actions';

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });

  // In a real app, you would get the user ID from the session
  const userId = 'user1'; // Sarah Johnson from our mock data

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        setUserData({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [userId, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the server action to update the profile
      const result = await updateUserProfile(userId, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || null,
        location: userData.location || null,
        bio: userData.bio || null,
      });
      
      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
        
        // Navigate back to the profile page
        router.push('/profile');
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
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
            <CardDescription>
              Update your profile information
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={userData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell others about yourself..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/profile')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
