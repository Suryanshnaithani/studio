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
import { ImageUploadInput } from '@/components/ui/image-upload-input'; // Import the new component

interface AmenitiesListFormProps {
  form: UseFormReturn<BrochureData>;
}

const AmenityArrayInput: React.FC<{
    form: UseFormReturn<BrochureData>;
    name: keyof BrochureData;
    label: string;
}> = ({ form, name, label }) => {
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
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    {/* <FormLabel className="sr-only">{label} {index + 1}</FormLabel> */}
                                    <FormControl>
                                        <Input placeholder={`Amenity ${index + 1}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
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
             >
                Add Amenity
             </Button>
        </div>
    );
}


export const AmenitiesListForm: React.FC<AmenitiesListFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
       <FormField
        control={form.control}
        name="amenitiesListTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities List Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Lifestyle Amenities" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        {/* Use ImageUploadInput */}
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
              <Input placeholder="e.g., Artist's impression." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

       <AmenityArrayInput form={form} name="amenitiesWellness" label="Wellness & Leisure Amenities"/>
       <AmenityArrayInput form={form} name="amenitiesRecreation" label="Recreation Amenities"/>

    </div>
  );
};
