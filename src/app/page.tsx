
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Import Form Section Components
import { CoverForm } from '@/components/brochure/form-sections/CoverForm';
import { IntroductionForm, type IntroductionFormProps } from '@/components/brochure/form-sections/IntroductionForm';
import { DeveloperForm, type DeveloperFormProps } from '@/components/brochure/form-sections/DeveloperForm';
import { LocationForm, type LocationFormProps } from '@/components/brochure/form-sections/LocationForm';
import { ConnectivityForm, type ConnectivityFormProps } from '@/components/brochure/form-sections/ConnectivityForm';
import { AmenitiesIntroForm, type AmenitiesIntroFormProps } from '@/components/brochure/form-sections/AmenitiesIntroForm';
import { AmenitiesListForm, type AmenitiesListFormProps } from '@/components/brochure/form-sections/AmenitiesListForm';
import { AmenitiesGridForm, type AmenitiesGridFormProps } from '@/components/brochure/form-sections/AmenitiesGridForm';
import { SpecificationsForm, type SpecificationsFormProps } from '@/components/brochure/form-sections/SpecificationsForm';
import { MasterPlanForm, type MasterPlanFormProps } from '@/components/brochure/form-sections/MasterPlanForm';
import { FloorPlansForm, type FloorPlansFormProps } from '@/components/brochure/form-sections/FloorPlansForm';
import { BackCoverForm } from '@/components/brochure/form-sections/BackCoverForm';

// Import brochure specific CSS
import './brochure.css';

// Import AI generation functionality
import { generateBrochureSection, type GenerateBrochureSectionInput } from '@/ai/flows/generate-brochure-flow';
import { z } from 'zod'; // Import z for ZodError

interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>;
  props?: Record<string, any>;
  generateContent?: {
    handler: (section: GenerateBrochureSectionInput['sectionToGenerate'], fieldsToUpdate: (keyof BrochureData)[], toastTitle: string) => Promise<void>;
    sectionName: GenerateBrochureSectionInput['sectionToGenerate'];
    loadingStateKey: string; // e.g., 'isGeneratingIntro'
    fields: (keyof BrochureData)[];
    toastTitle: string;
  };
}


