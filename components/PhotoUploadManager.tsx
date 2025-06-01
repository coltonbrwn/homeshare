'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateListingImages } from '@/app/actions';
import { 
  Upload, 
  X, 
  GripVertical, 
  ImagePlus, 
  Loader2,
  Save,
  RotateCcw
} from 'lucide-react';
import Image from 'next/image';

interface PhotoUploadManagerProps {
  listingId: string;
  currentImages: string[];
  onImagesUpdated?: (images: string[]) => void;
  onCancel?: () => void;
}

export default function PhotoUploadManager({ 
  listingId, 
  currentImages, 
  onImagesUpdated,
  onCancel 
}: PhotoUploadManagerProps) {
  const [images, setImages] = useState<string[]>(currentImages);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    // Convert files to data URLs for preview
    const promises = validFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(dataUrls => {
        setImages(prev => [...prev, ...dataUrls]);
        setIsUploading(false);
        toast.success(`${validFiles.length} image(s) added`);
      })
      .catch(error => {
        console.error('Error reading files:', error);
        toast.error('Failed to process images');
        setIsUploading(false);
      });
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Remove image
  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle image reordering
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handleDragOverImage = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setImages(prev => {
      const newImages = [...prev];
      const draggedImage = newImages[draggedIndex];
      newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedImage);
      return newImages;
    });
    setDraggedIndex(index);
  }, [draggedIndex]);

  // Save images
  const handleSave = async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setIsSaving(true);
    try {
      await updateListingImages({
        id: listingId,
        images: images,
      });
      
      toast.success('Images updated successfully!');
      onImagesUpdated?.(images);
    } catch (error) {
      console.error('Error updating images:', error);
      toast.error('Failed to update images. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to original images
  const handleReset = () => {
    setImages(currentImages);
    toast.info('Changes reset');
  };

  const hasChanges = JSON.stringify(images) !== JSON.stringify(currentImages);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Add Photos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop images here, or click to select files
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: JPG, PNG, GIF. Maximum size: 5MB per image.
          </p>
        </CardContent>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">
              Photos ({images.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group aspect-square bg-muted rounded-lg overflow-hidden cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverImage(e, index)}
                >
                  <Image
                    src={image}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Drag handle */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded p-1">
                      <GripVertical className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Remove button */}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  {/* Main photo indicator */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Main Photo
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Drag photos to reorder them. The first photo will be used as the main image.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
