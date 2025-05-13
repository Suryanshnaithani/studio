
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
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Wand2 } from 'lucide-react';
import { ImageUploadInput from '@/components/ui/image-upload-input';

export interface SpecificationsFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  onGenerateContent: () => Promise<void>;
  isGeneratingContent: boolean;
  disabled?: boolean;
}

const SpecArrayInput: React.FC<{
    form: UseFormReturn<BrochureData>;
    name: keyof BrochureData;
    label: string;
    disabled?: boolean;
}> = ({ form, name, label, disabled }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        // @ts-ignore
        name: name as any,
    });

    return (
        <div>
            <FormLabel>{label}</FormLabel>
            <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                             // @ts-ignore
                            name={`${name}.${index}`}
                            render={({ field: arrayField }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder={`Specification ${index + 1}`} {...arrayField} value={arrayField.value ?? ''} disabled={disabled}/>
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
                Add Specification
             </Button>
        </div>
    );
}


export const SpecificationsForm: React.FC<SpecificationsFormProps> = ({ form, onGenerateContent, isGeneratingContent, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
         <FormField
            control={form.control}
            name="specsTitle"
            render={({ field }) => (
            <FormItem className="flex-grow">
                <FormLabel>Specifications Title</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Premium Specifications" {...field} value={field.value ?? ''} disabled={disabled}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
         />
        <Button 
          type="button" 
          onClick={onGenerateContent} 
          disabled={isGeneratingContent || disabled}
          variant="outline"
          size="sm"
          title="Use AI to refine the specifications title"
          className="ml-2 mt-6" // Adjust margin for alignment
        >
          {isGeneratingContent ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isGeneratingContent ? 'Working...' : 'AI Refine Title'}
        </Button>
      </div>
       <ImageUploadInput
            form={form}
            name="specsImage"
            label="Specifications Image (URL or Upload)"
       />
      <FormField
        control={form.control}
        name="specsImageDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specifications Image Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Artist's impression." {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

       <SpecArrayInput form={form} name="specsInterior" label="Interior Specifications" disabled={disabled}/>
       <SpecArrayInput form={form} name="specsBuilding" label="Building Features" disabled={disabled}/>

       <ImageUploadInput
            form={form}
            name="specsWatermark"
            label="Specs Watermark (URL or Upload)"
       />

    </div>
  );
};
