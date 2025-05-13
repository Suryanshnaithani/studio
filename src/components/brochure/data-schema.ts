import { z } from 'zod';

// Reusable schema for optional URLs that can be empty strings
const optionalUrlSchema = (message: string = "Invalid URL format. Must be a valid URL or empty.") =>
  z.string()
    .transform(val => val === null || val === undefined ? "" : val) 
    .refine((val) => val === '' || z.string().url({message: "Please enter a valid URL (e.g., http://example.com) or leave empty."}).safeParse(val).success, { message })
    .optional()
    .default('');

// Reusable schema for optional emails that can be empty strings
const optionalEmailSchema = (message: string = "Invalid email format. Must be a valid email or empty.") =>
  z.string()
    .transform(val => val === null || val === undefined ? "" : val)
    .refine((val) => val === '' || z.string().email({message: "Please enter a valid email address (e.g., user@example.com) or leave empty."}).safeParse(val).success, { message })
    .optional()
    .default('');


const FloorPlanSchema = z.object({
  id: z.string().optional().default(() => `fp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
  name: z.string().min(1, 'Floor plan name is required').default('New Floor Plan'),
  area: z.string().min(1, 'Area is required').default('0 sq. ft.'),
  features: z.array(z.string().min(1, "Feature description cannot be empty.")).min(1, 'At least one feature is required').default(['Feature 1']),
  image: optionalUrlSchema("Invalid URL format for floor plan image.").describe("URL for the floor plan image. Use picsum.photos or leave empty."),
});

const AmenityGridItemSchema = z.object({
  id: z.string().optional().default(() => `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
  image: optionalUrlSchema("Invalid URL for grid image.").describe("URL for the grid item image. Use picsum.photos or leave empty."),
  label: z.string().min(1, "Amenity label cannot be empty.").default('New Amenity').describe("Label for the grid item."),
});


export const BrochureDataSchema = z.object({
  // Cover Page
  projectName: z.string().min(1, "Project name is required.").default('Untitled Project'),
  projectTagline: z.string().default('Your compelling tagline here'),
  coverImage: optionalUrlSchema().describe("URL for the main cover image."),
  projectLogo: optionalUrlSchema().describe("URL for the project logo."),
  reraInfo: z.string().default('RERA No: PENDING | Project Approved by State RERA Authority.\nFull details: state.rera.gov.in/project/your-project-name'),

  // Introduction
  introTitle: z.string().default('Welcome to [Project Name]'),
  introParagraph1: z.string().default('Introduce your project here. Briefly describe its essence and what makes it unique. This is the first impression, make it count.'),
  introParagraph2: z.string().default('Elaborate on key highlights or the vision behind the project. Focus on the lifestyle or benefits it offers to potential residents or investors.'),
  introParagraph3: z.string().default('Conclude the introduction with a compelling statement or a transition to the detailed sections of the brochure.'),
  introWatermark: optionalUrlSchema().describe("Subtle watermark image URL for intro page."),

  // Developer Profile
  developerName: z.string().default('Your Company Name'),
  developerDesc1: z.string().default('Briefly introduce the developer, highlighting experience, mission, or key achievements in the real estate sector.'),
  developerDesc2: z.string().default('Provide more details about the developer\'s philosophy, commitment to quality, or past successful projects.'),
  developerImage: optionalUrlSchema().describe("Background image URL for developer page."),
  developerLogo: optionalUrlSchema().describe("Developer\'s logo URL."),
  developerDisclaimer: z.string().default("Developer profile and image are for representation. Company details as per official records."),

  // Location
  locationTitle: z.string().default('Prime Location & Unmatched Convenience'),
  locationDesc1: z.string().default('Describe the strategic advantages of the project\'s location. Mention proximity to key areas, infrastructure, or natural surroundings.'),
  locationDesc2: z.string().default('Detail the connectivity options, nearby amenities (schools, hospitals, shopping), and the overall lifestyle benefits offered by the location.'),
  keyDistances: z.array(z.string().min(1, "Key distance description cannot be empty.")).default([]).describe("List of nearby locations and their approximate distance/time."),
  locationMapImage: optionalUrlSchema().describe("URL for the location map image."),
  mapDisclaimer: z.string().default('*Map is for illustrative purposes only, not to scale. Actual travel times may vary.'),
  locationWatermark: optionalUrlSchema().describe("Subtle watermark image URL for location page."),
  locationNote: z.string().default('All mentioned landmarks and travel times are approximate. Please verify independently.').describe("Optional note regarding location or distances."),

  // Connectivity
  connectivityTitle: z.string().default('Effortless Connectivity'),
  connectivityPointsBusiness: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default([]).describe("List of nearby business points, first item is category title."),
   connectivityPointsHealthcare: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default([]).describe("List of nearby healthcare points, first item is category title."),
   connectivityPointsEducation: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default([]).describe("List of nearby education points, first item is category title."),
  connectivityPointsLeisure: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default([]).describe("List of nearby leisure/retail points, first item is category title."),
  connectivityNote: z.string().default('Proposed infrastructure developments may further enhance connectivity.'),
  connectivityImage: optionalUrlSchema().describe("Image URL illustrating connectivity."),
  connectivityDistrictLabel: z.string().default('District Name').describe("Label text overlaid on the connectivity image."),
  connectivityWatermark: optionalUrlSchema().describe("Subtle watermark image URL for connectivity page."),

  // Amenities Intro
  amenitiesIntroTitle: z.string().default('A World of Amenities'),
  amenitiesIntroP1: z.string().default('Introduce the range of amenities offered. Focus on how they enhance resident well-being and lifestyle.'),
  amenitiesIntroP2: z.string().default('Describe the quality and thoughtfulness behind the curated amenities, catering to diverse interests like relaxation, fitness, and social engagement.'),
  amenitiesIntroP3: z.string().default('Conclude by emphasizing the exceptional living experience provided by these top-tier facilities.'),
  amenitiesIntroWatermark: optionalUrlSchema().describe("Subtle watermark image URL for amenities intro page."),

  // Amenities List
  amenitiesListTitle: z.string().default('Curated Amenities'),
  amenitiesListImage: optionalUrlSchema().describe("Image URL for the amenities list page."),
  amenitiesListImageDisclaimer: z.string().default("Artist's impression. Actual amenities may differ."),
  amenitiesWellness: z.array(z.string().min(1, "Amenity description cannot be empty.")).default([]).describe("List of wellness/leisure amenities."),
  amenitiesRecreation: z.array(z.string().min(1, "Amenity description cannot be empty.")).default([]).describe("List of recreation amenities."),

  // Amenities Grid
  amenitiesGridTitle: z.string().default('Signature Lifestyle Enhancements'),
  amenitiesGridItems: z.array(AmenityGridItemSchema).default([]).describe("Array of amenity grid items, each with an image and a label."),
  amenitiesGridDisclaimer: z.string().default("Images are indicative. Final amenities are subject to design and availability."),

  // Specifications
  specsTitle: z.string().default('Premium Finishes & Features'),
  specsImage: optionalUrlSchema().describe("Image URL for specifications page."),
  specsImageDisclaimer: z.string().default("Interior depiction is conceptual."),
  specsInterior: z.array(z.string().min(1, "Specification detail cannot be empty.")).default([]).describe("List of interior specifications."),
  specsBuilding: z.array(z.string().min(1, "Building feature cannot be empty.")).default([]).describe("List of building features/specifications."),
  specsWatermark: optionalUrlSchema().describe("Subtle watermark image URL for specs page."),

  // Master Plan
  masterPlanTitle: z.string().default('Thoughtfully Designed Master Plan'),
  masterPlanImage: optionalUrlSchema().describe("URL for the master plan image."),
  masterPlanImageDisclaimer: z.string().default('Master plan is conceptual and subject to approval and modification.'),
  masterPlanDesc1: z.string().default('Describe the overall layout and design philosophy of the master plan, highlighting optimal space utilization, natural light, and ventilation.'),
  masterPlanDesc2: z.string().default('Detail key features like green spaces, pedestrian pathways, amenity zones, and tower placements for views and privacy.'),

  // Floor Plans
  floorPlansTitle: z.string().default('Spacious & Functional Floor Plans'),
  floorPlans: z.array(FloorPlanSchema).default([]).describe("Array of floor plan objects."),
  floorPlansDisclaimer: z.string().default('Floor plans are indicative and not to scale. Areas are approximate. Furniture layout is suggestive.'),

  // Back Cover
  backCoverImage: optionalUrlSchema().describe("Background image URL for back cover."),
  backCoverLogo: optionalUrlSchema().describe("Logo URL for back cover."),
  callToAction: z.string().default('Discover Your Dream Home'),
  contactTitle: z.string().default('Connect With Us'),
  contactPhone: z.string().default('+00 123 456 7890'),
  contactEmail: optionalEmailSchema().default('sales@example.com').describe("Contact email address."),
  contactWebsite: optionalUrlSchema().default('https://www.example.com').describe("Contact website URL."),
  contactAddress: z.string().default('Sales Gallery & Site Office: 1 Example Avenue, City - 000001'),
  fullDisclaimer: z.string().default('Disclaimer: This brochure is for informational purposes only and does not constitute an offer or contract. All details are indicative and subject to change. Verify all information independently. E&OE.'),
  reraDisclaimer: z.string().default('RERA Registration No: PENDING. Visit state.rera.gov.in for details.'),
});

export type BrochureData = z.infer<typeof BrochureDataSchema>;
export type FloorPlanData = z.infer<typeof FloorPlanSchema>;
export type AmenityGridItemData = z.infer<typeof AmenityGridItemSchema>;

export const getDefaultBrochureData = (): BrochureData => {
    try {
        return BrochureDataSchema.parse({});
    } catch (e) {
        console.error("Error parsing default BrochureDataSchema:", e);
        // This fallback is a last resort and should ideally not be hit.
        // It manually constructs a basic object if Zod parsing fails.
        const fallbackData: Record<string, any> = {};
        Object.keys(BrochureDataSchema.shape).forEach(key => {
            const fieldSchema = (BrochureDataSchema.shape as any)[key];
            if (fieldSchema._def.typeName === 'ZodDefault') {
                fallbackData[key] = fieldSchema._def.defaultValue();
            } else if (fieldSchema._def.typeName === 'ZodOptional') {
                 // For optional fields, especially those that might not have a .default() directly
                 // but are wrapped in optionalUrlSchema (which has .default(''))
                 // we ensure they get a sensible default if parse({}) fails.
                if (fieldSchema._def.innerType?._def?.typeName === 'ZodDefault') {
                     fallbackData[key] = fieldSchema._def.innerType._def.defaultValue();
                } else {
                    fallbackData[key] = ''; // Default to empty string for other optional strings
                }
            } else if (fieldSchema._def.typeName === 'ZodArray') {
                 fallbackData[key] = []; // Default to empty array for arrays
            }
             else {
                // This case should be rare if all fields are optional or have defaults.
                // For strictly required fields without defaults, this would be an issue.
                fallbackData[key] = ''; // Or some other sensible default.
            }
        });
        // Ensure specific complex array types are empty arrays
        fallbackData.floorPlans = fallbackData.floorPlans || [];
        fallbackData.amenitiesGridItems = fallbackData.amenitiesGridItems || [];
        
        return fallbackData as BrochureData;
    }
}
