
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

interface CoverFormProps {
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
}

export const CoverForm: React.FC<CoverFormProps> = ({ form, disabled }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Luxury Residences" {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="projectTagline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Tagline</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Where Elegance Meets Modern Living" {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        <ImageUploadInput
            form={form}
            name="coverImage"
            label="Cover Image (URL or Upload)"
        />
       <ImageUploadInput
            form={form}
            name="projectLogo"
            label="Project Logo (URL or Upload)"
       />
       <FormField
        control={form.control}
        name="reraInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RERA Information (use line breaks)</FormLabel>
            <FormControl>
              <Textarea placeholder="RERA Registration No..." {...field} value={field.value ?? ''} rows={3} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

