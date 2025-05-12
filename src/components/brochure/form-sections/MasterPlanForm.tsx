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

interface MasterPlanFormProps {
  form: UseFormReturn<BrochureData>;
}

export const MasterPlanForm: React.FC<MasterPlanFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
       <FormField
        control={form.control}
        name="masterPlanTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Master Plan Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Master Plan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        {/* Use ImageUploadInput */}
       <ImageUploadInput
            form={form}
            name="masterPlanImage"
            label="Master Plan Image (URL or Upload)"
       />
       <FormField
        control={form.control}
        name="masterPlanImageDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Master Plan Image Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Artist's impression. Not to scale." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="masterPlanDesc1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Master Plan Description 1</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the master plan..." {...field} rows={3}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="masterPlanDesc2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Master Plan Description 2</FormLabel>
            <FormControl>
              <Textarea placeholder="Highlight key aspects..." {...field} rows={3}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
