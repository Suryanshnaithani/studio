
import { z } from 'zod';

// Reusable schema for optional URLs that can be empty strings (primarily for data URIs from uploads)
const optionalImageSchema = (message: string = "Invalid image data. Must be a valid data URI or empty.") =>
  z.preprocess(
    (val) => (val === null || val === undefined || String(val).trim() === "" ? "" : String(val).trim()),
    z.string().refine((val) => {
        if (val === "") return true;
        // Allow data URIs explicitly
        if (val.startsWith('data:image/')) return true;
        // Allow placeholder URLs like picsum.photos or placehold.co (useful for default data)
        if (val.startsWith('https://placehold.co/') || val.startsWith('https://picsum.photos/')) return true;
        // Fallback for other potential valid URLs if strictly needed, but UI focuses on uploads
        try {
            new URL(val);
            return z.string().url({ message: "Please upload an image or provide a valid placeholder URL." }).safeParse(val).success;
        } catch (_) {
            return false; 
        }
    }, { message })
  ).default('');


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
            new URL(val);
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
  image: optionalImageSchema("Invalid image data for floor plan image.").describe("Image for the floor plan."),
});

const AmenityGridItemSchema = z.object({
  id: z.string().optional().default(() => `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
  image: optionalImageSchema("Invalid image data for grid image.").describe("Image for the grid item."),
  label: z.string().min(1, "Amenity label cannot be empty.").default('New Amenity').describe("Label for the grid item."),
});


export const BrochureDataSchema = z.object({
  // Cover Page
  projectName: z.string().min(1, "Project name is required.").default('Untitled Project'),
  projectTagline: z.string().default('Your compelling tagline here'),
  coverImage: optionalImageSchema().describe("Main cover image for the brochure."),
  projectLogo: optionalImageSchema().describe("Project logo image."),
  reraInfo: z.string().default('RERA No: PENDING | Project Approved by State RERA Authority.\nFull details: state.rera.gov.in/project/your-project-name'),

  // Introduction
  introTitle: z.string().default('Welcome to [Project Name]'),
  introParagraph1: z.string().default('Introduce your project here. Briefly describe its essence and what makes it unique. This is the first impression, make it count.'),
  introParagraph2: z.string().default('Elaborate on key highlights or the vision behind the project. Focus on the lifestyle or benefits it offers to potential residents or investors.'),
  introParagraph3: z.string().default('Conclude the introduction with a compelling statement or a transition to the detailed sections of the brochure.'),
  introWatermark: optionalImageSchema().describe("Subtle watermark image for intro page."),

  // Developer Profile
  developerName: z.string().default('Your Company Name'),
  developerDesc1: z.string().default('Briefly introduce the developer, highlighting experience, mission, or key achievements in the real estate sector.'),
  developerDesc2: z.string().default('Provide more details about the developer\'s philosophy, commitment to quality, or past successful projects.'),
  developerImage: optionalImageSchema().describe("Background image for developer page."),
  developerLogo: optionalImageSchema().describe("Developer\'s logo image."),
  developerDisclaimer: z.string().default("Developer profile and image are for representation. Company details as per official records."),

  // Location
  locationTitle: z.string().default('Prime Location & Unmatched Convenience'),
  locationDesc1: z.string().default('Describe the strategic advantages of the project\'s location. Mention proximity to key areas, infrastructure, or natural surroundings.'),
  locationDesc2: z.string().default('Detail the connectivity options, nearby amenities (schools, hospitals, shopping), and the overall lifestyle benefits offered by the location.'),
  keyDistances: z.array(z.string().min(1, "Key distance description cannot be empty.")).default([]).describe("List of nearby locations and their approximate distance/time."),
  locationMapImage: optionalImageSchema().describe("Image for the location map."),
  mapDisclaimer: z.string().default('*Map is for illustrative purposes only, not to scale. Actual travel times may vary.'),
  locationWatermark: optionalImageSchema().describe("Subtle watermark image for location page."),
  locationNote: z.string().default('All mentioned landmarks and travel times are approximate. Please verify independently.').describe("Optional note regarding location or distances."),

  // Connectivity
  connectivityTitle: z.string().default('Effortless Connectivity'),
  connectivityPointsBusiness: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default(['Business & Retail Hubs']).describe("List of nearby business points, first item is category title."),
  connectivityPointsHealthcare: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default(['Healthcare Facilities']).describe("List of nearby healthcare points, first item is category title."),
  connectivityPointsEducation: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default(['Educational Institutions']).describe("List of nearby education points, first item is category title."),
  connectivityPointsLeisure: z.array(z.string().min(1, "Connectivity point cannot be empty.")).default(['Leisure & Entertainment']).describe("List of nearby leisure/retail points, first item is category title."),
  connectivityNote: z.string().default('Proposed infrastructure developments may further enhance connectivity.'),
  connectivityImage: optionalImageSchema().describe("Image illustrating connectivity."),
  connectivityDistrictLabel: z.string().default('District Name').describe("Label text overlaid on the connectivity image."),
  connectivityWatermark: optionalImageSchema().describe("Subtle watermark image for connectivity page."),

  // Amenities Intro
  amenitiesIntroTitle: z.string().default('A World of Amenities'),
  amenitiesIntroP1: z.string().default('Introduce the range of amenities offered. Focus on how they enhance resident well-being and lifestyle.'),
  amenitiesIntroP2: z.string().default('Describe the quality and thoughtfulness behind the curated amenities, catering to diverse interests like relaxation, fitness, and social engagement.'),
  amenitiesIntroP3: z.string().default('Conclude by emphasizing the exceptional living experience provided by these top-tier facilities.'),
  amenitiesIntroWatermark: optionalImageSchema().describe("Subtle watermark image for amenities intro page."),

  // Amenities List
  amenitiesListTitle: z.string().default('Curated Amenities'),
  amenitiesListImage: optionalImageSchema().describe("Image for the amenities list page."),
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
  ]).describe("Array of amenity grid items, each with an image and a label."),
  amenitiesGridDisclaimer: z.string().default("Images are indicative. Final amenities are subject to design and availability."),

  // Specifications
  specsTitle: z.string().default('Premium Finishes & Features'),
  specsImage: optionalImageSchema().describe("Image for specifications page."),
  specsImageDisclaimer: z.string().default("Interior depiction is conceptual."),
  specsInterior: z.array(z.string().min(1, "Specification detail cannot be empty.")).default(['Vitrified Tile Flooring', 'Premium Sanitary Ware']).describe("List of interior specifications."),
  specsBuilding: z.array(z.string().min(1, "Building feature cannot be empty.")).default(['Earthquake Resistant Structure', 'High-Speed Elevators']).describe("List of building features/specifications."),
  specsWatermark: optionalImageSchema().describe("Subtle watermark image for specs page."),

  // Master Plan
  masterPlanTitle: z.string().default('Thoughtfully Designed Master Plan'),
  masterPlanImage: optionalImageSchema().describe("Image for the master plan."),
  masterPlanImageDisclaimer: z.string().default('Master plan is conceptual and subject to approval and modification.'),
  masterPlanDesc1: z.string().default('Describe the overall layout and design philosophy of the master plan, highlighting optimal space utilization, natural light, and ventilation.'),
  masterPlanDesc2: z.string().default('Detail key features like green spaces, pedestrian pathways, amenity zones, and tower placements for views and privacy.'),

  // Floor Plans
  floorPlansTitle: z.string().default('Spacious & Functional Floor Plans'),
  floorPlans: z.array(FloorPlanSchema).default([
      { id: 'fp1', name: 'Type A - 2 Bedroom', area: '1200 sq. ft.', features: ['Spacious Living Room', 'Modern Kitchen'], image: '' },
      { id: 'fp2', name: 'Type B - 3 Bedroom', area: '1650 sq. ft.', features: ['Large Balcony', 'Ensuite Bathrooms'], image: '' },
  ]).describe("Array of floor plan objects."),
  floorPlansDisclaimer: z.string().default('Floor plans are indicative and not to scale. Areas are approximate. Furniture layout is suggestive.'),

  // Back Cover
  backCoverImage: optionalImageSchema().describe("Background image for back cover."),
  backCoverLogo: optionalImageSchema().describe("Logo image for back cover."),
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
        // .parse({}) will apply all .default() values defined in the schema.
        return BrochureDataSchema.parse({});
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Error parsing default BrochureDataSchema. THIS SHOULD NOT HAPPEN with preprocess and default. Zod Errors:", e.errors);
        } else {
            console.error("Unexpected error parsing default BrochureDataSchema:", e);
        }
        // Fallback only if absolutely necessary, indicating a fundamental schema issue.
        // This manual construction is brittle and should ideally never be reached.
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
        
        return fallbackData as BrochureData;
    }
}

    