'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrochureDataSchema, type BrochureData, getDefaultBrochureData } from '@/components/brochure/data-schema';
import { BrochurePreview } from '@/components/brochure/brochure-preview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Loader2, Settings, Wand2 } from 'lucide-react';
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

// Placeholder for AI generation functionality
// import { generateBrochureContent } from '@/ai/flows/generate-brochure-flow';

export default function Home() {
  const { toast } = useToast();
  const [brochureData, setBrochureData] = useState<BrochureData>(getDefaultBrochureData());
  const [isClient, setIsClient] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // State for AI generation
  const printableRef = useRef<HTMLDivElement>(null);

  const form = useForm<BrochureData>({
    resolver: zodResolver(BrochureDataSchema),
    defaultValues: getDefaultBrochureData(),
    mode: 'onChange', // Update preview on change
  });

  useEffect(() => {
    setIsClient(true);
    const initialData = form.getValues();
    setBrochureData(initialData); // Set initial data for preview

    // Watch for changes and update the preview state
    const subscription = form.watch((value) => {
      try {
        // Full parse on watch to ensure data consistency
        const parsedData = BrochureDataSchema.parse(value);
        setBrochureData(parsedData);
      } catch (error) {
        console.warn("Form watch update error:", error);
        // Optionally show a toast or handle partial updates if needed
        // For simplicity, we rely on the full parse here
      }
    });
    return () => subscription.unsubscribe();
  }, [form]); // Form dependency is correct here

  const handlePrint = async () => {
    if (typeof window !== 'undefined') {
      setIsPrinting(true);
      // Ensure the latest data from the form is used for the printable version
      const currentFormData = form.getValues();
       setBrochureData(currentFormData); // Update state just before printing

      // Add a small delay to ensure DOM updates with the latest state
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        window.print();
      } catch (error) {
         console.error("Printing failed:", error);
         toast({
            variant: "destructive",
            title: "Printing Error",
            description: "Could not generate the PDF. Please try again.",
         });
      } finally {
         // Give the print dialog time to close before resetting state
         await new Promise(resolve => setTimeout(resolve, 500));
        setIsPrinting(false);
      }
    }
  };

   // Placeholder for AI generation handler
   const handleGenerateContent = async () => {
    setIsGenerating(true);
    toast({ title: "AI Generation Started", description: "Generating brochure content..." });
    try {
      // TODO: Implement AI generation call
      // const currentData = form.getValues();
      // const generatedData = await generateBrochureContent(currentData); // Assuming this function exists
      // form.reset(generatedData); // Reset form with new data
      // setBrochureData(generatedData); // Update preview state
       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI call
       const generatedData = getDefaultBrochureData(); // Replace with actual generated data
       generatedData.projectName = "AI Generated Paradise";
       generatedData.projectTagline = "The future of AI-powered living.";
       form.reset(generatedData);
       setBrochureData(generatedData);

      toast({ title: "AI Generation Complete", description: "Brochure content has been updated." });
    } catch (error) {
      console.error("AI Generation failed:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Error",
        description: "Could not generate content. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    );
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
       <div className="flex flex-col md:flex-row h-screen overflow-hidden no-print">
          <Card className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col rounded-none border-0 border-r md:rounded-none md:border-r">
              <CardHeader className="p-4 border-b">
                  <div className="flex justify-between items-center gap-2">
                    <CardTitle className="text-lg font-semibold">Brochure Data</CardTitle>
                     <div className="flex gap-2">
                       {/* AI Generate Button - Placeholder */}
                       <Button onClick={handleGenerateContent} size="sm" variant="outline" disabled={isGenerating || isPrinting}>
                         {isGenerating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                         )}
                         {isGenerating ? 'Generating...' : 'AI Generate'}
                       </Button>
                        <Button onClick={handlePrint} size="sm" disabled={isPrinting || isGenerating}>
                            {isPrinting ? (
                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                               <Download className="mr-2 h-4 w-4" />
                            )}
                            {isPrinting ? 'Generating...' : 'Download PDF'}
                        </Button>
                     </div>
                  </div>
              </CardHeader>
              <ScrollArea className="flex-grow">
                  <CardContent className="p-0">
                      <Tabs defaultValue="cover" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 md:grid-cols-2 lg:grid-cols-3 h-auto rounded-none p-1 gap-1 sticky top-0 bg-background z-10">
                              {formSections.map(section => (
                                  <TabsTrigger key={section.value} value={section.value} className="text-xs px-1 py-1.5 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                      {section.label}
                                  </TabsTrigger>
                              ))}
                          </TabsList>
                          {formSections.map(section => (
                              <TabsContent key={section.value} value={section.value} className="p-4 focus-visible:outline-none focus-visible:ring-0">
                                  <section.Component form={form} />
                              </TabsContent>
                          ))}
                      </Tabs>
                  </CardContent>
              </ScrollArea>
          </Card>

          <div className="flex-grow h-full overflow-hidden brochure-preview-container bg-gray-100 dark:bg-gray-800">
             <div className="flex justify-center py-8 px-4">
                <BrochurePreview data={brochureData} />
             </div>
          </div>
       </div>

        {/* Hidden Printable Area - Always use state data */}
        <div className="hidden print:block" ref={printableRef}>
            <BrochurePreview data={brochureData} />
        </div>
    </FormProvider>
  );
}
