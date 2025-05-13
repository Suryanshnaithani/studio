
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
import { Loader2, Wand2 from 'lucide-react';

export interface MasterPlanFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  onGenerateContent: () => Promise<void>;
  isGeneratingContent: boolean;
  disabled?: boolean;
}

export const MasterPlanForm: React.FC<MasterPlanFormProps> = ({ form, onGenerateContent, isGeneratingContent, disabled }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Master Plan Details</h3>
            <Button 
            type="button" 
            onClick={onGenerateContent} 
            disabled={isGeneratingContent || disabled}
            variant="outline"
            size="sm"
            title="Use AI to generate master plan descriptions"
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
