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

interface DeveloperFormProps {
  form: UseFormReturn<BrochureData>;
}

export const DeveloperForm: React.FC<DeveloperFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="developerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Premier Developers" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="developerDesc1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Description 1</FormLabel>
            <FormControl>
              <Textarea placeholder="About the developer..." {...field} rows={3}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="developerDesc2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Description 2</FormLabel>
            <FormControl>
              <Textarea placeholder="More details..." {...field} rows={3}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="developerImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Background Image URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="developerLogo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Logo URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="developerDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer Image Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Artist's impression" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
