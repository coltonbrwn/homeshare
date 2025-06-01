'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, ArrowRight, Home, MapPin, 
  ImagePlus, Check, Loader2, DollarSign 
} from 'lucide-react';
import { toast } from 'sonner';
import { createListing } from '@/app/actions';

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

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    amenities: [] as string[],
    images: [
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3',
    ], // Default placeholder images for demo
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle amenity toggle
  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return { ...prev, amenities };
    });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.location || !formData.price) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Create listing
      const listing = await createListing({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseInt(formData.price),
        amenities: formData.amenities,
        images: formData.images,
      });
      
      toast.success('Listing created successfully!');
      
      // Redirect to the listing page
      router.push(`/dashboard/listings/${listing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Go to next step
  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.title || !formData.description) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else if (step === 2) {
      if (!formData.location) {
        toast.error('Please enter a location');
        return;
      }
    } else if (step === 3) {
      if (!formData.price) {
        toast.error('Please enter a price');
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };
  
  // Go to previous step
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => router.push('/dashboard/listings')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Listings
          </Button>
          <h1 className="text-3xl font-bold">Add New Listing</h1>
          <p className="text-muted-foreground mt-2">
            Share your space and start earning tokens
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 1 ? <Check className="h-4 w-4" /> : 1}
              </div>
              <span className="ml-2 text-sm font-medium">Basic Info</span>
            </div>
            <div className="flex-1 mx-4 mt-4">
              <div className="h-1 bg-muted">
                <div 
                  className="h-1 bg-primary" 
                  style={{ width: `${(step - 1) * 25}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 2 ? <Check className="h-4 w-4" /> : 2}
              </div>
              <span className="ml-2 text-sm font-medium">Location</span>
            </div>
            <div className="flex-1 mx-4 mt-4">
              <div className="h-1 bg-muted">
                <div 
                  className="h-1 bg-primary" 
                  style={{ width: `${(step - 2) * 33}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 3 ? <Check className="h-4 w-4" /> : 3}
              </div>
              <span className="ml-2 text-sm font-medium">Pricing</span>
            </div>
            <div className="flex-1 mx-4 mt-4">
              <div className="h-1 bg-muted">
                <div 
                  className="h-1 bg-primary" 
                  style={{ width: `${(step - 3) * 33}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 4 ? <Check className="h-4 w-4" /> : 4}
              </div>
              <span className="ml-2 text-sm font-medium">Amenities</span>
            </div>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Location'}
              {step === 3 && 'Pricing'}
              {step === 4 && 'Amenities'}
              {step === 5 && 'Review & Submit'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Listing Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Cozy Beachfront Cottage"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your space, the atmosphere, and what makes it special..."
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            
            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="San Francisco, CA"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter the general location of your property. For privacy reasons, the exact address will only be shared with confirmed guests.
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 3: Pricing */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night (in tokens)</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="100"
                      min="1"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Set a competitive price to attract guests. You can always adjust it later.
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 4: Amenities */}
            {step === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Select the amenities available at your property.
                </p>
                <div className="grid grid-cols-2 gap-4">
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
            )}
            
            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Home className="h-5 w-5 mr-2 text-primary" />
                    {formData.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {formData.location}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Price</h4>
                  <p className="text-sm text-primary font-medium">
                    {formData.price} tokens per night
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <div 
                        key={amenity} 
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </div>
                    ))}
                    {formData.amenities.length === 0 && (
                      <p className="text-sm text-muted-foreground">No amenities selected</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="aspect-video bg-muted rounded-md overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={image} 
                          alt={`Property image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: For this demo, we&apos;re using placeholder images. In a real app, you would upload your own.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={() => router.push('/dashboard/listings')}>
                Cancel
              </Button>
            )}
            
            {step < 5 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Listing
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}