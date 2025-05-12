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
import { Download, Loader2, Settings, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input'; // Import Input
import { Label } from '@/components/ui/label'; // Import Label

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

// Import AI generation functionality
import { generateBrochureContent } from '@/ai/flows/generate-brochure-flow';

export default function Home() {
  const { toast } = useToast();
  const [brochureData, setBrochureData] = useState<BrochureData>(getDefaultBrochureData());
  const [isClient, setIsClient] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // State for AI generation
  const [aiPromptHint, setAiPromptHint] = useState(''); // State for AI prompt hint
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
        // Attempt to partially parse for smoother updates, but fallback to full parse
        const parsedData = BrochureDataSchema.safeParse(value);
        if (parsedData.success) {
             setBrochureData(parsedData.data);
        } else {
            // Keep existing data if parse fails during typing, avoid clearing preview
             console.warn("Partial form watch update error:", parsedData.error);
             // Only update if the full form becomes valid again
             const fullParsedData = BrochureDataSchema.safeParse(form.getValues());
             if (fullParsedData.success) {
                 setBrochureData(fullParsedData.data);
             }
        }
      } catch (error) {
        console.error("Form watch update unexpected error:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]); // Form dependency is correct here

  const handlePrint = async () => {
    if (typeof window !== 'undefined') {
      setIsPrinting(true);
      // Ensure the latest data from the form is used for the printable version
      try {
        const currentFormData = form.getValues();
        const validatedData = BrochureDataSchema.parse(currentFormData); // Validate before printing
        setBrochureData(validatedData); // Update state just before printing
        toast({ title: "Preparing PDF", description: "Generating printable brochure..." });

        // Add a small delay to ensure DOM updates with the latest state
        await new Promise(resolve => setTimeout(resolve, 300));

         window.print(); // Trigger browser print dialog
      } catch (error: any) {
          console.error("Validation or Printing failed:", error);
          let description = "Could not generate the PDF. Please try again.";
           if (error instanceof z.ZodError) {
               description = "Form data is invalid. Please check the highlighted fields.";
               // Optionally highlight invalid fields (requires more complex logic)
           }
          toast({
              variant: "destructive",
              title: "Printing Error",
              description: description,
          });
      } finally {
          // Use a slightly longer delay to accommodate slower systems/print dialog closing
          await new Promise(resolve => setTimeout(resolve, 1000));
          setIsPrinting(false);
      }
    }
  };

   // AI generation handler
   const handleGenerateContent = async () => {
    setIsGenerating(true);
    toast({ title: "AI Generation Started", description: "Generating brochure content..." });
    try {
      const generatedData = await generateBrochureContent({ promptHint: aiPromptHint });

       // Validate the received data before resetting the form
      const validationResult = BrochureDataSchema.safeParse(generatedData);

      if (!validationResult.success) {
          console.error("AI returned invalid data:", validationResult.error);
          throw new Error("AI generated data that does not match the required schema.");
      }

      const validatedData = validationResult.data;

      form.reset(validatedData); // Reset form with new validated data
      setBrochureData(validatedData); // Update preview state immediately

      toast({ title: "AI Generation Complete", description: "Brochure content has been updated." });
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Error",
        description: error.message || "Could not generate content. Please try again.",
      });
    } finally {
      setIsGenerating(false);
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
       <div className="flex flex-col md:flex-row h-screen overflow-hidden no-print bg-background">
          <Card className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col rounded-none border-0 border-r md:rounded-none md:border-r border-border">
              <CardHeader className="p-4 border-b border-border">
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <CardTitle className="text-lg font-semibold text-foreground">Brochure Editor</CardTitle>
                    <Button onClick={handlePrint} size="sm" disabled={isPrinting || isGenerating}>
                        {isPrinting ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                           <Download className="mr-2 h-4 w-4" />
                        )}
                        {isPrinting ? 'Generating...' : 'Download PDF'}
                    </Button>
                  </div>
                   {/* AI Generation Section */}
                   <CardDescription className="text-xs text-muted-foreground mb-1">Optional: Guide the AI generation</CardDescription>
                  <div className="flex items-center gap-2">
                     <Label htmlFor="ai-prompt-hint" className="sr-only">AI Prompt Hint</Label>
                     <Input
                        id="ai-prompt-hint"
                        type="text"
                        placeholder="e.g., Beachfront villas in Miami"
                        value={aiPromptHint}
                        onChange={(e) => setAiPromptHint(e.target.value)}
                        className="flex-grow h-9 text-sm"
                        disabled={isGenerating || isPrinting}
                     />
                     <Button onClick={handleGenerateContent} size="sm" variant="outline" disabled={isGenerating || isPrinting}>
                       {isGenerating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       ) : (
                          <Wand2 className="mr-2 h-4 w-4" />
                       )}
                       {isGenerating ? 'Generating...' : 'Generate'}
                     </Button>
                  </div>
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
                          {formSections.map(section => (
                              <TabsContent key={section.value} value={section.value} className="p-4 focus-visible:outline-none focus-visible:ring-0 mt-0">
                                  <section.Component form={form} />
                              </TabsContent>
                          ))}
                      </Tabs>
                  </CardContent>
              </ScrollArea>
          </Card>

          <div className="flex-grow h-full overflow-hidden brochure-preview-container bg-gray-200 dark:bg-gray-800">
             <div className="flex justify-center py-8 px-4 overflow-y-auto h-full">
                <BrochurePreview data={brochureData} />
             </div>
          </div>
       </div>

        {/* Hidden Printable Area - Always use state data */}
        <div className="hidden print:block print:overflow-visible" ref={printableRef}>
            {/* Re-parse data just before printing to ensure validity */}
            <PrintableBrochureLoader data={brochureData} />
        </div>
    </FormProvider>
  );
}


// Helper component to ensure data is valid before rendering for print
const PrintableBrochureLoader: React.FC<{ data: BrochureData }> = ({ data }) => {
    try {
        const validatedData = BrochureDataSchema.parse(data);
        return <BrochurePreview data={validatedData} />;
    } catch (error) {
        console.error("Data validation failed for print render:", error);
        // Optionally render an error message in the print output, though it might be complex
        return <div className="p-10 text-red-600 font-bold">Error: Invalid brochure data for printing.</div>;
    }
};
