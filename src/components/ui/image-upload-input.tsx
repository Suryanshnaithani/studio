import React, { useState, useCallback, useRef } from 'react';
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Link, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  maxFileSize?: number; // Max file size in bytes (e.g., 5MB = 5 * 1024 * 1024)
}

export function ImageUploadInput<T extends FieldValues>({
  form,
  name,
  label,
  maxFileSize = 5 * 1024 * 1024, // Default 5MB
}: ImageUploadInputProps<T>) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(form.getValues(name) || null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSize) {
        toast({
            variant: "destructive",
            title: "File Too Large",
            description: `Please select a file smaller than ${maxFileSize / 1024 / 1024}MB.`,
        });
        // Clear the file input
        if (fileInputRef.current) {
             fileInputRef.current.value = '';
        }
        return;
    }

    if (!file.type.startsWith('image/')) {
         toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please select an image file (e.g., JPG, PNG, GIF, WebP).",
        });
         if (fileInputRef.current) {
             fileInputRef.current.value = '';
         }
        return;
    }


    const reader = new FileReader();
    setUploading(true);

    reader.onloadend = () => {
      const base64String = reader.result as string;
      form.setValue(name, base64String as any, { shouldValidate: true, shouldDirty: true });
      setPreviewUrl(base64String);
      setUploading(false);
      toast({
        title: "Image Uploaded",
        description: "Image successfully loaded from file.",
      });
        // Clear the file input after successful upload
        if (fileInputRef.current) {
             fileInputRef.current.value = '';
        }
    };

    reader.onerror = () => {
      setUploading(false);
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read the selected file.",
      });
        if (fileInputRef.current) {
             fileInputRef.current.value = '';
        }
    };

    reader.readAsDataURL(file);
  }, [form, name, toast, maxFileSize]);

   // Update preview if URL changes directly
   const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       const url = event.target.value;
       // Basic URL validation (more robust validation might be needed)
       if (url === '' || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/')) {
          setPreviewUrl(url || null);
       } else {
           setPreviewUrl(null); // Clear preview if invalid format
       }
       // Let RHF handle the field value update
        form.setValue(name, url as any, { shouldValidate: true, shouldDirty: true });
   }

  const handleClearImage = () => {
    form.setValue(name, '' as any, { shouldValidate: true, shouldDirty: true });
    setPreviewUrl(null);
     if (fileInputRef.current) {
       fileInputRef.current.value = ''; // Clear file input as well
     }
  };

   // Effect to sync preview URL with form state initially and on external changes
   React.useEffect(() => {
       const currentValue = form.getValues(name);
       if (currentValue && typeof currentValue === 'string') {
           setPreviewUrl(currentValue);
       } else {
            setPreviewUrl(null);
       }
   }, [form.watch(name)]); // Watch for changes to the specific field


  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
             <Input
                placeholder="Enter image URL (http://... or data:...)"
                {...field}
                onChange={handleUrlChange} // Use custom handler
                className="flex-grow"
              />
              <span className="text-sm text-muted-foreground hidden sm:block">OR</span>
             <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full sm:w-auto"
            >
                {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Upload className="mr-2 h-4 w-4" />
                )}
                {uploading ? 'Uploading...' : 'Upload File'}
             </Button>
           </div>
          <FormControl>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*" // Accept standard image formats
              className="hidden"
            />
          </FormControl>
           {previewUrl && (
              <div className="mt-2 relative group w-full max-w-xs">
                 <Image
                    key={previewUrl} // Force re-render on URL change
                    src={previewUrl}
                    alt="Image Preview"
                    width={150}
                    height={100}
                    className="rounded border object-contain bg-muted" // Use contain to see whole image
                 />
                 <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleClearImage}
                    title="Remove image"
                 >
                    <Trash2 className="h-4 w-4" />
                 </Button>
              </div>
           )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
