import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import type { BrochureData, AmenityGridItemData } from '@/components/brochure/data-schema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Trash2, Wand2 } from 'lucide-react';
import { ImageUploadInput } from '@/components/ui/image-upload-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface AmenitiesGridFormProps {
  form: UseFormReturn<BrochureData>;
  disabled?: boolean;
  isGeneratingAi?: boolean;
  onAiGenerate?: () => void;
}

export const AmenitiesGridForm: React.FC<AmenitiesGridFormProps> = ({ form, disabled, isGeneratingAi, onAiGenerate }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "amenitiesGridItems",
  });

  const addNewGridItem = () => {
    append({ image: '', label: 'New Amenity Feature' } as AmenityGridItemData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormField
          control={form.control}
          name="amenitiesGridTitle"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Amenities Grid Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Premium Facilities" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {onAiGenerate && (
          <Button type="button" onClick={onAiGenerate} disabled={disabled || isGeneratingAi} size="sm" variant="outline" className="ml-2 shrink-0">
            {isGeneratingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            AI Generate Title/Labels
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <FormLabel>Grid Items</FormLabel>
        {fields.map((item, index) => (
          <Card key={item.id} className="relative">
            <CardHeader className="p-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Grid Item {index + 1}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={disabled || isGeneratingAi || fields.length <= 1}
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove Item</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <ImageUploadInput
                form={form}
                name={`amenitiesGridItems.${index}.image`}
                label="Image (URL or Upload)"
              />
              <FormField
                control={form.control}
                name={`amenitiesGridItems.${index}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gymnasium" {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewGridItem}
          disabled={disabled || isGeneratingAi}
          className="mt-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Grid Item
        </Button>
      </div>

      <FormField
        control={form.control}
        name="amenitiesGridDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grid Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., All images are artist's impressions." {...field} value={field.value ?? ''} disabled={disabled || isGeneratingAi} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};