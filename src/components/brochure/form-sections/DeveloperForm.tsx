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
import { ImageUploadInput } from '@/components/ui/image-upload-input'; // Import the new component

interface DeveloperFormProps {
  form: UseFormReturn<BrochureData>;
}

export const DeveloperForm: React.FC<DeveloperFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="developerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Premier Developers" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="developerDesc1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Description 1</FormLabel>
            <FormControl>
              <Textarea placeholder="About the developer..." {...field} rows={3}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="developerDesc2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Description 2</FormLabel>
            <FormControl>
              <Textarea placeholder="More details..." {...field} rows={3}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       {/* Use ImageUploadInput */}
       <ImageUploadInput
            form={form}
            name="developerImage"
            label="Developer Background Image (URL or Upload)"
       />
       {/* Use ImageUploadInput */}
       <ImageUploadInput
            form={form}
            name="developerLogo"
            label="Developer Logo (URL or Upload)"
       />
      <FormField
        control={form.control}
        name="developerDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Image Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Artist's impression" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
