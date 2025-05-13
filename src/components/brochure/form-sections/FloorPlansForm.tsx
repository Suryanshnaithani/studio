
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
import { Card, CardContent } from '@/components/ui/card';
import { ImageUploadInput } from '@/components/ui/image-upload-input';

export interface FloorPlansFormProps { 
  form: UseFormReturn<BrochureData>;
  onGenerateContent: () => Promise<void>;
  isGeneratingContent: boolean;
  disabled?: boolean;
}

export const FloorPlansForm: React.FC<FloorPlansFormProps> = ({ form, onGenerateContent, isGeneratingContent, disabled }) => {
   const { fields, append, remove } = useFieldArray({
     control: form.control,
     name: "floorPlans",
   });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <FormField
            control={form.control}
            name="floorPlansTitle"
            render={({ field }) => (
            <FormItem className="flex-grow">
                <FormLabel>Floor Plans Title</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Thoughtfully Designed Floor Plans" {...field} value={field.value ?? ''} disabled={disabled}/>
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
          title="Use AI to refine the floor plans title"
          className="ml-2 mt-6" 
        >
          {isGeneratingContent ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isGeneratingContent ? 'Working...' : 'AI Refine Title'}
        </Button>
      </div>


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
                disabled={disabled}
             >
                <Trash2 className="h-4 w-4" />
             </Button>
             <CardContent className="space-y-3">
                <FormField
                    control={form.control}
                    name={`floorPlans.${index}.name`}
                    render={({ field: arrayField }) => (
                    <FormItem>
                        <FormLabel>Plan Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Luxury 2 Bedroom" {...arrayField} value={arrayField.value ?? ''} disabled={disabled}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name={`floorPlans.${index}.area`}
                    render={({ field: arrayField }) => (
                    <FormItem>
                        <FormLabel>Area</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 1,200 sq. ft." {...arrayField} value={arrayField.value ?? ''} disabled={disabled}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <ImageUploadInput
                    form={form}
                    name={`floorPlans.${index}.image`}
                    label="Image (URL or Upload)"
                />
                 <FeatureArrayInput form={form} planIndex={index} disabled={disabled}/>
             </CardContent>
           </Card>
        ))}
         <Button
           type="button"
           variant="outline"
           size="sm"
           className="mt-2"
           onClick={() => append({
                id: `fp${Date.now()}`,
                name: 'New Floor Plan', 
                area: '0 sq. ft.', 
                features: ['New Feature'], 
                image: '' 
            })}
            disabled={disabled}
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
              <Input placeholder="e.g., Floor plans are indicative..." {...field} value={field.value ?? ''} disabled={disabled}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};


const FeatureArrayInput: React.FC<{ form: UseFormReturn<BrochureData>, planIndex: number, disabled?: boolean }> = ({ form, planIndex, disabled }) => {
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
                            render={({ field: arrayField }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder={`Feature ${featureIndex + 1}`} {...arrayField} value={arrayField.value ?? ''} disabled={disabled}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={() => remove(featureIndex)} disabled={disabled || fields.length <= 1}>
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
                onClick={() => append("New Feature")}
                disabled={disabled}
            >
                Add Feature
            </Button>
        </div>
    );
}
