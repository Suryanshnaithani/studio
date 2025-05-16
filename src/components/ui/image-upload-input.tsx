
import React, { useState, useCallback, useRef } from 'react';
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, ImagePlus, Trash2, Loader2, FileSymlink } from 'lucide-react';
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  // Initialize previewUrl from form state, ensuring it's a string or null
  const initialValue = form.getValues(name);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof initialValue === 'string' ? initialValue : null
  );


  const processFile = useCallback((file: File) => {
    if (!file) return;

    if (file.size > maxFileSize) {
        toast({
            variant: "destructive",
            title: "File Too Large",
            description: `Please select a file smaller than ${maxFileSize / 1024 / 1024}MB.`,
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }

    if (!file.type.startsWith('image/')) {
         toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please select an image file (e.g., JPG, PNG, GIF, WebP).",
        });
         if (fileInputRef.current) fileInputRef.current.value = '';
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
        description: "Image successfully loaded.",
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = () => {
      setUploading(false);
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read the selected file.",
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsDataURL(file);
  }, [form, name, toast, maxFileSize]);


  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        processFile(file);
    }
  }, [processFile]);


  const handleClearImage = () => {
    form.setValue(name, '' as any, { shouldValidate: true, shouldDirty: true });
    setPreviewUrl(null);
    if (fileInputRef.current) {
       fileInputRef.current.value = '';
    }
  };

   // Effect to sync preview URL with form state initially and on external changes
   React.useEffect(() => {
       const formValue = form.getValues(name);
       if (formValue && typeof formValue === 'string') {
           setPreviewUrl(formValue);
       } else {
            setPreviewUrl(null);
       }
       // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [form.watch(name)]); 

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
        processFile(file);
    }
  };


  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => ( // field is not directly used for value to allow local state for preview
        <FormItem>
          <FormLabel>{label}</FormLabel>
            <div 
                className={cn(
                    "mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-150 ease-in-out",
                    isDraggingOver ? "border-primary bg-primary/10" : "border-input hover:border-primary/70",
                    previewUrl && !isDraggingOver ? "border-primary bg-primary/5" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="space-y-1 text-center w-full">
                 {!previewUrl ? (
                    <>
                        <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground justify-center">
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="font-medium text-primary hover:text-primary/80 p-0 h-auto"
                            >
                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" /> }
                                {uploading ? 'Processing...' : 'Click to upload'}
                            </Button>
                            <p className="pl-1 hidden sm:inline">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground/80">PNG, JPG, GIF, WebP up to {maxFileSize / 1024 / 1024}MB</p>
                    </>
                 ) : (
                    <div className="relative group w-full max-w-xs mx-auto">
                        <Image
                            key={previewUrl} 
                            src={previewUrl}
                            alt="Image Preview"
                            width={150}
                            height={100}
                            className="rounded border object-contain bg-muted mx-auto"
                            onError={() => {
                                console.warn(`Failed to load image preview for: ${previewUrl}`);
                                setPreviewUrl(null); // Clear if broken
                                form.setValue(name, '' as any, { shouldValidate: true });
                            }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                             <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20 mb-1"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                title="Change image"
                             >
                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSymlink className="mr-2 h-4 w-4" />}
                                {uploading ? '...' : 'Change'}
                             </Button>
                             <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:bg-red-400/20 hover:text-red-300"
                                onClick={handleClearImage}
                                title="Remove image"
                             >
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                             </Button>
                        </div>
                    </div>
                 )}
                </div>
            </div>
          <FormControl>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif, image/webp"
              className="hidden"
              value="" // Control the value to allow re-upload of the same file
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

    