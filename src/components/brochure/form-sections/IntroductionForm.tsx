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

interface IntroductionFormProps {
  form: UseFormReturn<BrochureData>;
}

export const IntroductionForm: React.FC<IntroductionFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
       <FormField
        control={form.control}
        name="introTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Introduction Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Welcome to..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="introParagraph1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Introduction Paragraph 1</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the project..." {...field} rows={4}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="introParagraph2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Introduction Paragraph 2</FormLabel>
            <FormControl>
              <Textarea placeholder="Highlight key aspects..." {...field} rows={4}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="introParagraph3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Introduction Paragraph 3</FormLabel>
            <FormControl>
              <Textarea placeholder="Further details..." {...field} rows={4}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       {/* Use ImageUploadInput */}
       <ImageUploadInput
            form={form}
            name="introWatermark"
            label="Intro Watermark (URL or Upload)"
       />
    </div>
  );
};
