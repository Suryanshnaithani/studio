
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrochureDataSchema, type BrochureData, getDefaultBrochureData, BrochureAIDataSectionsEnum, type BrochureAIDataSection } from '@/components/brochure/data-schema';
import { BrochurePreview } from '@/components/brochure/brochure-preview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Loader2, Palette, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
// import { generateBrochureContent, type GenerateBrochureInput } from '@/ai/flows/generate-brochure-flow'; // AI features disabled for now
import { z } from 'zod'; // Import z for ZodError

interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>;
  aiSection?: BrochureAIDataSection;
}

const brochureThemes = [
  "theme-brochure-builder", // Default professional theme
  "theme-elegant-serif",
  "theme-cool-modern",
];

export default function Home() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const isPrintingRef = useRef(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<Record<string, boolean>>({});

  const [generatedBrochureData, setGeneratedBrochureData] = useState<BrochureData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(brochureThemes[0]);

  const printableRef = useRef<HTMLDivElement>(null);

  const form = useForm<BrochureData>({
    resolver: zodResolver(BrochureDataSchema),
    defaultValues: getDefaultBrochureData(),
    mode: 'onChange',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAnyAiGenerating = Object.values(isGeneratingAi).some(status => status);
  const globalDisable = isPrintingRef.current || isAnyAiGenerating;


  const handleGenerateOrUpdateBrochure = (newTheme: boolean = false) => {
    try {
      const currentFormData = form.getValues();
      const validatedData = BrochureDataSchema.parse(currentFormData);
      setGeneratedBrochureData(validatedData);

      if (newTheme) { // Simplified: if newTheme is true, always pick a new theme.
        const randomTheme = brochureThemes[Math.floor(Math.random() * brochureThemes.length)];
        setActiveTheme(randomTheme);
      }

      if (!showPreview) { // If it's the first time generating, also show the preview
        setShowPreview(true);
      }
      
      if (!isPrintingRef.current) {
        toast({ title: "Brochure Updated", description: "Preview reflects the latest data." });
      }
    } catch (error: any) {
      console.error("Validation failed for brochure generation/update:", error);
      let description = "Could not update the brochure. Please check the form data.";
      if (error instanceof z.ZodError) {
        description = "Form data is invalid. Please check the form fields for errors.";
        const fieldErrors = error.flatten().fieldErrors;
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
          .join('; ');
        if (!isPrintingRef.current) {
            toast({
            variant: "destructive",
            title: "Invalid Form Data",
            description: `Please fix the errors: ${errorMessages}`,
            duration: 7000
            });
        }
      } else if (!isPrintingRef.current) {
        toast({
          variant: "destructive",
          title: "Update Error",
          description: description,
          duration: 7000
        });
      }
       if (isPrintingRef.current) throw error;
    }
  };


  const debouncedUpdatePreview = useRef(
    debounce(() => {
      if (showPreview && !isPrintingRef.current) {
        handleGenerateOrUpdateBrochure(false); // Update content, keep current theme
      }
    }, 750)
  ).current;

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && showPreview && !isPrintingRef.current) {
        debouncedUpdatePreview();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedUpdatePreview, showPreview]);


  function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise(resolve => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => resolve(func(...args)), waitFor);
      });
  }


  const handlePrint = async () => {
    if (isPrintingRef.current) return;
    isPrintingRef.current = true;
    // Force re-render to update button states if needed by temporarily changing a state
    // This ensures the "Preparing..." state is visible on the button.
    setGeneratedBrochureData(prev => ({...prev!} as BrochureData)); 


    try {
      form.trigger(); // Trigger validation before printing
      handleGenerateOrUpdateBrochure(false); // Ensure latest data is used for print, keep current theme
      
      await new Promise(resolve => setTimeout(resolve, 200)); 

      toast({ title: "Preparing PDF", description: "Generating printable brochure..." });
      
      await new Promise(resolve => setTimeout(resolve, 300));

      window.print();

    } catch (error: any) {
      console.error("Printing failed:", error);
      toast({
        variant: "destructive",
        title: "Printing Error",
        description: "Could not prepare the PDF for printing. Please check form data and try again.",
        duration: 5000
      });
    } finally {
      setTimeout(() => {
        isPrintingRef.current = false;
        // Force re-render to update button states if needed
        setGeneratedBrochureData(prev => ({...prev!} as BrochureData));
      }, 1000); 
    }
  };


  // const handleAiGenerate = async (sectionKey: string, section: BrochureAIDataSection) => {
  //   setIsGeneratingAi(prev => ({ ...prev, [sectionKey]: true }));
  //   try {
  //     const currentFormData = form.getValues();
  //     BrochureDataSchema.parse(currentFormData);

  //     const aiInput: GenerateBrochureInput = {
  //       existingData: currentFormData,
  //       sectionToGenerate: section,
  //       promptHint: `Focus on making the content for the ${section} section engaging and professional.`,
  //     };

  //     // const updatedData = await generateBrochureContent(aiInput); // AI Call
  //     // form.reset(updatedData); 
  //     // setGeneratedBrochureData(updatedData); 
  //     // if (showPreview) {
  //     //    handleGenerateOrUpdateBrochure(false); 
  //     // }
  //     // toast({ title: `AI Content Generated for ${section}`, description: "Section updated successfully." });

  //   } catch (error: any) {
  //     console.error(`AI generation error for section ${section}:`, error);
  //     let desc = "An error occurred during AI content generation.";
  //     if (error instanceof z.ZodError) {
  //       desc = "Data validation failed before AI generation. Please check your inputs.";
  //     } else if (error.message) {
  //       desc = error.message;
  //     }
  //     toast({ variant: "destructive", title: "AI Generation Failed", description: desc, duration: 7000 });
  //   } finally {
  //     setIsGeneratingAi(prev => ({ ...prev, [sectionKey]: false }));
  //   }
  // };


  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Brochure Builder...</p>
      </div>
    );
  }

  const formSections: FormSection[] = [
    { value: 'cover', label: 'Cover', Component: CoverForm, aiSection: BrochureAIDataSectionsEnum.enum.cover },
    { value: 'intro', label: 'Introduction', Component: IntroductionForm, aiSection: BrochureAIDataSectionsEnum.enum.introduction },
    { value: 'developer', label: 'Developer', Component: DeveloperForm, aiSection: BrochureAIDataSectionsEnum.enum.developer },
    { value: 'location', label: 'Location', Component: LocationForm, aiSection: BrochureAIDataSectionsEnum.enum.location },
    { value: 'connectivity', label: 'Connectivity', Component: ConnectivityForm, aiSection: BrochureAIDataSectionsEnum.enum.connectivity },
    { value: 'amenities-intro', label: 'Amenities Intro', Component: AmenitiesIntroForm, aiSection: BrochureAIDataSectionsEnum.enum.amenitiesIntro },
    { value: 'amenities-list', label: 'Amenities List', Component: AmenitiesListForm, aiSection: BrochureAIDataSectionsEnum.enum.amenitiesListTitle },
    { value: 'amenities-grid', label: 'Amenities Grid', Component: AmenitiesGridForm, aiSection: BrochureAIDataSectionsEnum.enum.amenitiesGridTitle },
    { value: 'specs', label: 'Specifications', Component: SpecificationsForm, aiSection: BrochureAIDataSectionsEnum.enum.specificationsTitle },
    { value: 'masterplan', label: 'Master Plan', Component: MasterPlanForm, aiSection: BrochureAIDataSectionsEnum.enum.masterPlan },
    { value: 'floorplans', label: 'Floor Plans', Component: FloorPlansForm, aiSection: BrochureAIDataSectionsEnum.enum.floorPlansTitle },
    { value: 'backcover', label: 'Back Cover', Component: BackCoverForm, aiSection: BrochureAIDataSectionsEnum.enum.backCover },
  ];


  return (
    <FormProvider {...form}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-foreground">
        <Card id="sidebar-container" className="w-full md:w-[400px] lg:w-[450px] h-full flex flex-col rounded-none border-0 border-r md:border-r border-border shadow-md no-print">
          <CardHeader className="p-4 border-b border-border sticky top-0 bg-card z-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
              <CardTitle className="text-xl font-semibold">Brochure Editor</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                 {/* Corrected onClick for "New Theme" / "Generate Brochure" button */}
                 <Button onClick={() => handleGenerateOrUpdateBrochure(true)} size="sm" disabled={globalDisable} className="flex-grow sm:flex-grow-0 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Palette className="mr-2 h-4 w-4" />
                  {showPreview ? 'New Theme' : 'Generate Brochure'}
                </Button>
                <Button onClick={handlePrint} size="sm" disabled={globalDisable || !generatedBrochureData} title="Download Brochure as PDF" className="flex-grow sm:flex-grow-0">
                  {isPrintingRef.current ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isPrintingRef.current ? 'Preparing...' : 'Download PDF'}
                </Button>
              </div>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Fill details &amp; click {showPreview ? '"New Theme"' : '"Generate Brochure"'}. {/* Use AI buttons in sections to enhance content. */}
            </CardDescription>
             {showPreview && (
                <Button onClick={() => handleGenerateOrUpdateBrochure(false)} size="sm" variant="outline" disabled={globalDisable} className="w-full mt-2">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Update Current Preview
                </Button>
            )}
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-0">
              <Tabs defaultValue="cover" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 h-auto rounded-none p-1 gap-0.5 sticky top-0 bg-muted z-10 border-b border-border">
                  {formSections.map(section => (
                    <TabsTrigger key={section.value} value={section.value} className="text-xs px-1 py-1.5 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow">
                      {section.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {formSections.map(section => {
                  const sectionKey = section.value;
                  const commonProps = {
                    form: form,
                    disabled: globalDisable,
                    isGeneratingAi: !!isGeneratingAi[sectionKey],
                    // onAiGenerate: section.aiSection // AI features disabled for now
                    //   ? () => handleAiGenerate(sectionKey, section.aiSection!) 
                    //   : undefined
                  };
                  return (
                    <TabsContent key={section.value} value={section.value} className="p-3 md:p-4 focus-visible:outline-none focus-visible:ring-0 mt-0">
                      <section.Component {...commonProps} />
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </ScrollArea>
        </Card>

        <div className="flex-grow h-full overflow-hidden brochure-preview-container bg-muted/50 dark:bg-gray-800/50">
          {showPreview && generatedBrochureData ? (
            <div className="flex justify-center py-6 px-2 md:py-8 md:px-4 overflow-y-auto h-full">
               <div ref={printableRef} id="printable-brochure-wrapper" className={cn(activeTheme, "transition-all duration-300")}>
                <BrochurePreview data={generatedBrochureData} themeClass={activeTheme} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8">
              <Palette className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Your Brochure Awaits</h3>
              <p className="text-muted-foreground max-w-sm">
                Fill in the details in the editor on the left, then click the "Generate Brochure" button to create and preview your professional real estate brochure.
              </p>
            </div>
          )}
        </div>
      </div>

      {isClient && generatedBrochureData && (
        <div className="hidden print:block print:overflow-visible">
          <PrintableBrochureLoader data={generatedBrochureData} themeClass={activeTheme} />
        </div>
      )}
    </FormProvider>
  );
}

const PrintableBrochureLoader: React.FC<{ data: BrochureData, themeClass: string }> = ({ data, themeClass }) => {
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
