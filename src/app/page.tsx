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
import { Download, Loader2, Sparkles, Wand2, Palette, RefreshCcw } from 'lucide-react';
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

// AI features are currently disabled
// import { generateBrochureContent, type GenerateBrochureInput } from '@/ai/flows/generate-brochure-flow';
import { z } from 'zod'; // Import z for ZodError

interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>;
  props?: Record<string, any>;
  aiSection?: SpecificFieldGeneratingSection;
  aiFields?: (keyof BrochureData)[];
}

const brochureThemes = [
  "theme-default-minimal",
  "theme-high-contrast",
  "theme-grey-wash",
  "theme-warm-professional",
  "theme-cool-modern",
  "theme-elegant-serif"
];

export default function Home() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<Record<string, boolean>>({}); // Track AI generation per section

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
  const globalDisable = isPrinting || isAnyAiGenerating;

  const handleGenerateOrUpdateBrochure = (newTheme: boolean = false) => {
    try {
      const currentFormData = form.getValues();
      const validatedData = BrochureDataSchema.parse(currentFormData);
      setGeneratedBrochureData(validatedData);

      if (newTheme || !showPreview) {
        const randomTheme = brochureThemes[Math.floor(Math.random() * brochureThemes.length)];
        setActiveTheme(randomTheme);
      }

      setShowPreview(true);
      toast({ title: "Brochure Updated", description: "Preview reflects the latest data." });
    } catch (error: any) {
      console.error("Validation failed for brochure generation/update:", error);
      let description = "Could not update the brochure. Please check the form data.";
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
          title: "Update Error",
          description: description,
          duration: 7000
        });
      }
    }
  };

  // Debounced version of handleGenerateOrUpdateBrochure for live updates
  const debouncedUpdatePreview = useRef(
    debounce(() => {
      if (showPreview) { // Only auto-update if preview is already visible
        handleGenerateOrUpdateBrochure(false); // Don't change theme on auto-update
      }
    }, 750)
  ).current;

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && showPreview) {
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
    if (typeof window !== 'undefined' && generatedBrochureData) {
      setIsPrinting(true);
      try {
        handleGenerateOrUpdateBrochure(false); // Ensure latest data is used for print
        await new Promise(resolve => setTimeout(resolve, 100)); // Ensure UI updates with latest data
        toast({ title: "Preparing PDF", description: "Generating printable brochure..." });
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
        // Use a double requestAnimationFrame to ensure print dialog is closed
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

  const handleAiGenerate = async (sectionKey: string, section: SpecificFieldGeneratingSection, fieldPaths?: string[]) => {
    toast({ title: "AI Feature Disabled", description: "AI content generation is currently not available." });
    return;
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
    { value: 'cover', label: 'Cover', Component: CoverForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.cover, aiFields: ['projectName', 'projectTagline'] },
    { value: 'intro', label: 'Introduction', Component: IntroductionForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.introduction, aiFields: ['introTitle', 'introParagraph1', 'introParagraph2', 'introParagraph3'] },
    { value: 'developer', label: 'Developer', Component: DeveloperForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.developer, aiFields: ['developerName', 'developerDesc1', 'developerDesc2'] },
    { value: 'location', label: 'Location', Component: LocationForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.location, aiFields: ['locationTitle', 'locationDesc1', 'locationDesc2', 'keyDistances', 'locationNote'] },
    { value: 'connectivity', label: 'Connectivity', Component: ConnectivityForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.connectivity, aiFields: ['connectivityTitle', 'connectivityNote'] },
    { value: 'amenities-intro', label: 'Amenities Intro', Component: AmenitiesIntroForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.amenitiesIntro, aiFields: ['amenitiesIntroTitle', 'amenitiesIntroP1', 'amenitiesIntroP2', 'amenitiesIntroP3'] },
    { value: 'amenities-list', label: 'Amenities List', Component: AmenitiesListForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.amenitiesListTitle, aiFields: ['amenitiesListTitle', 'amenitiesWellness', 'amenitiesRecreation'] },
    { value: 'amenities-grid', label: 'Amenities Grid', Component: AmenitiesGridForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.amenitiesGridTitle, aiFields: ['amenitiesGridTitle', 'amenitiesGridLabel1', 'amenitiesGridLabel2', 'amenitiesGridLabel3', 'amenitiesGridLabel4'] },
    { value: 'specs', label: 'Specifications', Component: SpecificationsForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.specificationsTitle, aiFields: ['specsTitle', 'specsInterior', 'specsBuilding'] },
    { value: 'masterplan', label: 'Master Plan', Component: MasterPlanForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.masterPlan, aiFields: ['masterPlanTitle', 'masterPlanDesc1', 'masterPlanDesc2'] },
    { value: 'floorplans', label: 'Floor Plans', Component: FloorPlansForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.floorPlansTitle, aiFields: ['floorPlansTitle' /* Individual floor plan fields handled by its component/AI */] },
    { value: 'backcover', label: 'Back Cover', Component: BackCoverForm, aiSection: SpecificFieldGeneratingSectionsEnum.enum.backCover, aiFields: ['callToAction', 'contactTitle', 'fullDisclaimer'] },
  ];


  return (
    <FormProvider {...form}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-foreground">
        <Card id="sidebar-container" className="w-full md:w-[400px] lg:w-[450px] h-full flex flex-col rounded-none border-0 border-r md:border-r border-border shadow-md">
          <CardHeader className="p-4 border-b border-border sticky top-0 bg-card z-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
              <CardTitle className="text-xl font-semibold">Brochure Editor</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={() => handleGenerateOrUpdateBrochure(true)} size="sm" disabled={globalDisable} className="flex-grow sm:flex-grow-0 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Palette className="mr-2 h-4 w-4" />
                  {showPreview ? 'New Theme' : 'Generate Brochure'}
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
              Fill details &amp; click {showPreview ? '"New Theme"' : '"Generate Brochure"'} for a unique look. AI features are currently disabled.
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
                    onAiGenerate: section.aiSection
                      ? () => toast({ title: "AI Feature Disabled" })
                      : undefined
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

      {showPreview && generatedBrochureData && (
        <div className="hidden print:block print:overflow-visible">
          <PrintableBrochureLoader data={generatedBrochureData} themeClass={activeTheme} />
        </div>
      )}
    </FormProvider>
  );
}

// This component is only for the print media query, ensuring the latest data is rendered.
const PrintableBrochureLoader: React.FC<{ data: Partial<BrochureData>, themeClass: string }> = ({ data, themeClass }) => {
  try {
    // Ensure data is valid before attempting to render for print
    const validatedData = BrochureDataSchema.parse(data);
    return <BrochurePreview data={validatedData} themeClass={themeClass} />;
  } catch (error) {
    console.error("Data validation failed for print render:", error);
    // Basic error display for print, if data is malformed
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
