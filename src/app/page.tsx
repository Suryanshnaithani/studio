
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrochureDataSchema, type BrochureData, getDefaultBrochureData } from '@/components/brochure/data-schema';
import { BrochurePreview } from '@/components/brochure/brochure-preview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import Form Section Components
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

import { z } from 'zod'; // Import z for ZodError

interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>; // Consider more specific props type if time allows
  props?: Record<string, any>;
}


export default function Home() {
  const { toast } = useToast();
  const [brochureData, setBrochureData] = useState<BrochureData>(getDefaultBrochureData());
  const [isClient, setIsClient] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const printableRef = useRef<HTMLDivElement>(null);

  const form = useForm<BrochureData>({
    resolver: zodResolver(BrochureDataSchema),
    defaultValues: getDefaultBrochureData(),
    mode: 'onChange',
  });

  useEffect(() => {
    setIsClient(true);
    const initialData = form.getValues();
    setBrochureData(initialData);

    const subscription = form.watch((value) => {
      try {
        const parsedData = BrochureDataSchema.safeParse(value);
        if (parsedData.success) {
          setBrochureData(parsedData.data);
        } else {
          // console.warn("Form watch update - validation failed (intermediate state):", parsedData.error.flatten().fieldErrors);
        }
      } catch (error) {
        console.error("Form watch update unexpected error:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const globalDisable = isPrinting;


  const handlePrint = async () => {
    if (typeof window !== 'undefined') {
      setIsPrinting(true);
      try {
        const currentFormData = form.getValues();
        const validatedData = BrochureDataSchema.parse(currentFormData);
        setBrochureData(validatedData); 

        await new Promise(resolve => setTimeout(resolve, 50));
        toast({ title: "Preparing PDF", description: "Generating printable brochure..." });
        await new Promise(resolve => setTimeout(resolve, 100));
        window.print();
      } catch (error: any) {
          console.error("Validation or Printing failed:", error);
          let description = "Could not generate the PDF. Please try again.";
           if (error instanceof z.ZodError) {
               description = "Form data is invalid. Please check the form fields for errors.";
                const fieldErrors = error.flatten().fieldErrors;
                const errorMessages = Object.entries(fieldErrors)
                    .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
                    .join('; ');
                toast({
                    variant: "destructive",
                    title: "Invalid Form Data",
                    description: `Please fix the errors: ${errorMessages}`,
                    duration: 5000 
                });
           } else {
                toast({
                    variant: "destructive",
                    title: "Printing Error",
                    description: description,
                    duration: 5000
                });
           }
      } finally {
           requestAnimationFrame(() => {
               requestAnimationFrame(() => {
                  setIsPrinting(false);
               });
           });
      }
    }
  };


  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading Brochure Builder...</p>
      </div>
    );
  }

  const formSections: FormSection[] = [
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
       <div className="flex flex-col md:flex-row h-screen overflow-hidden no-print bg-background">
          <Card className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col rounded-none border-0 border-r md:rounded-none md:border-r border-border shadow-md">
              <CardHeader className="p-4 border-b border-border">
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <CardTitle className="text-lg font-semibold text-foreground">Brochure Editor</CardTitle>
                    <Button onClick={handlePrint} size="sm" disabled={globalDisable} title="Download Brochure as PDF">
                        {isPrinting ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                           <Download className="mr-2 h-4 w-4" />
                        )}
                        {isPrinting ? 'Generating...' : 'Download PDF'}
                    </Button>
                  </div>
                   <CardDescription className="text-xs text-muted-foreground mb-1">Fill in the details for each section of your brochure. Images can be added via URL or upload.</CardDescription>
              </CardHeader>
              <ScrollArea className="flex-grow">
                  <CardContent className="p-0">
                      <Tabs defaultValue="cover" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 md:grid-cols-2 lg:grid-cols-3 h-auto rounded-none p-1 gap-1 sticky top-0 bg-muted z-10 border-b border-border">
                              {formSections.map(section => (
                                  <TabsTrigger key={section.value} value={section.value} className="text-xs px-1 py-1.5 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                                      {section.label}
                                  </TabsTrigger>
                              ))}
                          </TabsList>
                           {formSections.map(section => {
                               const commonProps = { form: form, disabled: globalDisable };
                               return (
                                  <TabsContent key={section.value} value={section.value} className="p-4 focus-visible:outline-none focus-visible:ring-0 mt-0">
                                    <section.Component {...commonProps} />
                                  </TabsContent>
                               );
                           })}
                      </Tabs>
                  </CardContent>
              </ScrollArea>
          </Card>

          <div className="flex-grow h-full overflow-hidden brochure-preview-container bg-gray-200 dark:bg-gray-800">
             <div className="flex justify-center py-8 px-4 overflow-y-auto h-full">
                <div ref={printableRef} id="printable-brochure-wrapper">
                    <BrochurePreview data={brochureData} />
                </div>
             </div>
          </div>
       </div>

        <div className="hidden print:block print:overflow-visible">
            <PrintableBrochureLoader data={brochureData} />
        </div>
    </FormProvider>
  );
}

const PrintableBrochureLoader: React.FC<{ data: Partial<BrochureData> }> = ({ data }) => {
    try {
        const validatedData = BrochureDataSchema.parse(data);
        return <BrochurePreview data={validatedData} />;
    } catch (error) {
        console.error("Data validation failed for print render:", error);
        return (
            <div className="p-10 text-red-600 font-bold text-center page page-light-bg" style={{ pageBreakBefore: 'always', boxSizing: 'border-box', border: '2px dashed red', backgroundColor: 'white' }}>
                <h1>Brochure Generation Error</h1>
                <p className="mt-4">The brochure data is incomplete or invalid and cannot be printed.</p>
                <p className="mt-2">Please correct the errors in the editor before downloading the PDF.</p>
                {error instanceof z.ZodError && (
                    <pre className="mt-4 text-left text-xs bg-red-100 p-2 overflow-auto max-h-[150mm] text-red-800">
                        {JSON.stringify(error.flatten().fieldErrors, null, 2)}
                    </pre>
                )}
            </div>
        );
    }
};
