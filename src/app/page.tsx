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
import { Download, Loader2, Palette, RefreshCcw, Wand2, SidebarClose, SidebarOpen } from 'lucide-react';
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
// import { generateBrochureContent, type GenerateBrochureContentInput } from '@/ai/flows/generate-brochure-flow'; // AI features temporarily disabled
import { z } from 'zod'; // Import z for ZodError

interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>;
  aiSection?: BrochureAIDataSection; // Corrected type
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
  const [isGeneratingAi, setIsGeneratingAi] = useState<Record<string, boolean>>({});

  const [generatedBrochureData, setGeneratedBrochureData] = useState<BrochureData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(brochureThemes[0]);
  const [printKey, setPrintKey] = useState(0); // Key to force re-render of printable component
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const printableRef = useRef<HTMLDivElement>(null);

  const form = useForm<BrochureData>({
    resolver: zodResolver(BrochureDataSchema),
    defaultValues: getDefaultBrochureData(),
    mode: 'onChange',
  });

  useEffect(() => {
    setIsClient(true);
    // Set initial theme to default brochure builder theme
    document.documentElement.className = activeTheme;
  }, [activeTheme]);

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
          randomTheme = brochureThemes[0]; // Fallback if only one theme
        }
        setActiveTheme(randomTheme);
         // Update HTML root class for theme change
        document.documentElement.className = randomTheme;
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
    setShowPreview(true); // Ensure preview is shown for printing
    setPrintKey(prev => prev + 1); // Force re-render of PrintableBrochureLoader

    form.trigger(); // Ensure form validation runs
    const currentFormData = form.getValues();

    try {
        const validatedData = BrochureDataSchema.parse(currentFormData);
        setGeneratedBrochureData(validatedData); // Set data for print

        // Wait for DOM updates to complete
        await new Promise(resolve => setTimeout(resolve, 200)); // Increased delay might help complex renders

        toast({ title: "Preparing PDF", description: "Generating printable brochure..." });
        
        // Another delay before calling window.print()
        // This gives browser more time to apply styles and render images
        await new Promise(resolve => setTimeout(resolve, 500));


        window.print();

    } catch (error: any) {
      console.error("Printing failed:", error);
      let errorDesc = "Could not prepare the PDF. Check form data.";
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
         // Reset the generatedBrochureData for print back to current form values for live preview
        const currentFormDataForLive = form.getValues();
        try {
            const validatedLive = BrochureDataSchema.parse(currentFormDataForLive);
            setGeneratedBrochureData(validatedLive);
        } catch {
           // If current form data is invalid, live preview will show last valid state or error
           // Forcing update to ensure consistency even if form becomes invalid.
           console.warn("Form data became invalid after print attempt, live preview might reflect older state or be empty.");
           setGeneratedBrochureData(null); // Or set to form.getValues() if you want to show potentially invalid state
           setShowPreview(false); // Potentially hide preview if data is bad.
        }
      }, 1500); // Increased delay for post-print cleanup
    }
  };


  const handleAiGenerate = async (sectionKey: string, section: BrochureAIDataSection, promptHint?: string) => {
    setIsGeneratingAi(prev => ({ ...prev, [sectionKey]: true }));
    toast({
        title: `AI Content Generation Started`,
        description: `Generating content for ${section}... This may take a moment.`,
    });
    try {
        const currentData = form.getValues();
        // Validate before sending to AI to ensure it's a good base
        BrochureDataSchema.parse(currentData);

        // const aiInput: GenerateBrochureContentInput = { // AI features temporarily disabled
        //     existingData: currentData,
        //     sectionToGenerate: section,
        //     promptHint: promptHint || `Generate content for the ${section} section. Be professional and concise.`,
        // };
        // const aiGeneratedData = await generateBrochureContent(aiInput); // AI features temporarily disabled

        // Dummy AI data for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        const aiGeneratedData = { ...currentData };
        // Example: If section is 'introduction', update relevant fields
        if (section === BrochureAIDataSectionsEnum.enum.introduction) {
           aiGeneratedData.introTitle = currentData.projectName ? `Discover the Excellence of ${currentData.projectName}` : "A New Standard in Living";
           aiGeneratedData.introParagraph1 = `Welcome to ${currentData.projectName || 'this premier development'}. Experience a unique blend of modern design and thoughtful amenities, crafted for an unparalleled lifestyle. This is more than a home; it's a statement.`;
           aiGeneratedData.introParagraph2 = `Located in a prime area, ${currentData.projectName || 'this project'} offers convenience and serenity. Explore the meticulously planned spaces and envision your future here.`;
        } else if (section === BrochureAIDataSectionsEnum.enum.cover && currentData.projectName) {
             aiGeneratedData.projectTagline = `Experience ${currentData.projectName}: Your Gateway to an Inspired Lifestyle.`;
        }
        // Add more dummy generations for other sections as needed based on `section` argument


        Object.keys(aiGeneratedData).forEach(key => {
            form.setValue(key as keyof BrochureData, aiGeneratedData[key as keyof BrochureData] as any, { shouldValidate: true, shouldDirty: true });
        });
        handleGenerateOrUpdateBrochure(false);

        toast({
            title: `AI Content for ${section} Generated (Placeholder)`,
            description: "Content has been updated with AI suggestions. (Currently using placeholder data)",
        });

    } catch (error: any) {
        console.error(`AI Generation Error for ${section}:`, error);
        let description = `Failed to generate content for ${section}.`;
        if (error instanceof z.ZodError) {
            description = `Invalid data before AI generation: ${JSON.stringify(error.flatten().fieldErrors)}`;
        } else if (error.message) {
            description = error.message; // Use the error message from AI flow if available
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
        <Card id="sidebar-container" className={cn(
          "h-full flex flex-col rounded-none border-0 md:border-r border-sidebar-border shadow-lg no-print bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-full md:w-[420px] lg:w-[480px]" : "w-0 md:w-16 overflow-hidden"
        )}>
          <CardHeader className="p-4 border-b border-sidebar-border sticky top-0 bg-sidebar z-20">
             <div className="flex justify-between items-center mb-2">
               {sidebarOpen && <CardTitle className="text-xl font-semibold text-sidebar-primary">Brochure Editor</CardTitle>}
                <Button onClick={() => setSidebarOpen(!sidebarOpen)} size="icon" variant="ghost" className="md:hidden text-sidebar-primary-foreground hover:bg-sidebar-accent">
                    {sidebarOpen ? <SidebarClose /> : <SidebarOpen />}
                </Button>
                 <Button onClick={() => setSidebarOpen(!sidebarOpen)} size="icon" variant="ghost" className="hidden md:flex text-sidebar-primary hover:bg-sidebar-accent">
                    {sidebarOpen ? <SidebarClose /> : <SidebarOpen />}
                </Button>
            </div>
           {sidebarOpen && (
            <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
              <div className="flex gap-2 w-full sm:w-auto">
                 <Button onClick={() => handleGenerateOrUpdateBrochure(true)} size="sm" disabled={globalDisable} className="flex-grow sm:flex-grow-0 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm">
                  <Palette className="mr-2 h-4 w-4" />
                  {showPreview ? 'New Theme' : 'Generate Brochure'}
                </Button>
                <Button onClick={handlePrint} size="sm" disabled={globalDisable || !generatedBrochureData} title="Download Brochure as PDF" className="flex-grow sm:flex-grow-0 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90 shadow-sm">
                  {isPrintingRef.current ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isPrintingRef.current ? 'Preparing...' : 'Download PDF'}
                </Button>
              </div>
            </div>
            <CardDescription className="text-xs text-sidebar-foreground/80 mt-2">
              Fill details &amp; click {showPreview ? '"New Theme"' : '"Generate Brochure"'}.
            </CardDescription>
             {showPreview && (
                <Button onClick={() => handleGenerateOrUpdateBrochure(false)} size="sm" variant="outline" disabled={globalDisable} className="w-full mt-3 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Update Preview
                </Button>
            )}
            </>
           )}
          </CardHeader>
          {sidebarOpen && (
            <ScrollArea className="flex-grow">
                <CardContent className="p-0">
                <Tabs defaultValue="cover" className="w-full" orientation="vertical">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 h-auto rounded-none p-1 gap-0.5 sticky top-0 bg-sidebar-accent/30 z-10 border-b border-sidebar-border">
                    {formSections.map(section => (
                        <TabsTrigger key={section.value} value={section.value} className="text-xs px-1.5 py-2 h-auto data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground data-[state=active]:shadow-md text-sidebar-foreground hover:bg-sidebar-accent/70">
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
                        onAiGenerate: section.aiSection ? (promptHint?: string) => handleAiGenerate(sectionKey, section.aiSection!, promptHint) : undefined
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
           )}
           {!sidebarOpen && ( // Minimal icons when sidebar is collapsed (desktop only)
             <div className="hidden md:flex flex-col items-center mt-4 space-y-2 p-2">
                {formSections.map(section => (
                     <Button key={`${section.value}-icon`} variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-primary hover:bg-sidebar-accent" title={section.label} onClick={() => {
                        setSidebarOpen(true);
                        // Potentially switch tab
                        const tabsInstance = document.querySelector('[data-radix-orientation="vertical"]');
                        if (tabsInstance) {
                            // This is a bit hacky, directly interacting with DOM might be better handled via state
                            const trigger = tabsInstance.querySelector(`button[value="${section.value}"]`) as HTMLButtonElement | null;
                            trigger?.click();
                        }
                     }}>
                        {/* Placeholder - replace with actual icons or a generic edit icon */}
                        <Wand2 className="h-5 w-5" />
                     </Button>
                 ))}
             </div>
           )}
        </Card>

        <div className="flex-grow h-full overflow-hidden brochure-preview-container bg-muted/30 dark:bg-gray-900/50">
          {!showPreview || !generatedBrochureData ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8">
                <Palette className="w-20 h-20 text-muted-foreground/20 mb-6" />
                <h3 className="text-2xl font-semibold text-foreground mb-3">Your Brochure Awaits Creation</h3>
                <p className="text-muted-foreground max-w-md text-sm">
                  Fill in the details for your property in the editor on the left.
                  Once ready, click "Generate Brochure" to see your professional real estate brochure come to life.
                  You can then try different themes or download it as a PDF.
                </p>
              </div>
          ) : (
            <div id="live-preview-content-wrapper" className="flex justify-center py-6 px-2 md:py-8 md:px-4 overflow-y-auto h-full">
               <div ref={printableRef} id="printable-brochure-wrapper-live" className={cn(activeTheme, "transition-all duration-300")}>
                <BrochurePreview data={generatedBrochureData} themeClass={activeTheme} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden div for printing, content managed by PrintableBrochureLoader */}
      {isClient && (
          <div className="hidden print:block print:m-0 print:p-0 print:border-0 print:shadow-none print:overflow-visible">
            {generatedBrochureData && <PrintableBrochureLoader printKey={printKey} data={generatedBrochureData} themeClass={activeTheme} />}
          </div>
      )}
    </FormProvider>
  );
}

const PrintableBrochureLoader: React.FC<{ data: BrochureData, themeClass: string, printKey: number }> = React.memo(({ data, themeClass, printKey }) => {
  // The key on the component instance in Home already forces re-mount for print.
  // This component now just focuses on validating and rendering.
  try {
    const validatedData = BrochureDataSchema.parse(data);
    return <BrochurePreview data={validatedData} themeClass={themeClass} />;
  } catch (error) {
    console.error("Data validation failed for print render:", error);
    // This error display will appear on the printed page if data is invalid.
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
