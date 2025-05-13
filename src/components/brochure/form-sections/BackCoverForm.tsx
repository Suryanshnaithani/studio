
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

interface BackCoverFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  isGeneratingAi?: boolean;
  onAiGenerate?: () => void;
}

export const BackCoverForm: React.FC<BackCoverFormProps> = ({ form, disabled, isGeneratingAi, onAiGenerate }) => {
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
       <ImageUploadInput
            form={form}
            name="backCoverImage"
            label="Back Cover Image (URL or Upload)"
       />
       <ImageUploadInput
            form={form}
            name="backCoverLogo"
            label="Back Cover Logo (URL or Upload)"
       />
       <FormField
        control={form.control}
        name="callToAction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Call To Action Text</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Experience Luxury Living" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="contactTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Info Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Contact Us" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="+91..." {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="sales@..." {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="contactWebsite"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Website</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="contactAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Address / Visit Info</FormLabel>
            <FormControl>
              <Input placeholder="Experience Center, ..." {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="fullDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Disclaimer</FormLabel>
            <FormControl>
              <Textarea placeholder="This brochure is conceptual..." {...field} value={field.value ?? ''} rows={5} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="reraDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RERA Disclaimer (repeat)</FormLabel>
            <FormControl>
              <Textarea placeholder="RERA Registration No..." {...field} value={field.value ?? ''} rows={2} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
