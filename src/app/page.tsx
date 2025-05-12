'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrochureDataSchema, type BrochureData, getDefaultBrochureData } from '@/components/brochure/data-schema';
import { BrochurePreview } from '@/components/brochure/brochure-preview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

// Import Form Section Components Dynamically or Statically
import { CoverForm } from '@/components/brochure/form-sections/CoverForm';
import { IntroductionForm } from '@/components/brochure/form-sections/IntroductionForm';
import { DeveloperForm } from '@/components/brochure/form-sections/DeveloperForm';
import { LocationForm } from '@/components/brochure/form-sections/LocationForm';
import { ConnectivityForm } from '@/components/brochure/form-sections/ConnectivityForm';
import { AmenitiesIntroForm } from '@/components/brochure/form-sections/AmenitiesIntroForm';
import { AmenitiesListForm } from '@/components/brochure/form-sections/AmenitiesListForm';
import { AmenitiesGridForm } from '@/components/brochure/form-sections/AmenitiesGridForm';
import { SpecificationsForm } from '@/components/brochure/form-sections/SpecificationsForm';
import { MasterPlanForm } from '@/components/brochure/form-sections/MasterPlanForm';
import { FloorPlansForm } from '@/components/brochure/form-sections/FloorPlansForm';
import { BackCoverForm } from '@/components/brochure/form-sections/BackCoverForm';

// Import brochure specific CSS
import './brochure.css';

export default function Home() {
  const [brochureData, setBrochureData] = useState<BrochureData>(getDefaultBrochureData());
  const [isClient, setIsClient] = useState(false);

  const form = useForm<BrochureData>({
    resolver: zodResolver(BrochureDataSchema),
    defaultValues: getDefaultBrochureData(),
    mode: 'onChange', // Update preview on change
  });

  useEffect(() => {
    setIsClient(true); // Indicate component has mounted
    const subscription = form.watch((value) => {
       // Ensure value is treated as BrochureData
       // Use safe parsing to handle potential partial updates during typing
      try {
        const parsedData = BrochureDataSchema.partial().parse(value);
        // Merge parsed data with existing state to maintain defaults for untouched fields
         setBrochureData(prevData => ({ ...prevData, ...parsedData as Partial<BrochureData>}));
      } catch (error) {
        // Handle potential Zod errors during watch if needed, though mode: 'onChange'
        // and resolver should handle most validation states via formState.
        console.warn("Form watch update error:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form]); // Depend on form.watch

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Prevent rendering potentially mismatched content during SSR/hydration
  if (!isClient) {
    return null; // Or a loading indicator
  }

  const formSections = [
    { value: 'cover', label: 'Cover', Component: CoverForm },
    { value: 'intro', label: 'Introduction', Component: IntroductionForm },
    { value: 'developer', label: 'Developer', Component: DeveloperForm },
    { value: 'location', label: 'Location', Component: LocationForm },
    { value: 'connectivity', label: 'Connectivity', Component: ConnectivityForm },
    { value: 'amenities-intro', label: 'Amenities Intro', Component: AmenitiesIntroForm },
    { value: 'amenities-list', label: 'Amenities List', Component: AmenitiesListForm },
    { value: 'amenities-grid', label: 'Amenities Grid', Component: AmenitiesGridForm },
    { value: 'specs', label: 'Specifications', Component: SpecificationsForm },
    { value: 'masterplan', label: 'Master Plan', Component: MasterPlanForm },
    { value: 'floorplans', label: 'Floor Plans', Component: FloorPlansForm },
    { value: 'backcover', label: 'Back Cover', Component: BackCoverForm },
  ];

  return (
    <FormProvider {...form}>
       <div className="flex flex-col md:flex-row h-screen overflow-hidden">
          {/* Form Section */}
          <Card className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col rounded-none border-0 border-r md:rounded-none md:border-r no-print">
              <CardHeader className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Brochure Data</CardTitle>
                    <Button onClick={handlePrint} size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                  </div>
              </CardHeader>
              <ScrollArea className="flex-grow">
                  <CardContent className="p-0">
                      <Tabs defaultValue="cover" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 md:grid-cols-2 lg:grid-cols-3 h-auto rounded-none p-1 gap-1">
                              {formSections.map(section => (
                                  <TabsTrigger key={section.value} value={section.value} className="text-xs px-1 py-1.5 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                      {section.label}
                                  </TabsTrigger>
                              ))}
                          </TabsList>
                          {formSections.map(section => (
                              <TabsContent key={section.value} value={section.value} className="p-4">
                                  <section.Component form={form} />
                              </TabsContent>
                          ))}
                      </Tabs>
                  </CardContent>
              </ScrollArea>
          </Card>

          {/* Preview Section */}
          <div className="flex-grow h-full overflow-hidden brochure-preview-container no-print">
             {/* Wrapper to center the A4 preview */}
             <div className="flex justify-center py-4">
                <BrochurePreview data={brochureData} />
             </div>
          </div>

          {/* Hidden Printable Area */}
          <div className="printable-area hidden print:block">
              <BrochurePreview data={form.getValues()} />
          </div>
       </div>
    </FormProvider>
  );
}
