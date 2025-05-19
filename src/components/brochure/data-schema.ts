
import { z } from 'zod';

// Reusable schema for optional image data URIs or predefined placeholder URLs
const optionalImageSchema = (fieldDescription: string = "Image for the section. Uploaded images are preferred.") =>
  z.preprocess(
    // Preprocess to ensure a consistent empty string for null/undefined/empty inputs
    (val) => (val === null || val === undefined || String(val).trim() === "" ? "" : String(val).trim()),
    // The actual validation
    z.string().refine(
      (val) => {
        if (val === "") return true; // Empty string is valid (no image)
        if (val.startsWith('data:image/')) return true; // Data URIs from uploads are valid
        // Allow specific placeholder URLs for default data or development
        if (val.startsWith('https://placehold.co/') || val.startsWith('https://picsum.photos/')) {
            // Basic check for placeholder format.
            return /https:\/\/placehold\.co\/\d+x\d+(\.png)?/.test(val) || /https:\/\/picsum\.photos\/\d+(\/\d+)?/.test(val);
        }
        // If it's not empty, not a data URI, and not a known placeholder, it's invalid for user input.
        return false;
      },
      { message: "Invalid image: Please upload an image or ensure placeholder URL is correct." }
    )
  ).default("").describe(fieldDescription);


// Reusable schema for optional emails that can be empty strings
const optionalEmailSchema = (message: string = "Invalid email. Must be a valid email (e.g., user@example.com) or empty.") =>
  z.preprocess(
    (val) => (val === null || val === undefined || String(val).trim() === "" ? "" : String(val).trim()),
    z.string().refine((val) => {
        if (val === "") return true;
        return z.string().email({ message: "Please enter a valid email address (e.g., user@example.com) or leave empty." }).safeParse(val).success;
    }, { message })
  ).default('');

// Reusable schema for optional standard URLs that can be empty strings
const optionalUrlSchema = (message: string = "Invalid URL. Must be a valid URL (e.g., http://example.com) or empty.") =>
  z.preprocess(
    (val) => (val === null || val === undefined || String(val).trim() === "" ? "" : String(val).trim()),
    z.string().refine((val) => {
        if (val === "") return true;
        try {
            new URL(val); // Check if it's a parseable URL
            return z.string().url({ message: "Please enter a valid full URL (e.g., http://example.com) or leave empty." }).safeParse(val).success;
        } catch (_) {
            return false;
        }
    }, { message })
  ).default('');


