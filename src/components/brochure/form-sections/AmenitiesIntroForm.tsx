import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
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

interface AmenitiesIntroFormProps {
  form: UseFormReturn<BrochureData>;
}

export const AmenitiesIntroForm: React.FC<AmenitiesIntroFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="amenitiesIntroTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., World-Class Amenities" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="amenitiesIntroP1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Paragraph 1</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the amenities..." {...field} rows={4}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="amenitiesIntroP2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Paragraph 2</FormLabel>
            <FormControl>
              <Textarea placeholder="Highlight key features..." {...field} rows={4}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="amenitiesIntroP3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Paragraph 3</FormLabel>
            <FormControl>
              <Textarea placeholder="Further details..." {...field} rows={4}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        <FormField
        control={form.control}
        name="amenitiesIntroWatermark"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Intro Watermark Image URL</FormLabel>
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
