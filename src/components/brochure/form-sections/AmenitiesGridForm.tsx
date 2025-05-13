
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { BrochureData } from '@/components/brochure/data-schema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ImageUploadInput } from '@/components/ui/image-upload-input';

export interface AmenitiesGridFormProps {
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
}

export const AmenitiesGridForm: React.FC<AmenitiesGridFormProps> = ({ form, disabled }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-2">
            <FormField
                control={form.control}
                name="amenitiesGridTitle"
                render={({ field }) => (
                <FormItem className="flex-grow">
                    <FormLabel>Amenities Grid Title</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Premium Facilities" {...field} value={field.value ?? ''} disabled={disabled}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
       </div>


      {/* Grid Item 1 */}
       <div className="p-3 border rounded space-y-3">
         <FormLabel>Grid Item 1</FormLabel>
        <ImageUploadInput
            form={form}
            name="amenitiesGridImage1"
            label="Image (URL or Upload)"
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel1"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Gymnasium" {...field} value={field.value ?? ''} disabled={disabled}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 2 */}
      <div className="p-3 border rounded space-y-3">
         <FormLabel>Grid Item 2</FormLabel>
        <ImageUploadInput
            form={form}
            name="amenitiesGridImage2"
            label="Image (URL or Upload)"
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel2"
            render={({ field }) => (
            <FormItem>
                 <FormLabel>Label</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Clubhouse" {...field} value={field.value ?? ''} disabled={disabled}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 3 */}
      <div className="p-3 border rounded space-y-3">
         <FormLabel>Grid Item 3</FormLabel>
        <ImageUploadInput
            form={form}
            name="amenitiesGridImage3"
            label="Image (URL or Upload)"
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel3"
            render={({ field }) => (
            <FormItem>
                 <FormLabel>Label</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Gardens" {...field} value={field.value ?? ''} disabled={disabled}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 4 */}
      <div className="p-3 border rounded space-y-3">
         <FormLabel>Grid Item 4</FormLabel>
        <ImageUploadInput
            form={form}
            name="amenitiesGridImage4"
            label="Image (URL or Upload)"
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel4"
            render={({ field }) => (
            <FormItem>
                 <FormLabel>Label</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Play Area" {...field} value={field.value ?? ''} disabled={disabled}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

       <FormField
        control={form.control}
        name="amenitiesGridDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grid Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., All images are artist's impressions." {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
