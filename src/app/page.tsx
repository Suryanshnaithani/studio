
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
import { generateBrochureContent, type GenerateBrochureInput } from '@/ai/flows/generate-brochure-flow';
import { z } from 'zod'; // Import z for ZodError

interface FormSection {
  value: string;
  label: string;
  Component: React.FC<any>; 
  props?: Record<string, any>; 
}


export default function Home() {
  const { toast } = useToast();
  const [brochureData, setBrochureData] = useState<BrochureData>(getDefaultBrochureData());
  const [isClient, setIsClient] = useState(false);
  const [isPrinting, setIsPrinting] = useState(isPrinting);
  const [aiPromptHint, setAiPromptHint] = useState(''); 

  // General AI generation for full brochure
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);

  // Section-specific AI generation states
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false);
  const [isGeneratingDeveloper, setIsGeneratingDeveloper] = useState(false);
  const [isGeneratingLocation, setIsGeneratingLocation] = useState(false);
  const [isGeneratingConnectivity, setIsGeneratingConnectivity] = useState(false);
  const [isGeneratingAmenitiesIntro, setIsGeneratingAmenitiesIntro] = useState(false);
  const [isGeneratingAmenitiesListTitle, setIsGeneratingAmenitiesListTitle] = useState(false);
  const [isGeneratingAmenitiesGridTitle, setIsGeneratingAmenitiesGridTitle] = useState(false);
  const [isGeneratingSpecsTitle, setIsGeneratingSpecsTitle] = useState(false);
  const [isGeneratingMasterPlan, setIsGeneratingMasterPlan] = useState(false);
  const [isGeneratingFloorPlansTitle, setIsGeneratingFloorPlansTitle] = useState(false);

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
          console.warn("Form watch update - validation failed (likely intermediate state):", parsedData.error.flatten().fieldErrors);
        }
      } catch (error) {
        console.error("Form watch update unexpected error:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const anySectionGenerating = isGeneratingIntro || isGeneratingDeveloper || isGeneratingLocation || isGeneratingConnectivity || isGeneratingAmenitiesIntro || isGeneratingAmenitiesListTitle || isGeneratingAmenitiesGridTitle || isGeneratingSpecsTitle || isGeneratingMasterPlan || isGeneratingFloorPlansTitle;
  const globalDisable = isPrinting || isGeneratingFull || anySectionGenerating;


  const handlePrint = async () => {
    if (typeof window !== 'undefined') {
      setIsPrinting(true);
      try {
        const currentFormData = form.getValues();
        const validatedData = BrochureDataSchema.parse(currentFormData);
        setBrochureData(validatedData); 
        toast({ title: "Preparing PDF", description: "Generating printable brochure..." });
        await new Promise(resolve => setTimeout(resolve, 300));
        window.print(); 
      } catch (error: any) {
          console.error("Validation or Printing failed:", error);
          let description = "Could not generate the PDF. Please try again.";
           if (error instanceof z.ZodError) {
               description = "Form data is invalid. Please check the form fields for errors.";
                toast({
                    variant: "destructive",
                    title: "Invalid Form Data",
                    description: "Please check the highlighted fields before printing.",
                });
           } else {
                toast({
                    variant: "destructive",
                    title: "Printing Error",
                    description: description,
                });
           }
      } finally {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setIsPrinting(false);
      }
    }
  };

   const handleGenerateFullContent = async () => {
    setIsGeneratingFull(true);
    toast({ title: "AI Enhancement Started", description: "AI is processing your brochure data..." });
    try {
        const currentFormData = form.getValues();
        const aiInput: GenerateBrochureInput = {
            promptHint: aiPromptHint,
            existingData: currentFormData,
            // No sectionToGenerate, so AI enhances full brochure
        };
        const generatedData = await generateBrochureContent(aiInput);
        form.reset(generatedData); // Reset form with all new data
        setBrochureData(generatedData); // Update preview
        toast({ title: "AI Enhancement Complete", description: "Brochure content has been updated." });
    } catch (error: any) {
      console.error("AI Enhancement failed:", error);
       let description = "Could not enhance content. Please try again.";
        if (error instanceof z.ZodError) {
            description = "AI returned data that could not be validated. Please check the console for details.";
        } else if (error.message) {
            description = error.message;
        }
       toast({
        variant: "destructive",
        title: "AI Enhancement Error",
        description: description,
      });
    } finally {
      setIsGeneratingFull(false);
    }
  };

  // Generic section content generator
  const handleGenerateSectionContent = async (
    section: GenerateBrochureInput['sectionToGenerate'],
    setIsLoading: (loading: boolean) => void,
    fieldsToUpdate: (keyof BrochureData)[],
    toastTitle: string
  ) => {
    if (!section) return;
    setIsLoading(true);
    toast({ title: `AI ${toastTitle} Generation`, description: `AI is crafting content for ${toastTitle.toLowerCase()}...` });
    try {
      const currentFormData = form.getValues();
      const aiInput: GenerateBrochureInput = {
        promptHint: `Generate content for the ${section} section.`,
        existingData: currentFormData,
        sectionToGenerate: section,
      };

      const aiGeneratedFullData = await generateBrochureContent(aiInput);

      fieldsToUpdate.forEach(fieldName => {
        // @ts-ignore
        form.setValue(fieldName, aiGeneratedFullData[fieldName], { shouldValidate: true, shouldDirty: true });
      });
      
      setBrochureData(prev => BrochureDataSchema.parse({
        ...prev,
        ...fieldsToUpdate.reduce((acc, fieldName) => {
          // @ts-ignore
          acc[fieldName] = aiGeneratedFullData[fieldName];
          return acc;
        }, {} as Partial<BrochureData>)
      }));

      toast({ title: `AI ${toastTitle} Complete`, description: `${toastTitle} has been updated.` });
    } catch (error: any) {
      console.error(`AI ${toastTitle} Generation failed:`, error);
      let description = `Could not generate ${toastTitle.toLowerCase()}. Please try again.`;
      if (error instanceof z.ZodError) {
        description = `AI returned data for ${toastTitle.toLowerCase()} that could not be validated.`;
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: `AI ${toastTitle} Error`,
        description: description,
      });
    } finally {
      setIsLoading(false);
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
    { value: 'cover', label: 'Cover', Component: CoverForm, props: { disabled: globalDisable } },
    { 
      value: 'intro', 
      label: 'Introduction', 
      Component: IntroductionForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('introduction', setIsGeneratingIntro, ['introTitle', 'introParagraph1', 'introParagraph2', 'introParagraph3'], "Introduction"),
        isGeneratingContent: isGeneratingIntro,
        disabled: globalDisable,
      } 
    },
    { 
      value: 'developer', 
      label: 'Developer', 
      Component: DeveloperForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('developer', setIsGeneratingDeveloper, ['developerDesc1', 'developerDesc2'], "Developer Info"),
        isGeneratingContent: isGeneratingDeveloper,
        disabled: globalDisable,
      } 
    },
    { 
      value: 'location', 
      label: 'Location', 
      Component: LocationForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('location', setIsGeneratingLocation, ['locationDesc1', 'locationDesc2', 'locationNote'], "Location Details"),
        isGeneratingContent: isGeneratingLocation,
        disabled: globalDisable,
      }  
    },
    { 
      value: 'connectivity', 
      label: 'Connectivity', 
      Component: ConnectivityForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('connectivity', setIsGeneratingConnectivity, ['connectivityNote'], "Connectivity Note"),
        isGeneratingContent: isGeneratingConnectivity,
        disabled: globalDisable,
      }
    },
    { 
      value: 'amenities-intro', 
      label: 'Amenities Intro', 
      Component: AmenitiesIntroForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('amenitiesIntro', setIsGeneratingAmenitiesIntro, ['amenitiesIntroP1', 'amenitiesIntroP2', 'amenitiesIntroP3'], "Amenities Intro"),
        isGeneratingContent: isGeneratingAmenitiesIntro,
        disabled: globalDisable,
      }
    },
    { 
      value: 'amenities-list', 
      label: 'Amenities List', 
      Component: AmenitiesListForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('amenitiesListTitle', setIsGeneratingAmenitiesListTitle, ['amenitiesListTitle'], "Amenities List Title"),
        isGeneratingContent: isGeneratingAmenitiesListTitle,
        disabled: globalDisable,
      }
    },
    { 
      value: 'amenities-grid', 
      label: 'Amenities Grid', 
      Component: AmenitiesGridForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('amenitiesGridTitle', setIsGeneratingAmenitiesGridTitle, ['amenitiesGridTitle'], "Amenities Grid Title"),
        isGeneratingContent: isGeneratingAmenitiesGridTitle,
        disabled: globalDisable,
      }
    },
    { 
      value: 'specs', 
      label: 'Specifications', 
      Component: SpecificationsForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('specificationsTitle', setIsGeneratingSpecsTitle, ['specsTitle'], "Specifications Title"),
        isGeneratingContent: isGeneratingSpecsTitle,
        disabled: globalDisable,
      }
    },
    { 
      value: 'masterplan', 
      label: 'Master Plan', 
      Component: MasterPlanForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('masterPlan', setIsGeneratingMasterPlan, ['masterPlanDesc1', 'masterPlanDesc2'], "Master Plan Details"),
        isGeneratingContent: isGeneratingMasterPlan,
        disabled: globalDisable,
      }
    },
    { 
      value: 'floorplans', 
      label: 'Floor Plans', 
      Component: FloorPlansForm, 
      props: { 
        onGenerateContent: () => handleGenerateSectionContent('floorPlansTitle', setIsGeneratingFloorPlansTitle, ['floorPlansTitle'], "Floor Plans Title"),
        isGeneratingContent: isGeneratingFloorPlansTitle,
        disabled: globalDisable,
      }
    },
    { value: 'backcover', label: 'Back Cover', Component: BackCoverForm, props: { disabled: globalDisable } },
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
                   <CardDescription className="text-xs text-muted-foreground mb-1">Enhance content or fill missing fields for the entire brochure.</CardDescription>
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
                     <Button onClick={handleGenerateFullContent} size="sm" variant="outline" disabled={globalDisable} title="Use AI to enhance or complete the entire brochure content">
                       {isGeneratingFull ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       ) : (
                          <Wand2 className="mr-2 h-4 w-4" />
                       )}
                       {isGeneratingFull ? 'Working...' : 'Enhance All'}
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
                                  <section.Component form={form} {...section.props} />
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

        <div className="hidden print:block print:overflow-visible" ref={printableRef}>
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
            <div className="p-10 text-red-600 font-bold text-center" style={{ pageBreakBefore: 'always', height: '297mm', width: '210mm', boxSizing: 'border-box', border: '2px dashed red' }}>
                <h1>Brochure Generation Error</h1>
                <p className="mt-4">The brochure data is incomplete or invalid and cannot be printed.</p>
                <p className="mt-2">Please correct the errors in the editor before downloading the PDF.</p>
                {error instanceof z.ZodError && (
                    <pre className="mt-4 text-left text-xs bg-red-100 p-2 overflow-auto">
                        {JSON.stringify(error.flatten().fieldErrors, null, 2)}
                    </pre>
                )}
            </div>
        );
    }
};
