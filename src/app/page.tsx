
// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrochureDataSchema, type BrochureData, getDefaultBrochureData, BrochureAIDataSectionsEnum, type BrochureAIDataSection } from '@/components/brochure/data-schema';
import { BrochurePreview } from '@/components/brochure/brochure-preview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Loader2, Palette, RefreshCcw, SidebarClose, SidebarOpen, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation'; 
import { z } from 'zod';


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


interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>;
  fieldsToGenerate?: (keyof BrochureData)[]; 
  generationPromptHint?: string; 
}


const brochureThemes = [
  "theme-brochure-builder",
  "theme-elegant-serif",
  "theme-cool-modern",
  "theme-classic-blue",
  "theme-modern-green",
];


export default function Home() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const isPrintingRef = useRef(false); 
  const dataLoadedRef = useRef<string | null>(null);


  const [generatedBrochureData, setGeneratedBrochureData] = useState<BrochureData | null>(null);
  const [showPreview, setShowPreview] = useState(false); 
  const [activeTheme, setActiveTheme] = useState<string>(brochureThemes[0]);
  const [printKey, setPrintKey] = useState(0); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('cover');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();


  const printableRef = useRef<HTMLDivElement>(null);

  const form = useForm<BrochureData>({
    resolver: zodResolver(BrochureDataSchema),
    defaultValues: getDefaultBrochureData(),
    mode: 'onChange',
  });

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      document.documentElement.className = activeTheme;
    }
  }, [activeTheme]);

 useEffect(() => {
    if (showPreview && generatedBrochureData) {
      setPlaceholderVisible(false);
      const timer = setTimeout(() => setPreviewVisible(true), 50); 
      return () => clearTimeout(timer);
    } else {
      setPreviewVisible(false);
      
      const timer = setTimeout(() => setPlaceholderVisible(true), showPreview ? 50 : 550);
      return () => clearTimeout(timer);
    }
  }, [showPreview, generatedBrochureData]);


 const handleGenerateOrUpdateBrochure = useCallback((newThemeChange: boolean = false, firstTimeGeneration: boolean = false) => {
    try {
      const currentFormData = form.getValues();
      const validatedData = BrochureDataSchema.parse(currentFormData);
      setGeneratedBrochureData(validatedData);

      if (newThemeChange) {
        let randomTheme = activeTheme;
        if (brochureThemes.length > 1) {
          const availableThemes = brochureThemes.filter(t => t !== activeTheme);
          randomTheme = availableThemes.length > 0 
            ? availableThemes[Math.floor(Math.random() * availableThemes.length)] 
            : brochureThemes[0];
        } else {
          randomTheme = brochureThemes[0];
        }
        setActiveTheme(randomTheme);
         toast({ title: "Theme Changed", description: "New theme applied to the brochure." });
      } else if (showPreview && !firstTimeGeneration) { 
         toast({ title: "Brochure Updated", description: "Preview reflects the latest data." });
      }

      if (!showPreview || firstTimeGeneration) {
        setShowPreview(true);
        if (firstTimeGeneration && !newThemeChange) { 
           toast({ title: "Brochure Generated", description: "Preview is now visible." });
        }
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
  }, [form, activeTheme, showPreview, toast, setGeneratedBrochureData, setActiveTheme, setShowPreview]);


  const debouncedUpdatePreview = useRef(
    debounce(() => {
      if (showPreview && !isPrintingRef.current && !isGeneratingAI) { 
        handleGenerateOrUpdateBrochure(false);
      }
    }, 750)
  ).current;

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && showPreview && !isPrintingRef.current && !isGeneratingAI) {
        debouncedUpdatePreview();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedUpdatePreview, showPreview, isGeneratingAI]);


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
    
    toast({ title: "Preparing PDF", description: "Generating printable brochure..." });

    try {
        await form.trigger(); 
        const currentFormData = form.getValues();
        const validatedDataForPrint = BrochureDataSchema.parse(currentFormData);
        
        setGeneratedBrochureData(validatedDataForPrint);
        document.documentElement.className = activeTheme; 
        setPrintKey(prev => prev + 1); 

        await new Promise(resolve => setTimeout(resolve, 300)); 
        
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
        
        const currentLiveFormData = form.getValues();
        try {
            const validatedLive = BrochureDataSchema.parse(currentLiveFormData);
            setGeneratedBrochureData(validatedLive);
        } catch (parseError) {
           console.warn("Form data might be invalid post-print; live preview might reflect older state or be empty.", parseError);
           setGeneratedBrochureData(currentLiveFormData as BrochureData);
        }
      }, 2500); 
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const dataKey = searchParams.get('dataKey');

    if (dataKey && dataLoadedRef.current !== dataKey) {
        const loadRemoteData = async () => {
            try {
                toast({ title: "Loading Data...", description: `Fetching brochure data for key: ${dataKey}` });
                const response = await fetch(`/api/brochure/data?dataKey=${dataKey}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
                    throw new Error(errorData.error || `Failed to fetch data: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && result.data) {
                    const validatedData = BrochureDataSchema.parse(result.data);
                    form.reset(validatedData);
                    setGeneratedBrochureData(validatedData);
                    setShowPreview(true); 
                    setPreviewVisible(true); 
                    setPlaceholderVisible(false);
                    toast({ title: "Data Loaded", description: "Brochure data has been populated." });
                    dataLoadedRef.current = dataKey;

                    
                    const currentPath = window.location.pathname;
                    const newSearchParams = new URLSearchParams(window.location.search);
                    newSearchParams.delete('dataKey');
                    const newUrl = `${currentPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`;
                    router.replace(newUrl, { scroll: false }); 

                } else {
                    throw new Error(result.error || "Failed to load data from API.");
                }
            } catch (error: any) {
                console.error("Failed to load data from API:", error);
                let description = "Could not load pre-filled brochure data.";
                if (error instanceof z.ZodError) {
                    description = "Loaded data is invalid. Please check the source.";
                } else if (error.message) {
                    description = error.message;
                }
                toast({
                    variant: "destructive",
                    title: "Data Load Error",
                    description: description,
                    duration: 7000
                });
            }
        };
        loadRemoteData();
    }
  }, [isClient, searchParams, form, setGeneratedBrochureData, setShowPreview, toast, router]);


  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Brochure Builder...</p>
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

  const globalDisable = isPrintingRef.current || isGeneratingAI;


  return (
    <FormProvider {...form}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-muted/30 dark:bg-background/10 text-foreground">
        <Card id="sidebar-container" className={cn(
          "h-full flex flex-col rounded-none border-0 md:border-r border-sidebar-border shadow-lg no-print bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-full md:w-[420px] lg:w-[480px]" : "w-0 md:w-16 overflow-hidden"
        )}>
           <CardHeader className="p-4 border-b border-sidebar-border sticky top-0 bg-sidebar z-20">
             <div className="flex justify-between items-center mb-2">
               {sidebarOpen && <CardTitle className="text-xl font-semibold text-sidebar-primary">Brochure Editor</CardTitle>}
                <Button onClick={() => setSidebarOpen(!sidebarOpen)} size="icon" variant="ghost" className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent">
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
                <Button 
                    onClick={() => handleGenerateOrUpdateBrochure(true, !showPreview)} 
                    size="sm" 
                    disabled={globalDisable} 
                    className="flex-grow sm:flex-grow-0 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm"
                    title={showPreview ? "Apply a new random theme" : "Generate the brochure preview"}
                >
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
               Fill details &amp; click {showPreview ? '"New Theme" or "Update Preview"' : '"Generate Brochure"'}.
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
                <Tabs defaultValue="cover" className="w-full" orientation="vertical" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 h-auto rounded-none p-1 gap-0.5 sticky top-0 bg-sidebar z-10 border-b border-sidebar-border transform-gpu">
                    {formSections.map(section => (
                        <TabsTrigger key={section.value} value={section.value} className="text-xs px-1.5 py-2 h-auto data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground data-[state=active]:shadow-md text-sidebar-foreground hover:bg-sidebar-accent/70">
                        {section.label}
                        </TabsTrigger>
                    ))}
                    </TabsList>
                    {formSections.map(section => {
                    const commonProps = {
                        form: form,
                        disabled: globalDisable,
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
           {!sidebarOpen && (
             <div className="hidden md:flex flex-col items-center mt-4 space-y-2 p-2">
                {formSections.map(section => (
                     <Button key={`${section.value}-icon`} variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-primary hover:bg-sidebar-accent" title={section.label} onClick={() => {
                        setSidebarOpen(true);
                        
                        setTimeout(() => {
                            setActiveTab(section.value);
                            
                            const contentEl = document.querySelector(`div[role="tabpanel"][data-state="active"][data-orientation="vertical"]`);
                            contentEl?.scrollIntoView({ behavior: 'smooth', block: 'start'});
                        }, 100); 
                     }}>
                        <Edit className="h-5 w-5" />
                     </Button>
                 ))}
             </div>
           )}
        </Card>

        <div className="flex-grow h-full overflow-y-auto brochure-preview-container bg-muted/40 dark:bg-background/30 print:bg-transparent print:p-0">
          {!showPreview || !generatedBrochureData ? (
              <div className={cn(
                "flex flex-col items-center justify-center h-full text-center p-6 md:p-8 transition-opacity duration-500 ease-in-out",
                 placeholderVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              )}>
                <Palette className="w-20 h-20 text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-semibold text-foreground mb-3">Your Brochure Awaits Creation</h3>
                <p className="text-muted-foreground max-w-md text-sm">
                  Fill in the details for your property in the editor on the left.
                  Once ready, click "Generate Brochure" to see your professional real estate brochure come to life.
                  You can then try different themes or download it as a PDF.
                </p>
              </div>
          ) : (
            <div id="live-preview-content-wrapper" className={cn(
                "flex justify-center py-6 px-2 md:py-8 md:px-4 overflow-y-auto h-full transition-opacity duration-700 ease-in-out",
                previewVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              )}>
               <div ref={printableRef} id="printable-brochure-wrapper" className={cn(activeTheme, "transition-all duration-300")}>
                <BrochurePreview data={generatedBrochureData} themeClass={activeTheme} />
              </div>
            </div>
          )}
        </div>
      </div>

      {isClient && (
          <div id="print-only-section-wrapper" className="hidden print:block">
            {generatedBrochureData && ( 
              <PrintableBrochureLoader 
                data={generatedBrochureData} 
                themeClass={activeTheme}
                printKeyProp={`print-${printKey}-${activeTheme}`} 
              />
            )}
          </div>
      )}
    </FormProvider>
  );
}


const PrintableBrochureLoader: React.FC<{ data: BrochureData, themeClass: string, printKeyProp: string }> = React.memo(({ data, themeClass, printKeyProp }) => {
  try {
    const validatedData = BrochureDataSchema.parse(data);
    return <BrochurePreview data={validatedData} themeClass={themeClass} />;
  } catch (error) {
    console.error("Data validation failed for print render:", error);
    return (
      <div className={cn('p-10 text-red-600 font-bold text-center page page-light-bg', themeClass)} style={{ boxSizing: 'border-box', border: '2px dashed red', backgroundColor: 'white' }}>
        <h1>Brochure Generation Error (for Print)</h1>
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