export default function Home() {
  const { toast } = useToast();
  const [brochureData, setBrochureData] = useState<BrochureData>(getDefaultBrochureData());
  const [isClient, setIsClient] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [aiPromptHint, setAiPromptHint] = useState('');

  // Unified loading state for AI generation
  const [aiLoadingStates, setAiLoadingStates] = useState<Record<string, boolean>>({
    isGeneratingFull: false,
    isGeneratingIntro: false,
    isGeneratingDeveloper: false,
    isGeneratingLocation: false,
    isGeneratingConnectivity: false,
    isGeneratingAmenitiesIntro: false,
    isGeneratingAmenitiesListTitle: false,
    isGeneratingAmenitiesGridTitle: false,
    isGeneratingSpecsTitle: false,
    isGeneratingMasterPlan: false,
    isGeneratingFloorPlansTitle: false,
  });


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
          // Don't log intermediate validation errors aggressively
          // console.warn("Form watch update - validation failed (intermediate state):", parsedData.error.flatten().fieldErrors);
        }
      } catch (error) {
        console.error("Form watch update unexpected error:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Check if any AI generation is in progress
  const anySectionGenerating = Object.values(aiLoadingStates).some(loading => loading);
  const globalDisable = isPrinting || anySectionGenerating; // Now includes isPrinting


  // Function to update a specific loading state
  const setAiLoading = (key: string, value: boolean) => {
    setAiLoadingStates(prev => ({ ...prev, [key]: value }));
  };


  const handlePrint = async () => {
    if (typeof window !== 'undefined') {
      setIsPrinting(true);
      try {
        const currentFormData = form.getValues();
        // Perform validation before attempting to print
        const validatedData = BrochureDataSchema.parse(currentFormData);
        setBrochureData(validatedData); // Update state with validated data for preview

        // Add a small delay to ensure state update and re-render completes
        await new Promise(resolve => setTimeout(resolve, 50));

        toast({ title: "Preparing PDF", description: "Generating printable brochure..." });

        // Another small delay before triggering print
        await new Promise(resolve => setTimeout(resolve, 100));

        window.print();
      } catch (error: any) {
          console.error("Validation or Printing failed:", error);
          let description = "Could not generate the PDF. Please try again.";
           if (error instanceof z.ZodError) {
               description = "Form data is invalid. Please check the form fields for errors.";
                // Map zod errors to user-friendly messages if possible
                const fieldErrors = error.flatten().fieldErrors;
                const errorMessages = Object.entries(fieldErrors)
                    .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
                    .join('; ');
                toast({
                    variant: "destructive",
                    title: "Invalid Form Data",
                    description: `Please fix the errors: ${errorMessages}`,
                    duration: 5000 // Longer duration for errors
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
          // Use requestAnimationFrame to ensure print dialog is likely closed
           requestAnimationFrame(() => {
               requestAnimationFrame(() => {
                  setIsPrinting(false);
               });
           });
      }
    }
  };

   const handleGenerateFullContent = async () => {
    setAiLoading('isGeneratingFull', true);
    toast({ title: "AI Enhancement Started", description: "AI is processing your brochure data..." });
    try {
        const currentFormData = form.getValues();
        // Validate before sending to AI
        BrochureDataSchema.parse(currentFormData);

        const aiInput: GenerateBrochureSectionInput = {
            promptHint: aiPromptHint,
            existingData: currentFormData,
            // No sectionToGenerate, so AI enhances full brochure
        };
        const generatedData = await generateBrochureSection(aiInput);
        form.reset(generatedData); // Reset form with all new data
        setBrochureData(generatedData); // Update preview
        toast({ title: "AI Enhancement Complete", description: "Brochure content has been updated." });
    } catch (error: any) {
      console.error("AI Enhancement failed:", error);
       let description = "Could not enhance content. Please try again.";
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            const errorMessages = Object.entries(fieldErrors)
                .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
                .join('; ');
            description = `Form data is invalid before sending to AI. Please fix the errors: ${errorMessages}`;
        } else if (error.message?.includes("AI returned invalid data format")) {
            description = "AI returned data that could not be validated. Check console for details.";
        } else if (error.message) {
            description = error.message; // Show specific AI error message if available
        }
       toast({
        variant: "destructive",
        title: "AI Enhancement Error",
        description: description,
        duration: 7000
      });
    } finally {
       setAiLoading('isGeneratingFull', false);
    }
  };

  // Generic section content generator
  const handleGenerateSectionContent = async (
    section: GenerateBrochureSectionInput['sectionToGenerate'],
    loadingStateKey: string, // Use the key to update the correct loading state
    fieldsToUpdate: (keyof BrochureData)[],
    toastTitle: string
  ) => {
    if (!section) return;
    setAiLoading(loadingStateKey, true); // Use the key here
    toast({ title: `AI ${toastTitle} Generation`, description: `AI is crafting content for ${toastTitle.toLowerCase()}...` });
    try {
      const currentFormData = form.getValues();
      // Validate before sending
      BrochureDataSchema.parse(currentFormData);

      const aiInput: GenerateBrochureSectionInput = {
        promptHint: `Generate content for the ${section} section, focusing ONLY on the fields: ${fieldsToUpdate.join(', ')}. Expand concisely based ONLY on existing relevant data in the form (like project name, location, developer, etc.). Do NOT invent information. Keep other fields unchanged.`,
        existingData: currentFormData,
        sectionToGenerate: section,
        fieldsToGenerate: fieldsToUpdate, // Pass specific fields to generate
      };

      const aiGeneratedFullData = await generateBrochureSection(aiInput);

      // Create a partial data object for resetting specific fields
      const dataToReset: Partial<BrochureData> = {};
      fieldsToUpdate.forEach(fieldName => {
        // @ts-ignore - Accessing potentially undefined properties safely
        dataToReset[fieldName] = aiGeneratedFullData[fieldName];
      });

      // Create the final data object by merging
       const updatedData = {
         ...currentFormData, // Keep existing data
         ...dataToReset // Overwrite only the specified fields
       };

      // Validate the merged data before resetting the form
      const validatedUpdatedData = BrochureDataSchema.parse(updatedData);

      // Reset the form with the validated merged data
      form.reset(validatedUpdatedData);

      // Update the local state for preview
      setBrochureData(validatedUpdatedData);


      toast({ title: `AI ${toastTitle} Complete`, description: `${toastTitle} has been updated.` });
    } catch (error: any) {
      console.error(`AI ${toastTitle} Generation failed:`, error);
      let description = `Could not generate ${toastTitle.toLowerCase()}. Please try again.`;
      if (error instanceof z.ZodError) {
         const fieldErrors = error.flatten().fieldErrors;
         const errorMessages = Object.entries(fieldErrors)
                .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
                .join('; ');
         description = `Form data invalid before sending, or AI returned invalid data for ${toastTitle.toLowerCase()}. Errors: ${errorMessages}`;
      } else if (error.message?.includes("AI returned invalid data format")) {
          description = `AI returned data for ${toastTitle.toLowerCase()} that could not be validated. Check console.`;
      } else if (error.message) {
        description = error.message; // Show specific AI error message
      }
      toast({
        variant: "destructive",
        title: `AI ${toastTitle} Error`,
        description: description,
        duration: 7000
      });
    } finally {
        setAiLoading(loadingStateKey, false); // Use the key here
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

  // Define form sections with AI generation handlers where applicable
  const formSections: FormSection[] = [
    { value: 'cover', label: 'Cover', Component: CoverForm },
    {
      value: 'intro',
      label: 'Introduction',
      Component: IntroductionForm,
      generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'introduction',
        loadingStateKey: 'isGeneratingIntro',
        fields: ['introTitle', 'introParagraph1', 'introParagraph2', 'introParagraph3'],
        toastTitle: 'Introduction',
      },
    },
    {
      value: 'developer',
      label: 'Developer',
      Component: DeveloperForm,
       generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'developer',
        loadingStateKey: 'isGeneratingDeveloper',
        fields: ['developerDesc1', 'developerDesc2'], // Let AI generate descriptions based on name
        toastTitle: 'Developer Info',
      },
    },
    {
      value: 'location',
      label: 'Location',
      Component: LocationForm,
      generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'location',
        loadingStateKey: 'isGeneratingLocation',
        fields: ['locationTitle', 'locationDesc1', 'locationDesc2', 'locationNote'], // Generate text based on key distances etc.
        toastTitle: 'Location Details',
      },
    },
    {
      value: 'connectivity',
      label: 'Connectivity',
      Component: ConnectivityForm,
      generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'connectivity',
        loadingStateKey: 'isGeneratingConnectivity',
        fields: ['connectivityTitle', 'connectivityNote'], // Generate text based on points of interest
        toastTitle: 'Connectivity Details',
      },
    },
    {
      value: 'amenities-intro',
      label: 'Amenities Intro',
      Component: AmenitiesIntroForm,
      generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'amenitiesIntro',
        loadingStateKey: 'isGeneratingAmenitiesIntro',
        fields: ['amenitiesIntroTitle', 'amenitiesIntroP1', 'amenitiesIntroP2', 'amenitiesIntroP3'], // Generate based on amenity lists
        toastTitle: 'Amenities Intro',
      },
    },
    {
      value: 'amenities-list',
      label: 'Amenities List',
      Component: AmenitiesListForm,
       generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'amenitiesListTitle', // Only target title generation here
        loadingStateKey: 'isGeneratingAmenitiesListTitle',
        fields: ['amenitiesListTitle'], // AI suggests a title based on items
        toastTitle: 'Amenities List Title',
      },
    },
    {
      value: 'amenities-grid',
      label: 'Amenities Grid',
      Component: AmenitiesGridForm,
       generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'amenitiesGridTitle', // Only target title generation here
        loadingStateKey: 'isGeneratingAmenitiesGridTitle',
        fields: ['amenitiesGridTitle'], // AI suggests title based on labels/images
        toastTitle: 'Amenities Grid Title',
      },
    },
    {
      value: 'specs',
      label: 'Specifications',
      Component: SpecificationsForm,
       generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'specificationsTitle', // Only target title generation here
        loadingStateKey: 'isGeneratingSpecsTitle',
        fields: ['specsTitle'], // AI suggests title based on specs list
        toastTitle: 'Specifications Title',
      },
    },
    {
      value: 'masterplan',
      label: 'Master Plan',
      Component: MasterPlanForm,
       generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'masterPlan',
        loadingStateKey: 'isGeneratingMasterPlan',
        fields: ['masterPlanTitle', 'masterPlanDesc1', 'masterPlanDesc2'], // Generate based on image context if possible (or general knowledge if allowed)
        toastTitle: 'Master Plan Details',
      },
    },
    {
      value: 'floorplans',
      label: 'Floor Plans',
      Component: FloorPlansForm,
       generateContent: {
        handler: handleGenerateSectionContent,
        sectionName: 'floorPlansTitle', // Only target title generation here
        loadingStateKey: 'isGeneratingFloorPlansTitle',
        fields: ['floorPlansTitle'], // AI suggests title based on plan names/areas
        toastTitle: 'Floor Plans Title',
      },
    },
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
                   <CardDescription className="text-xs text-muted-foreground mb-1">Enhance content or fill missing fields for the entire brochure. Images require manual input.</CardDescription>
                  <div className="flex items-center gap-2">
                     <Label htmlFor="ai-prompt-hint" className="sr-only">Optional AI Hint</Label>
                     <Input
                        id="ai-prompt-hint"
                        type="text"
                        placeholder="Optional AI hint (e.g., focus on family)"
                        value={aiPromptHint}
                        onChange={(e) => setAiPromptHint(e.target.value)}
                        className="flex-grow h-9 text-sm"
                        disabled={globalDisable}
                        title="Provide an optional hint to guide the AI for full brochure enhancement"
                     />
                     <Button onClick={handleGenerateFullContent} size="sm" variant="outline" disabled={globalDisable} title="Use AI to enhance or complete the entire brochure text content">
                       {aiLoadingStates.isGeneratingFull ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       ) : (
                          <Wand2 className="mr-2 h-4 w-4" />
                       )}
                       {aiLoadingStates.isGeneratingFull ? 'Working...' : 'Enhance All'}
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
                           {formSections.map(section => {
                               // Pass common props and AI-specific props if available
                               const commonProps = { form: form, disabled: globalDisable };
                               const aiProps = section.generateContent ? {
                                   onGenerateContent: () => section.generateContent!.handler(
                                       section.generateContent!.sectionName,
                                       section.generateContent!.fields, // Pass fields to generate
                                       section.generateContent!.toastTitle
                                   ),
                                   isGeneratingContent: aiLoadingStates[section.generateContent.loadingStateKey],
                                   generateHandlerKey: section.generateContent.loadingStateKey, // Pass the key itself
                               } : {};


                               return (
                                  <TabsContent key={section.value} value={section.value} className="p-4 focus-visible:outline-none focus-visible:ring-0 mt-0">
                                    {/* Spread common and AI props */}
                                    <section.Component {...commonProps} {...aiProps} />
                                  </TabsContent>
                               );
                           })}
                      </Tabs>
                  </CardContent>
              </ScrollArea>
          </Card>

          <div className="flex-grow h-full overflow-hidden brochure-preview-container bg-gray-200 dark:bg-gray-800">
             <div className="flex justify-center py-8 px-4 overflow-y-auto h-full">
                {/* Wrap BrochurePreview in a div that we can reference */}
                <div ref={printableRef} id="printable-brochure-wrapper">
                    <BrochurePreview data={brochureData} />
                </div>
             </div>
          </div>
       </div>

        {/* PrintableBrochureLoader remains outside the main layout */}
        <div className="hidden print:block print:overflow-visible">
            <PrintableBrochureLoader data={brochureData} />
        </div>
    </FormProvider>
  );
}

// Component to handle data validation specifically for printing
const PrintableBrochureLoader: React.FC<{ data: Partial<BrochureData> }> = ({ data }) => {
    try {
        // Attempt to validate the data using the schema
        const validatedData = BrochureDataSchema.parse(data);
        // If valid, render the BrochurePreview for printing
        return <BrochurePreview data={validatedData} />;
    } catch (error) {
        // If validation fails, render an error message page for printing
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
 
    