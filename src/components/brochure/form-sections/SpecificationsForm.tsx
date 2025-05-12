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

interface SpecificationsFormProps {
  form: UseFormReturn<BrochureData>;
}

const SpecArrayInput: React.FC<{
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
                                        <Input placeholder={`Specification ${index + 1}`} {...field} />
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
                Add Specification
             </Button>
        </div>
    );
}


export const SpecificationsForm: React.FC<SpecificationsFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="specsTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specifications Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Premium Specifications" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="specsImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specifications Image URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="specsImageDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specifications Image Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Artist's impression." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

       <SpecArrayInput form={form} name="specsInterior" label="Interior Specifications"/>
       <SpecArrayInput form={form} name="specsBuilding" label="Building Features"/>

       <FormField
        control={form.control}
        name="specsWatermark"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specs Watermark Image URL</FormLabel>
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
