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
import { Trash2 } from 'lucide-react';
import { ImageUploadInput } from '@/components/ui/image-upload-input'; // Import the new component

interface ConnectivityFormProps {
  form: UseFormReturn<BrochureData>;
}

const PointOfInterestArrayInput: React.FC<{
    form: UseFormReturn<BrochureData>;
    name: keyof BrochureData;
    label: string;
}> = ({ form, name, label }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        // @ts-ignore // Type assertion needed here due to dynamic name
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
                                    {index === 0 ? (
                                        <FormControl>
                                            <Input placeholder="Category (e.g., Business Hubs)" {...field} className="font-semibold" />
                                        </FormControl>
                                    ) : (
                                         <FormControl>
                                            <Input placeholder={`Point ${index}`} {...field} />
                                        </FormControl>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {index > 0 && ( // Don't allow removing the category title
                            <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
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
                Add Point
            </Button>
        </div>
    );
}

export const ConnectivityForm: React.FC<ConnectivityFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="connectivityTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Connectivity Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Exceptional Connectivity" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PointOfInterestArrayInput form={form} name="connectivityPointsBusiness" label="Points of Interest: Business"/>
      <PointOfInterestArrayInput form={form} name="connectivityPointsHealthcare" label="Points of Interest: Healthcare"/>
      <PointOfInterestArrayInput form={form} name="connectivityPointsEducation" label="Points of Interest: Education"/>
      <PointOfInterestArrayInput form={form} name="connectivityPointsLeisure" label="Points of Interest: Leisure"/>

      <FormField
        control={form.control}
        name="connectivityNote"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Connectivity Note</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Connectivity subject to change..." {...field} rows={2}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       {/* Use ImageUploadInput */}
       <ImageUploadInput
            form={form}
            name="connectivityImage"
            label="Connectivity Image (URL or Upload)"
       />
      <FormField
        control={form.control}
        name="connectivityDistrictLabel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>District Label on Image</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Central District" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        {/* Use ImageUploadInput */}
       <ImageUploadInput
            form={form}
            name="connectivityWatermark"
            label="Connectivity Watermark (URL or Upload)"
       />
    </div>
  );
};
