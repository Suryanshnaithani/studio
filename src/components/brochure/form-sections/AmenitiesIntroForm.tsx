
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
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { ImageUploadInput } from '@/components/ui/image-upload-input';

export interface AmenitiesIntroFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  isGeneratingAi?: boolean;
  onAiGenerate?: () => void;
}

export const AmenitiesIntroForm: React.FC<AmenitiesIntroFormProps> = ({ form, disabled, isGeneratingAi, onAiGenerate }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Amenities Introduction</h3>
        {onAiGenerate && (
            <Button type="button" onClick={onAiGenerate} disabled={disabled || isGeneratingAi} size="sm" variant="outline" className="ml-2 shrink-0">
                {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Generate
            </Button>
        )}
      </div>
      <FormField
        control={form.control}
        name="amenitiesIntroTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., World-Class Amenities" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
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
              <Textarea placeholder="Describe the amenities..." {...field} value={field.value ?? ''} rows={4} disabled={disabled || isGeneratingAi}/>
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
              <Textarea placeholder="Highlight key features..." {...field} value={field.value ?? ''} rows={4} disabled={disabled || isGeneratingAi}/>
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
              <Textarea placeholder="Further details..." {...field} value={field.value ?? ''} rows={4} disabled={disabled || isGeneratingAi}/>
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
