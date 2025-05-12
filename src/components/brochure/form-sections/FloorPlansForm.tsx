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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FloorPlansFormProps {
  form: UseFormReturn<BrochureData>;
}

export const FloorPlansForm: React.FC<FloorPlansFormProps> = ({ form }) => {
   const { fields, append, remove } = useFieldArray({
     control: form.control,
     name: "floorPlans",
   });

  return (
    <div className="space-y-4">
       <FormField
        control={form.control}
        name="floorPlansTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Floor Plans Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Thoughtfully Designed Floor Plans" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

       {/* Floor Plans Array */}
      <div className="space-y-4">
        <FormLabel>Floor Plans</FormLabel>
        {fields.map((field, index) => (
           <Card key={field.id} className="relative pt-6">
             <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
             >
                <Trash2 className="h-4 w-4" />
             </Button>
             <CardContent className="space-y-3">
                <FormField
                    control={form.control}
                    name={`floorPlans.${index}.name`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Plan Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Luxury 2 Bedroom" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name={`floorPlans.${index}.area`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Area</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 1,200 sq. ft." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name={`floorPlans.${index}.image`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                        <Input type="url" placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {/* Features Sub-Array */}
                 <FeatureArrayInput form={form} planIndex={index} />
             </CardContent>
           </Card>
        ))}
         <Button
           type="button"
           variant="outline"
           size="sm"
           className="mt-2"
           onClick={() => append({ id: `fp${Date.now()}`, name: '', area: '', features: [''], image: '' })}
         >
           Add Floor Plan
         </Button>
      </div>

      <FormField
        control={form.control}
        name="floorPlansDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Floor Plans Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Floor plans are indicative..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};


// Sub-component for managing features within a floor plan
const FeatureArrayInput: React.FC<{ form: UseFormReturn<BrochureData>, planIndex: number }> = ({ form, planIndex }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `floorPlans.${planIndex}.features`,
    });

    return (
        <div>
            <FormLabel>Features</FormLabel>
            <div className="space-y-2 mt-1">
                {fields.map((field, featureIndex) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name={`floorPlans.${planIndex}.features.${featureIndex}`}
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    {/* <FormLabel className="sr-only">Feature {featureIndex + 1}</FormLabel> */}
                                    <FormControl>
                                        <Input placeholder={`Feature ${featureIndex + 1}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={() => remove(featureIndex)}>
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
                Add Feature
            </Button>
        </div>
    );
}