const FloorPlanSchema = z.object({
  id: z.string().optional().default(() => `fp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
  name: z.string().min(1, 'Floor plan name is required').default('New Floor Plan'),
  area: z.string().min(1, 'Area is required').default('0 sq. ft.'),
  features: z.array(z.string().min(1, "Feature description cannot be empty.")).min(1, 'At least one feature is required').default(['Feature 1']),
  image: optionalImageSchema("Image for the floor plan. Upload required for display."),
});

const AmenityGridItemSchema = z.object({
  id: z.string().optional().default(() => `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
  image: optionalImageSchema("Image for the grid item. Upload required for display."),
  label: z.string().min(1, "Amenity label cannot be empty.").default('New Amenity').describe("Label for the grid item."),
});


export const BrochureDataSchema = z.object({
  // Cover Page
  projectName: z.string().min(1, "Project name is required.").default('Untitled Project'),
  projectTagline: z.string().default('Your compelling tagline here'),
  coverImage: optionalImageSchema("Main cover image for the brochure. Upload required."),
  projectLogo: optionalImageSchema("Project logo image. Upload recommended."),
  reraInfo: z.string().default('RERA No: PENDING | Project Approved by State RERA Authority.\nFull details: state.rera.gov.in/project/your-project-name'),

  // Introduction
  introTitle: z.string().default('Welcome to [Project Name]'),
  introParagraph1: z.string().default('Introduce your project here. Briefly describe its essence and what makes it unique. This is the first impression, make it count.'),
  introParagraph2: z.string().default('Elaborate on key highlights or the vision behind the project. Focus on the lifestyle or benefits it offers to potential residents or investors.'),
  introParagraph3: z.string().default('Conclude the introduction with a compelling statement or a transition to the detailed sections of the brochure.'),
  introWatermark: optionalImageSchema("Subtle watermark image for intro page. Upload optional."),

  // Developer Profile
  developerName: z.string().default('Your Company Name'),
  developerDesc1: z.string().default('Briefly introduce the developer, highlighting experience, mission, or key achievements in the real estate sector.'),
  developerDesc2: z.string().default('Provide more details about the developer\'s philosophy, commitment to quality, or past successful projects.'),
  developerImage: optionalImageSchema("Background image for developer page. Upload optional."),
  developerLogo: optionalImageSchema("Developer\'s logo image. Upload recommended."),
  developerDisclaimer: z.string().default("Developer profile and image are for representation. Company details as per official records."),

  // Location
  locationTitle: z.string().default('Prime Location & Unmatched Convenience'),
  locationDesc1: z.string().default('Describe the strategic advantages of the project\'s location. Mention proximity to key areas, infrastructure, or natural surroundings.'),
  locationDesc2: z.string().default('Detail the connectivity options, nearby amenities (schools, hospitals, shopping), and the overall lifestyle benefits offered by the location.'),
  keyDistances: z.array(z.string().min(1, "Key distance description cannot be empty.")).default([]).describe("List of nearby locations and their approximate distance/time."),
  locationMapImage: optionalImageSchema("Image for the location map. Upload recommended."),
  mapDisclaimer: z.string().default('*Map is for illustrative purposes only, not to scale. Actual travel times may vary.'),
  locationWatermark: optionalImageSchema("Subtle watermark image for location page. Upload optional."),
  locationNote: z.string().default('All mentioned landmarks and travel times are approximate. Please verify independently.').describe("Optional note regarding location or distances."),

  // Connectivity
  connectivityTitle: z.string().default('Effortless Connectivity'),
  connectivityPointsBusiness: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default(['Business & Retail Hubs']).describe("List of nearby business points, first item is category title."),
  connectivityPointsHealthcare: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default(['Healthcare Facilities']).describe("List of nearby healthcare points, first item is category title."),
  connectivityPointsEducation: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default(['Educational Institutions']).describe("List of nearby education points, first item is category title."),
  connectivityPointsLeisure: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default(['Leisure & Entertainment']).describe("List of nearby leisure/retail points, first item is category title."),
  connectivityNote: z.string().default('Proposed infrastructure developments may further enhance connectivity.'),
  connectivityImage: optionalImageSchema("Image illustrating connectivity. Upload optional."),
  connectivityDistrictLabel: z.string().default('District Name').describe("Label text overlaid on the connectivity image."),
  connectivityWatermark: optionalImageSchema("Subtle watermark image for connectivity page. Upload optional."),

  // Amenities Intro
  amenitiesIntroTitle: z.string().default('A World of Amenities'),
  amenitiesIntroP1: z.string().default('Introduce the range of amenities offered. Focus on how they enhance resident well-being and lifestyle.'),
  amenitiesIntroP2: z.string().default('Describe the quality and thoughtfulness behind the curated amenities, catering to diverse interests like relaxation, fitness, and social engagement.'),
  amenitiesIntroP3: z.string().default('Conclude by emphasizing the exceptional living experience provided by these top-tier facilities.'),
  amenitiesIntroWatermark: optionalImageSchema("Subtle watermark image for amenities intro page. Upload optional."),

  // Amenities List
  amenitiesListTitle: z.string().default('Curated Amenities'),
  amenitiesListImage: optionalImageSchema("Image for the amenities list page. Upload optional."),
  amenitiesListImageDisclaimer: z.string().default("Artist's impression. Actual amenities may differ."),
  amenitiesWellness: z.array(z.string().min(1, "Amenity description cannot be empty.")).default(['Swimming Pool', 'Gymnasium', 'Yoga Deck']).describe("List of wellness/leisure amenities."),
  amenitiesRecreation: z.array(z.string().min(1, "Amenity description cannot be empty.")).default(['Clubhouse', 'Children\'s Play Area', 'Landscaped Gardens']).describe("List of recreation amenities."),

  // Amenities Grid
  amenitiesGridTitle: z.string().default('Signature Lifestyle Enhancements'),
  amenitiesGridItems: z.array(AmenityGridItemSchema).default([
    { id: 'grid1', image: '', label: 'Feature Pool' },
    { id: 'grid2', image: '', label: 'Modern Gym' },
    { id: 'grid3', image: '', label: 'Lush Parks' },
    { id: 'grid4', image: '', label: 'Kids Zone' },
  ]).describe("Array of amenity grid items, each with an image and a label. Upload images for display."),
  amenitiesGridDisclaimer: z.string().default("Images are indicative. Final amenities are subject to design and availability."),

  // Specifications
  specsTitle: z.string().default('Premium Finishes & Features'),
  specsImage: optionalImageSchema("Image for specifications page. Upload optional."),
  specsImageDisclaimer: z.string().default("Interior depiction is conceptual."),
  specsInterior: z.array(z.string().min(1, "Specification detail cannot be empty.")).default(['Vitrified Tile Flooring', 'Premium Sanitary Ware']).describe("List of interior specifications."),
  specsBuilding: z.array(z.string().min(1, "Building feature cannot be empty.")).default(['Earthquake Resistant Structure', 'High-Speed Elevators']).describe("List of building features/specifications."),
  specsWatermark: optionalImageSchema("Subtle watermark image for specs page. Upload optional."),

  // Master Plan
  masterPlanTitle: z.string().default('Thoughtfully Designed Master Plan'),
  masterPlanImage: optionalImageSchema("Image for the master plan. Upload recommended."),
  masterPlanImageDisclaimer: z.string().default('Master plan is conceptual and subject to approval and modification.'),
  masterPlanDesc1: z.string().default('Describe the overall layout and design philosophy of the master plan, highlighting optimal space utilization, natural light, and ventilation.'),
  masterPlanDesc2: z.string().default('Detail key features like green spaces, pedestrian pathways, amenity zones, and tower placements for views and privacy.'),

  // Floor Plans
  floorPlansTitle: z.string().default('Spacious & Functional Floor Plans'),
  floorPlans: z.array(FloorPlanSchema).default([
      { id: 'fp1', name: 'Type A - 2 Bedroom', area: '1200 sq. ft.', features: ['Spacious Living Room', 'Modern Kitchen'], image: '' },
      { id: 'fp2', name: 'Type B - 3 Bedroom', area: '1650 sq. ft.', features: ['Large Balcony', 'Ensuite Bathrooms'], image: '' },
  ]).describe("Array of floor plan objects. Upload images for each plan."),
  floorPlansDisclaimer: z.string().default('Floor plans are indicative and not to scale. Areas are approximate. Furniture layout is suggestive.'),

  // Back Cover
  backCoverImage: optionalImageSchema("Background image for back cover. Upload optional."),
  backCoverLogo: optionalImageSchema("Logo image for back cover. Upload recommended."),
  callToAction: z.string().default('Discover Your Dream Home'),
  contactTitle: z.string().default('Connect With Us'),
  contactPhone: z.string().default('+00 123 456 7890'),
  contactEmail: optionalEmailSchema().default('sales@example.com').describe("Contact email address."),
  contactWebsite: optionalUrlSchema().default('https://www.example.com').describe("Contact website URL."),
  contactAddress: z.string().default('Sales Gallery & Site Office: 1 Example Avenue, City - 000001'),
  fullDisclaimer: z.string().default('Disclaimer: This brochure is for informational purposes only and does not constitute an offer or contract. All details are indicative and subject to change. Verify all information independently. E&OE.'),
  reraDisclaimer: z.string().default('RERA Registration No: PENDING. Visit state.rera.gov.in for details.'),
  // Theme ID to persist chosen theme - not directly user-editable in form, but part of data
  themeId: z.string().default("bb-std").describe("Identifier for the currently applied brochure theme.")
});

export type BrochureData = z.infer<typeof BrochureDataSchema>;
export type FloorPlanData = z.infer<typeof FloorPlanSchema>;
export type AmenityGridItemData = z.infer<typeof AmenityGridItemSchema>;

// Enum for sections that can be generated (currently not used as AI is disabled)
export const BrochureAIDataSectionsEnum = z.enum([
    "intro", 
    "developer", 
    "location", 
    "connectivity",
    "amenitiesIntro",
    "amenitiesList",
    "amenitiesGrid",
    "specs",
    "masterPlan",
    "floorPlans"
]);
export type BrochureAIDataSection = z.infer<typeof BrochureAIDataSectionsEnum>;


export const getDefaultBrochureData = (): BrochureData => {
    try {
        return BrochureDataSchema.parse({});
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Error parsing default BrochureDataSchema. THIS SHOULD NOT HAPPEN with robust preprocess and default. Zod Errors:", e.errors);
        } else {
            console.error("Unexpected error parsing default BrochureDataSchema:", e);
        }
        // Fallback only if absolutely necessary, indicating a fundamental schema issue.
        const fallbackData: Record<string, any> = {};
        for (const key in BrochureDataSchema.shape) {
            const fieldShape = (BrochureDataSchema.shape as any)[key];
            if (fieldShape._def && typeof fieldShape._def.defaultValue === 'function') {
                 fallbackData[key] = fieldShape._def.defaultValue();
            } else if (fieldShape._def?.typeName === 'ZodArray') {
                fallbackData[key] = [];
            } else {
                fallbackData[key] = ''; 
            }
        }
        // Ensure specific complex array types are initialized if the above loop misses them.
        fallbackData.floorPlans = fallbackData.floorPlans || [];
        fallbackData.amenitiesGridItems = fallbackData.amenitiesGridItems || [];
        fallbackData.keyDistances = fallbackData.keyDistances || [];
        fallbackData.connectivityPointsBusiness = fallbackData.connectivityPointsBusiness || [];
        fallbackData.connectivityPointsHealthcare = fallbackData.connectivityPointsHealthcare || [];
        fallbackData.connectivityPointsEducation = fallbackData.connectivityPointsEducation || [];
        fallbackData.connectivityPointsLeisure = fallbackData.connectivityPointsLeisure || [];
        fallbackData.specsInterior = fallbackData.specsInterior || [];
        fallbackData.specsBuilding = fallbackData.specsBuilding || [];
        fallbackData.amenitiesWellness = fallbackData.amenitiesWellness || [];
        fallbackData.amenitiesRecreation = fallbackData.amenitiesRecreation || [];
        fallbackData.themeId = "bb-std"; // Default theme
        
        return fallbackData as BrochureData;
    }
}
