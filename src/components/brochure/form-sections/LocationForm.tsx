
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from "react-hook-form";
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
import { Loader2, Trash2, Wand2 } from 'lucide-react';
import { ImageUploadInput } from '@/components/ui/image-upload-input';

export interface LocationFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  onGenerateContent: () => Promise<void>;
  isGeneratingContent: boolean;
  disabled?: boolean;
}

export const LocationForm: React.FC<LocationFormProps> = ({ form, onGenerateContent, isGeneratingContent, disabled }) => {
   const { fields, append, remove } = useFieldArray({
     control: form.control,
     name: "keyDistances",
   });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Location Details</h3>
        <Button 
          type="button" 
          onClick={onGenerateContent} 
          disabled={isGeneratingContent || disabled}
          variant="outline"
          size="sm"
          title="Use AI to generate location descriptions and note based on entered data"
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
        name="locationTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Prime Location" {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="locationDesc1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Description 1</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the location..." {...field} value={field.value ?? ''} rows={3} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="locationDesc2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Description 2</FormLabel>
            <FormControl>
              <Textarea placeholder="More details about connectivity..." {...field} value={field.value ?? ''} rows={3} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Key Distances</FormLabel>
        <div className="space-y-2 mt-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
               <FormField
                control={form.control}
                name={`keyDistances.${index}`}
                render={({ field: arrayField }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder={`e.g., Metro Station - 500m`} {...arrayField} value={arrayField.value ?? ''} disabled={disabled}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} disabled={disabled}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
         <Button
           type="button"
           variant="outline"
           size="sm"
           className="mt-2"
           onClick={() => append("")}
           disabled={disabled}
         >
           Add Distance
         </Button>
      </div>
       <FormField
        control={form.control}
        name="locationNote"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Note (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Brief note about the location or distances..." {...field} value={field.value ?? ''} rows={2} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ImageUploadInput
        form={form}
        name="locationMapImage"
        label="Location Map Image (URL or Upload)"
      />

      <FormField
        control={form.control}
        name="mapDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Map Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., *Map not to scale." {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <ImageUploadInput
            form={form}
            name="locationWatermark"
            label="Location Watermark (URL or Upload)"
       />
    </div>
  );
};
