
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
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadInput } from '@/components/ui/image-upload-input';

export interface AmenitiesIntroFormProps { 
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
}

export const AmenitiesIntroForm: React.FC<AmenitiesIntroFormProps> = ({ form, disabled }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Amenities Introduction</h3>
      </div>
      <FormField
        control={form.control}
        name="amenitiesIntroTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., World-Class Amenities" {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="amenitiesIntroP1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Paragraph 1</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the amenities..." {...field} value={field.value ?? ''} rows={4} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="amenitiesIntroP2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Paragraph 2</FormLabel>
            <FormControl>
              <Textarea placeholder="Highlight key features..." {...field} value={field.value ?? ''} rows={4} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="amenitiesIntroP3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Paragraph 3</FormLabel>
            <FormControl>
              <Textarea placeholder="Further details..." {...field} value={field.value ?? ''} rows={4} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <ImageUploadInput
            form={form}
            name="amenitiesIntroWatermark"
            label="Amenities Intro Watermark (URL or Upload)"
       />
    </div>
  );
};
