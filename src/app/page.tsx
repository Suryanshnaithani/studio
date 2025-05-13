// @ts-nocheck
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
import { Download, Loader2, Palette, RefreshCcw, Wand2 } from 'lucide-react';
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

// AI generation functionality (currently disabled, can be re-enabled)
// import { generateBrochureContent, type GenerateBrochureInput } from '@/ai/flows/generate-brochure-flow'; 
import { z } from 'zod';

interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>;
  aiSection?: BrochureAIDataSection; // Kept for potential future AI re-integration
}

const brochureThemes = [
  "theme-brochure-builder", 
  "theme-elegant-serif",
  "theme-cool-modern",
];

export default function Home() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const isPrintingRef = useRef(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<Record<string, boolean>>({}); // Kept for AI

  const [generatedBrochureData, setGeneratedBrochureData] = useState<BrochureData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(brochureThemes[0]);
  const [printKey, setPrintKey] = useState(0); // Key to force re-render of printable component

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


  const handleGenerateOrUpdateBrochure = (newThemeChange: boolean = false) => {
    try {
      const currentFormData = form.getValues();
      const validatedData = BrochureDataSchema.parse(currentFormData);
      setGeneratedBrochureData(validatedData);

      if (newThemeChange) { 
        let randomTheme = activeTheme;
        if (brochureThemes.length > 1) {
          while(randomTheme === activeTheme) {
            randomTheme = brochureThemes[Math.floor(Math.random() * brochureThemes.length)];
          }
        } else {
          randomTheme = brochureThemes[0];
        }
        setActiveTheme(randomTheme);
      }

      if (!showPreview) { 
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
       if (isPrintingRef.current) throw error; // Rethrow if printing so handlePrint can catch
    }
  };


  const debouncedUpdatePreview = useRef(
    debounce(() => {
      if (showPreview && !isPrintingRef.current) {
        handleGenerateOrUpdateBrochure(false); 
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

    // Force a state update to ensure PrintComponent re-renders with latest data
    setPrintKey(prev => prev + 1); // This will trigger re-render of PrintableBrochureLoader via its key

    form.trigger(); // This validates all fields
    const currentFormData = form.getValues(); // Get latest values after trigger
    
    try {
        const validatedData = BrochureDataSchema.parse(currentFormData);
        setGeneratedBrochureData(validatedData); // Update state used by PrintableBrochureLoader

        // Wait for React to commit state updates and for print CSS to apply.
        // This ensures PrintableBrochureLoader has the latest data & styles.
        await new Promise(resolve => setTimeout(resolve, 100)); 

        toast({ title: "Preparing PDF", description: "Generating printable brochure..." });
        
        // Additional delay to allow browser to render complex elements before printing
        await new Promise(resolve => setTimeout(resolve, 400)); // Total delay 500ms

        window.print();

    } catch (error: any) {
      console.error("Printing failed:", error);
      let errorDesc = "Could not prepare the PDF for printing. Please check form data and try again.";
       if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
          .join('; ');
          errorDesc = `Invalid data: ${errorMessages}`;
       }
      toast({
        variant: "destructive",
        title: "Printing Error",
        description: errorDesc,
        duration: 7000
      });
    } finally {
      setTimeout(() => {
        isPrintingRef.current = false;
      }, 1000); 
    }
  };

  // AI Generate function (currently unused, kept for potential re-integration)
  const handleAiGenerate = async (sectionKey: string, section: BrochureAIDataSection, promptHint?: string) => {
    setIsGeneratingAi(prev => ({ ...prev, [sectionKey]: true }));
    try {
        const currentData = form.getValues();
        BrochureDataSchema.parse(currentData); // Validate before sending
        
        // const aiInput: GenerateBrochureInput = { // Type from generate-brochure-flow
        //     existingData: currentData,
        //     sectionToGenerate: section,
        //     promptHint: promptHint || `Generate content for the ${section} section.`,
        // };
        // const aiGeneratedData = await generateBrochureContent(aiInput); // Call to AI flow

        // Object.keys(aiGeneratedData).forEach(key => {
        //     form.setValue(key as keyof BrochureData, aiGeneratedData[key as keyof BrochureData] as any, { shouldValidate: true, shouldDirty: true });
        // });
        // handleGenerateOrUpdateBrochure(false); // Update preview

        toast({
            title: `AI Content for ${section} (Simulated)`,
            description: "AI generation is currently disabled. This is a placeholder action.",
        });

    } catch (error: any) {
        console.error(`AI Generation Error for ${section}:`, error);
        let description = `Failed to generate content for ${section}. AI features are currently inactive.`;
        if (error instanceof z.ZodError) {
            description = `Invalid data before AI generation: ${JSON.stringify(error.flatten().fieldErrors)}`;
        } else if (error.message) {
            description = error.message;
        }
        toast({
            variant: "destructive",
            title: "AI Generation Failed",
            description: description,
            duration: 7000,
        });
    } finally {
        setIsGeneratingAi(prev => ({ ...prev, [sectionKey]: false }));
    }
  };


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
        <Card id="sidebar-container" className="w-full md:w-[400px] lg:w-[450px] h-full flex flex-col rounded-none border-0 border-r md:border-r border-border shadow-md no-print bg-card text-card-foreground">
          <CardHeader className="p-4 border-b border-border sticky top-0 bg-card z-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
              <CardTitle className="text-xl font-semibold">Brochure Editor</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
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
              Fill details &amp; click {showPreview ? '"New Theme"' : '"Generate Brochure"'}.
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
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 h-auto rounded-none p-1 gap-0.5 sticky top-0 bg-muted z-10 border-b border-border">
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
                    // AI features are currently disabled. Pass undefined or a dummy handler.
                    isGeneratingAi: false, // !!isGeneratingAi[sectionKey],
                    onAiGenerate: undefined, // section.aiSection ? (promptHint?: string) => handleAiGenerate(sectionKey, section.aiSection!, promptHint) : undefined
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

        <div className="flex-grow h-full overflow-hidden brochure-preview-container bg-muted/40 dark:bg-gray-900/60">
          {showPreview && generatedBrochureData ? (
            <div id="live-preview-content-wrapper" className="flex justify-center py-6 px-2 md:py-8 md:px-4 overflow-y-auto h-full">
               <div ref={printableRef} id="printable-brochure-wrapper-live" className={cn(activeTheme, "transition-all duration-300")}>
                <BrochurePreview key={`screen-${printKey}-${activeTheme}`} data={generatedBrochureData} themeClass={activeTheme} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8">
              <Palette className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Your Brochure Awaits</h3>
              <p className="text-muted-foreground max-w-sm">
                Fill in the details in the editor on the left, then click "Generate Brochure" to create and preview your professional real estate brochure.
              </p>
            </div>
          )}
        </div>
      </div>

      {isClient && generatedBrochureData && (
        <div className="hidden print:block print:m-0 print:p-0 print:border-0 print:shadow-none print:overflow-visible">
          <PrintableBrochureLoader key={`print-${printKey}-${activeTheme}`} data={generatedBrochureData} themeClass={activeTheme} />
        </div>
      )}
    </FormProvider>
  );
}

const PrintableBrochureLoader: React.FC<{ data: BrochureData, themeClass: string, key?: string }> = React.memo(({ data, themeClass, key }) => {
  try {
    // Ensure data is validated before rendering. This is critical for print.
    const validatedData = BrochureDataSchema.parse(data);
    return <BrochurePreview key={key} data={validatedData} themeClass={themeClass} />;
  } catch (error) {
    console.error("Data validation failed for print render:", error);
    // Return a visible error page for print if data is invalid
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
});
PrintableBrochureLoader.displayName = 'PrintableBrochureLoader';
