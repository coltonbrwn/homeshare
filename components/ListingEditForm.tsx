'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { updateListing } from '@/app/actions';
import { Loader2, Save } from 'lucide-react';

// Common amenities for selection
const AMENITIES = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'beach', label: 'Beach Access' },
  { id: 'parking', label: 'Parking' },
  { id: 'tv', label: 'TV' },
  { id: 'coffee', label: 'Coffee Maker' },
  { id: 'pets', label: 'Pet Friendly' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'pool', label: 'Pool' },
];

export default function ListingEditForm({ listing }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    location: listing.location,
    price: listing.price.toString(),
    amenities: listing.amenities || [],
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return { ...prev, amenities };
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.location || !formData.price) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Update listing
      await updateListing({
        id: listing.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseInt(formData.price),
        amenities: formData.amenities,
      });
      
      toast.success('Listing updated successfully!');
      router.refresh();
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Listing Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price per Night (in tokens)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <Separator />
          
          <div>
            <Label className="block mb-3">Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AMENITIES.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={formData.amenities.includes(amenity.label)}
                    onCheckedChange={() => handleAmenityToggle(amenity.label)}
                  />
                  <Label htmlFor={amenity.id} className="cursor-pointer">
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
