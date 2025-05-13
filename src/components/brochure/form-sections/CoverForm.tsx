
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

interface CoverFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  isGeneratingAi?: boolean;
  onAiGenerate?: () => void;
}

export const CoverForm: React.FC<CoverFormProps> = ({ form, disabled, isGeneratingAi, onAiGenerate }) => {
  return (
    <div className="space-y-4">
        <div className="flex justify-end items-center mb-2">
         {onAiGenerate && (
            <Button type="button" onClick={onAiGenerate} disabled={disabled || isGeneratingAi} size="sm" variant="outline" className="shrink-0">
                {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Enhance
            </Button>
        )}
       </div>
      <FormField
        control={form.control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Luxury Residences" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
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
              <Input placeholder="e.g., Where Elegance Meets Modern Living" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
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
              <Textarea placeholder="RERA Registration No..." {...field} value={field.value ?? ''} rows={3} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
