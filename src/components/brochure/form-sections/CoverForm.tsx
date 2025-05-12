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

interface CoverFormProps {
  form: UseFormReturn<BrochureData>;
}

export const CoverForm: React.FC<CoverFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Luxury Residences" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="projectTagline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Tagline</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Where Elegance Meets Modern Living" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="coverImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Image URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="projectLogo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Logo URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="reraInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RERA Information (use line breaks)</FormLabel>
            <FormControl>
              <Textarea placeholder="RERA Registration No..." {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
