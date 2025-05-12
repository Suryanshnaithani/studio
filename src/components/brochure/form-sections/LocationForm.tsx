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

interface LocationFormProps {
  form: UseFormReturn<BrochureData>;
}

export const LocationForm: React.FC<LocationFormProps> = ({ form }) => {
   const { fields, append, remove } = useFieldArray({
     control: form.control,
     name: "keyDistances",
   });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="locationTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Prime Location" {...field} />
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
              <Textarea placeholder="Describe the location..." {...field} rows={3}/>
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
              <Textarea placeholder="More details about connectivity..." {...field} rows={3}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Key Distances */}
      <div>
        <FormLabel>Key Distances</FormLabel>
        <div className="space-y-2 mt-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
               <FormField
                control={form.control}
                name={`keyDistances.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    {/* <FormLabel className="sr-only">Distance {index + 1}</FormLabel> */}
                    <FormControl>
                      <Input placeholder={`e.g., Metro Station - 500m`} {...field} />
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
           Add Distance
         </Button>
      </div>

      <FormField
        control={form.control}
        name="locationMapImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Map Image URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mapDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Map Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., *Map not to scale." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="locationWatermark"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Watermark Image URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
