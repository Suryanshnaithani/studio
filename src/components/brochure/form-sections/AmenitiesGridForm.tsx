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

interface AmenitiesGridFormProps {
  form: UseFormReturn<BrochureData>;
}

export const AmenitiesGridForm: React.FC<AmenitiesGridFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
       <FormField
        control={form.control}
        name="amenitiesGridTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities Grid Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Premium Facilities" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Grid Item 1 */}
       <div className="grid grid-cols-2 gap-4 p-3 border rounded">
        <FormField
            control={form.control}
            name="amenitiesGridImage1"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Grid Image 1 URL</FormLabel>
                <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel1"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Grid Label 1</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Gymnasium" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 2 */}
       <div className="grid grid-cols-2 gap-4 p-3 border rounded">
        <FormField
            control={form.control}
            name="amenitiesGridImage2"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Grid Image 2 URL</FormLabel>
                <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel2"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Grid Label 2</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Clubhouse" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 3 */}
       <div className="grid grid-cols-2 gap-4 p-3 border rounded">
        <FormField
            control={form.control}
            name="amenitiesGridImage3"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Grid Image 3 URL</FormLabel>
                <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel3"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Grid Label 3</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Gardens" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

      {/* Grid Item 4 */}
       <div className="grid grid-cols-2 gap-4 p-3 border rounded">
        <FormField
            control={form.control}
            name="amenitiesGridImage4"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Grid Image 4 URL</FormLabel>
                <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="amenitiesGridLabel4"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Grid Label 4</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Play Area" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
       </div>

       <FormField
        control={form.control}
        name="amenitiesGridDisclaimer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grid Disclaimer</FormLabel>
            <FormControl>
              <Input placeholder="e.g., All images are artist's impressions." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
