
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
// Removed AI-related imports: Button, Loader2, Wand2

export interface MasterPlanFormProps { 
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  // Removed onGenerate, isGenerating
}

export const MasterPlanForm: React.FC<MasterPlanFormProps> = ({ form, disabled }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Master Plan Details</h3>
            {/* Removed AI Generation Button */}
       </div>
       <FormField
        control={form.control}
        name="masterPlanTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Master Plan Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Master Plan" {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
              <Input placeholder="e.g., Artist's impression. Not to scale." {...field} value={field.value ?? ''} disabled={disabled}/>
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
              <Textarea placeholder="Describe the master plan..." {...field} value={field.value ?? ''} rows={3} disabled={disabled}/>
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
              <Textarea placeholder="Highlight key aspects..." {...field} value={field.value ?? ''} rows={3} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
