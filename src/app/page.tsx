'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrochureDataSchema, type BrochureData, getDefaultBrochureData, SpecificFieldGeneratingSectionsEnum, type SpecificFieldGeneratingSection } from '@/components/brochure/data-schema';
import { BrochurePreview } from '@/components/brochure/brochure-preview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
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

// Import AI generation functionality
// AI features are currently disabled as per user request
// import { generateBrochureContent, type GenerateBrochureContentInput } from '@/ai/flows/generate-brochure-flow';
import { z } from 'zod'; // Import z for ZodError

interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>; 
  props?: Record<string, any>;
  aiSection?: SpecificFieldGeneratingSection; // Optional: maps to AI generation context
}

const brochureThemes = ["theme-default-minimal", "theme-high-contrast", "theme-grey-wash"];

export default function Home() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
  const [generatedBrochureData, setGeneratedBrochureData] = useState<BrochureData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(brochureThemes[0]);

  const printableRef = useRef<HTMLDivElement>(null);

  const form = useForm<BrochureData>({
    resolver: zodResolver(BrochureDataSchema),
    defaultValues: getDefaultBrochureData(),
    mode: 'onChange', // Keep onChange for live validation in forms
  });

  useEffect(() => {
    setIsClient(true);
    // No automatic update of a live preview `brochureData` state anymore.
    // `generatedBrochureData` will be the source for the preview.
  }, []);

  const globalDisable = isPrinting || isGeneratingAi;

  const handleGenerateBrochure = () => {
    try {
      const currentFormData = form.getValues();
      const validatedData = BrochureDataSchema.parse(currentFormData);
      setGeneratedBrochureData(validatedData);
      
      // Apply a random theme
      const randomTheme = brochureThemes[Math.floor(Math.random() * brochureThemes.length)];
      setActiveTheme(randomTheme);
      
      setShowPreview(true);
      toast({ title: "Brochure Generated", description: "Preview is now available." });
    } catch (error: any) {
      console.error("Validation failed for brochure generation:", error);
      let description = "Could not generate the brochure. Please check the form data.";
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
          duration: 7000
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Error",
          description: description,
          duration: 7000
        });
      }
      setShowPreview(false); // Hide preview on error
      setGeneratedBrochureData(null);
    }
  };

  const handlePrint = async () => {
    if (typeof window !== 'undefined' && generatedBrochureData) { // Only print if data is generated
      setIsPrinting(true);
      try {
        // Data is already validated and set in generatedBrochureData
        await new Promise(resolve => setTimeout(resolve, 50)); // Ensure UI updates
        toast({ title: "Preparing PDF", description: "Generating printable brochure..." });
        await new Promise(resolve => setTimeout(resolve, 100));
        window.print();
      } catch (error: any) {
        console.error("Printing failed:", error);
        toast({
          variant: "destructive",
          title: "Printing Error",
          description: "Could not prepare the PDF for printing. Please try again.",
          duration: 5000
        });
      } finally {
        // Delay hiding loader to allow print dialog to appear fully
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsPrinting(false);
          });
        });
      }
    } else if (!generatedBrochureData) {
        toast({
            variant: "destructive",
            title: "No Brochure Generated",
            description: "Please generate the brochure first before downloading.",
            duration: 5000
        });
    }
  };
  
  // AI Generation Handler (example for one section)
  // const handleAiGenerate = async (section: SpecificFieldGeneratingSection, fieldPaths?: (keyof BrochureData)[]) => {
  //   setIsGeneratingAi(true);
  //   try {
  //     const currentFormData = form.getValues();
  //     // Ensure data is valid enough for AI
  //     const validatedForAISource = BrochureDataSchema.partial().safeParse(currentFormData);
  //     if (!validatedForAISource.success) {
  //       toast({ variant: "destructive", title: "AI Error", description: "Current form data is too incomplete for AI generation."});
  //       setIsGeneratingAi(false);
  //       return;
  //     }

  //     const input: GenerateBrochureContentInput = {
  //       existingData: getDefaultBrochureData(), // Send default structure and fill with current values
  //       ...currentFormData, // Overlay current form values
  //       sectionToGenerate: section,
  //       fieldsToGenerate: fieldPaths as string[] | undefined, // Cast as AI flow expects string[]
  //       promptHint: `Focus on creating compelling content for the ${section} section.`,
  //     };
      
  //     // const aiGeneratedData = await generateBrochureContent(input);
  //     // form.reset(aiGeneratedData); // Update form with AI data
  //     // setGeneratedBrochureData(aiGeneratedData); // Also update the preview if shown
  //     // setShowPreview(true); // Show preview with new AI data

  //     toast({ title: "AI Content Generated", description: `Content for ${section} has been updated.` });
  //   } catch (error: any) {
  //     console.error(`AI Generation failed for ${section}:`, error);
  //     toast({
  //       variant: "destructive",
  //       title: "AI Generation Error",
  //       description: error.message || `Could not generate content for ${section}.`,
  //       duration: 7000
  //     });
  //   } finally {
  //     setIsGeneratingAi(false);
  //   }
  // };


  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4">Loading Brochure Builder...</p>
      </div>
    );
  }

  const formSections: FormSection[] = [
    { value: 'cover', label: 'Cover', Component: CoverForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.cover },
    { value: 'intro', label: 'Introduction', Component: IntroductionForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.introduction },
    { value: 'developer', label: 'Developer', Component: DeveloperForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.developer },
    { value: 'location', label: 'Location', Component: LocationForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.location },
    { value: 'connectivity', label: 'Connectivity', Component: ConnectivityForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.connectivity },
    { value: 'amenities-intro', label: 'Amenities Intro', Component: AmenitiesIntroForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.amenitiesIntro },
    { value: 'amenities-list', label: 'Amenities List', Component: AmenitiesListForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.amenitiesListTitle },
    { value: 'amenities-grid', label: 'Amenities Grid', Component: AmenitiesGridForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.amenitiesGridTitle },
    { value: 'specs', label: 'Specifications', Component: SpecificationsForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.specificationsTitle },
    { value: 'masterplan', label: 'Master Plan', Component: MasterPlanForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.masterPlan },
    { value: 'floorplans', label: 'Floor Plans', Component: FloorPlansForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.floorPlansTitle },
    { value: 'backcover', label: 'Back Cover', Component: BackCoverForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.backCover },
  ];

  return (
    <FormProvider {...form}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-foreground">
        <Card id="sidebar-container" className="w-full md:w-[420px] lg:w-[480px] h-full flex flex-col rounded-none border-0 border-r md:border-r border-border shadow-lg">
          <CardHeader className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
              <CardTitle className="text-xl font-semibold">Brochure Editor</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleGenerateBrochure} size="sm" disabled={globalDisable} className="flex-grow sm:flex-grow-0 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Brochure
                </Button>
                <Button onClick={handlePrint} size="sm" disabled={globalDisable || !generatedBrochureData} title="Download Brochure as PDF" className="flex-grow sm:flex-grow-0">
                  {isPrinting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isPrinting ? 'Preparing...' : 'Download PDF'}
                </Button>
              </div>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Fill in the details for each section. Click "Generate Brochure" to see the preview.
            </CardDescription>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-0">
              <Tabs defaultValue="cover" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-2 lg:grid-cols-3 h-auto rounded-none p-1 gap-1 sticky top-0 bg-muted z-10 border-b border-border">
                  {formSections.map(section => (
                    <TabsTrigger key={section.value} value={section.value} className="text-xs px-1 py-1.5 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                      {section.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {formSections.map(section => {
                  const commonProps = { 
                    form: form, 
                    disabled: globalDisable,
                    // onAiGenerate: section.aiSection ? () => handleAiGenerate(section.aiSection!) : undefined 
                  };
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

        <div className="flex-grow h-full overflow-hidden brochure-preview-container bg-muted dark:bg-gray-800">
          {showPreview && generatedBrochureData ? (
            <div className="flex justify-center py-8 px-4 overflow-y-auto h-full">
               <div ref={printableRef} id="printable-brochure-wrapper" className={activeTheme}>
                <BrochurePreview data={generatedBrochureData} themeClass={activeTheme} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Sparkles className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Your Brochure Awaits</h3>
              <p className="text-muted-foreground max-w-md">
                Fill in the details in the editor on the left, then click the "Generate Brochure" button to create and preview your professional real estate brochure.
              </p>
            </div>
          )}
        </div>
      </div>

      {showPreview && generatedBrochureData && (
         <div className="hidden print:block print:overflow-visible">
            <PrintableBrochureLoader data={generatedBrochureData} themeClass={activeTheme} />
         </div>
      )}
    </FormProvider>
  );
}

const PrintableBrochureLoader: React.FC<{ data: Partial<BrochureData>, themeClass: string }> = ({ data, themeClass }) => {
  try {
    const validatedData = BrochureDataSchema.parse(data);
    return <BrochurePreview data={validatedData} themeClass={themeClass} />;
  } catch (error) {
    console.error("Data validation failed for print render:", error);
    return (
      <div className={`p-10 text-red-600 font-bold text-center page page-light-bg ${themeClass}`} style={{ pageBreakBefore: 'always', boxSizing: 'border-box', border: '2px dashed red', backgroundColor: 'white' }}>
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