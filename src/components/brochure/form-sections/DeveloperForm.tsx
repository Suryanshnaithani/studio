
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

export interface DeveloperFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  onGenerateContent: () => Promise<void>;
  isGeneratingContent: boolean;
  disabled?: boolean;
}

export const DeveloperForm: React.FC<DeveloperFormProps> = ({ form, onGenerateContent, isGeneratingContent, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Developer Details</h3>
        <Button 
          type="button" 
          onClick={onGenerateContent} 
          disabled={isGeneratingContent || disabled}
          variant="outline"
          size="sm"
          title="Generate developer descriptions using AI"
        >
          {isGeneratingContent ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isGeneratingContent ? 'Generating...' : 'AI Generate Desc.'}
        </Button>
      </div>

      <FormField
        control={form.control}
        name="developerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Premier Developers" {...field} value={field.value ?? ''} disabled={disabled}/>
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
              <Textarea placeholder="About the developer..." {...field} value={field.value ?? ''} rows={3} disabled={disabled}/>
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
              <Textarea placeholder="More details..." {...field} value={field.value ?? ''} rows={3} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <ImageUploadInput
            form={form}
            name="developerImage"
            label="Developer Background Image (URL or Upload)"
       />
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
              <Input placeholder="e.g., Artist's impression" {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
