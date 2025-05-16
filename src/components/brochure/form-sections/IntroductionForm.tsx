
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

export interface IntroductionFormProps { 
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  // Removed onGenerateIntro, isGeneratingIntro
}

export const IntroductionForm: React.FC<IntroductionFormProps> = ({ form, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Introduction Details</h3>
        {/* Removed AI Generation Button */}
      </div>

       <FormField
        control={form.control}
        name="introTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Introduction Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Welcome to..." {...field} value={field.value ?? ''} disabled={disabled}/>
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
              <Textarea placeholder="Describe the project..." {...field} value={field.value ?? ''} rows={4} disabled={disabled}/>
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
              <Textarea placeholder="Highlight key aspects..." {...field} value={field.value ?? ''} rows={4} disabled={disabled}/>
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
              <Textarea placeholder="Further details..." {...field} value={field.value ?? ''} rows={4} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <ImageUploadInput
            form={form}
            name="introWatermark"
            label="Intro Watermark (URL or Upload)"
       />
    </div>
  );
};
