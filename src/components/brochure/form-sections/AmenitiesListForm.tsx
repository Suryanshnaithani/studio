
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
import { Trash2 } from 'lucide-react';
import { ImageUploadInput } from '@/components/ui/image-upload-input';
// Removed AI-related imports

export interface AmenitiesListFormProps { 
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  // Removed onGenerate, isGenerating
}

const AmenityArrayInput: React.FC<{
    form: UseFormReturn<BrochureData>;
    name: keyof BrochureData; // Type safety for name
    label: string;
    disabled?: boolean;
}> = ({ form, name, label, disabled }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: name as any, // Cast for complex array names if TS struggles
    });

    return (
        <div>
            <FormLabel>{label}</FormLabel>
            <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name={`${name}.${index}` as any} // Cast for nested array field
                            render={({ field: arrayField }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder={`Amenity ${index + 1}`} {...arrayField} value={arrayField.value ?? ''} disabled={disabled}/>
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
                Add Amenity
             </Button>
        </div>
    );
}


export const AmenitiesListForm: React.FC<AmenitiesListFormProps> = ({ form, disabled }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-2">
         <FormField
            control={form.control}
            name="amenitiesListTitle"
            render={({ field }) => (
            <FormItem className="flex-grow">
                <FormLabel>Amenities List Title</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Lifestyle Amenities" {...field} value={field.value ?? ''} disabled={disabled}/>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
         />
         {/* Removed AI Generation Button */}
      </div>
       <ImageUploadInput
            form={form}
            name="amenitiesListImage"
            label="Amenities List Image (URL or Upload)"
       />
       <FormField
        control={form.control}
        name="amenitiesListImageDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities List Image Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Artist's impression." {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

       <AmenityArrayInput form={form} name="amenitiesWellness" label="Wellness & Leisure Amenities" disabled={disabled} />
       <AmenityArrayInput form={form} name="amenitiesRecreation" label="Recreation Amenities" disabled={disabled} />

    </div>
  );
};
