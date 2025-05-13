
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
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { ImageUploadInput } from '@/components/ui/image-upload-input';

export interface AmenitiesGridFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  isGeneratingAi?: boolean;
  onAiGenerate?: () => void;
}

export const AmenitiesGridForm: React.FC<AmenitiesGridFormProps> = ({ form, disabled, isGeneratingAi, onAiGenerate }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-2">
            <FormField
                control={form.control}
                name="amenitiesGridTitle"
                render={({ field }) => (
                <FormItem className="flex-grow">
                    <FormLabel>Amenities Grid Title</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Premium Facilities" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            {onAiGenerate && (
                <Button type="button" onClick={onAiGenerate} disabled={disabled || isGeneratingAi} size="sm" variant="outline" className="ml-2 shrink-0">
                    {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    AI Generate
                </Button>
            )}
       </div>


      {/* Grid Item 1 */}
       <div className="p-3 border rounded space-y-3">
         <FormLabel>Grid Item 1</FormLabel>
        <ImageUploadInput
            form={form}
            name="amenitiesGridImage1"
            label="Image (URL or Upload)"
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel1"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Gymnasium" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 2 */}
      <div className="p-3 border rounded space-y-3">
         <FormLabel>Grid Item 2</FormLabel>
        <ImageUploadInput
            form={form}
            name="amenitiesGridImage2"
            label="Image (URL or Upload)"
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel2"
            render={({ field }) => (
            <FormItem>
                 <FormLabel>Label</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Clubhouse" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 3 */}
      <div className="p-3 border rounded space-y-3">
         <FormLabel>Grid Item 3</FormLabel>
        <ImageUploadInput
            form={form}
            name="amenitiesGridImage3"
            label="Image (URL or Upload)"
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel3"
            render={({ field }) => (
            <FormItem>
                 <FormLabel>Label</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Gardens" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 4 */}
      <div className="p-3 border rounded space-y-3">
         <FormLabel>Grid Item 4</FormLabel>
        <ImageUploadInput
            form={form}
            name="amenitiesGridImage4"
            label="Image (URL or Upload)"
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel4"
            render={({ field }) => (
            <FormItem>
                 <FormLabel>Label</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Play Area" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

       <FormField
        control={form.control}
        name="amenitiesGridDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grid Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., All images are artist's impressions." {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
