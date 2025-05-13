
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

export interface ConnectivityFormProps { // Exporting the interface
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  isGeneratingAi?: boolean;
  onAiGenerate?: () => void;
}

const PointOfInterestArrayInput: React.FC<{
    form: UseFormReturn<BrochureData>;
    name: keyof BrochureData;
    label: string;
    disabled?: boolean;
    isGeneratingAi?: boolean;
}> = ({ form, name, label, disabled, isGeneratingAi }) => {
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
                                    {index === 0 ? (
                                        <FormControl>
                                            <Input placeholder="Category (e.g., Business Hubs)" {...arrayField} value={arrayField.value ?? ''} className="font-semibold" disabled={disabled || isGeneratingAi} />
                                        </FormControl>
                                    ) : (
                                         <FormControl>
                                            <Input placeholder={`Point ${index}`} {...arrayField} value={arrayField.value ?? ''} disabled={disabled || isGeneratingAi}/>
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {index > 0 && ( 
                            <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} disabled={disabled || isGeneratingAi}>
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
                disabled={disabled || isGeneratingAi}
            >
                Add Point
            </Button>
        </div>
    );
}

export const ConnectivityForm: React.FC<ConnectivityFormProps> = ({ form, disabled, isGeneratingAi, onAiGenerate }) => {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Connectivity Details</h3>
        {onAiGenerate && (
            <Button type="button" onClick={onAiGenerate} disabled={disabled || isGeneratingAi} size="sm" variant="outline" className="ml-2 shrink-0">
                {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                AI Generate
            </Button>
        )}
      </div>
      <FormField
        control={form.control}
        name="connectivityTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Connectivity Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Exceptional Connectivity" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PointOfInterestArrayInput form={form} name="connectivityPointsBusiness" label="Points of Interest: Business" disabled={disabled} isGeneratingAi={isGeneratingAi}/>
      <PointOfInterestArrayInput form={form} name="connectivityPointsHealthcare" label="Points of Interest: Healthcare" disabled={disabled} isGeneratingAi={isGeneratingAi}/>
      <PointOfInterestArrayInput form={form} name="connectivityPointsEducation" label="Points of Interest: Education" disabled={disabled} isGeneratingAi={isGeneratingAi}/>
      <PointOfInterestArrayInput form={form} name="connectivityPointsLeisure" label="Points of Interest: Leisure" disabled={disabled} isGeneratingAi={isGeneratingAi}/>

      <FormField
        control={form.control}
        name="connectivityNote"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Connectivity Note</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Connectivity subject to change..." {...field} value={field.value ?? ''} rows={2} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
              <Input placeholder="e.g., Central District" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <ImageUploadInput
            form={form}
            name="connectivityWatermark"
            label="Connectivity Watermark (URL or Upload)"
       />
    </div>
  );
};
