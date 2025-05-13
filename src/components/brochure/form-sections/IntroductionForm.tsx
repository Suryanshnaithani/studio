
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
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';

export interface IntroductionFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  onGenerateIntro: () => Promise<void>;
  isGeneratingIntro: boolean;
  disabled?: boolean; // General disabled state for all inputs/buttons in this form section
}

export const IntroductionForm: React.FC<IntroductionFormProps> = ({ form, onGenerateIntro, isGeneratingIntro, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Introduction Content</FormLabel>
        <Button 
          type="button" 
          onClick={onGenerateIntro} 
          disabled={isGeneratingIntro || disabled}
          variant="outline"
          size="sm"
          title="Generate introduction using AI based on project name and other details"
        >
          {isGeneratingIntro ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isGeneratingIntro ? 'Generating...' : 'AI Generate Intro'}
        </Button>
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
            // ImageUploadInput should internally handle its own disabled state if necessary, or accept 'disabled' prop
       />
    </div>
  );
};

    