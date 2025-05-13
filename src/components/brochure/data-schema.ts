import { z } from 'zod';

// Enum for sections that support specific field/title generation by AI
export const BrochureAIDataSectionsEnum = z.enum([
  "introduction",
  "developer",
  "location",
  "connectivity",
  "amenitiesIntro",
  "amenitiesListTitle", // For title and list items
  "amenitiesGridTitle", // For title and grid item labels
  "specificationsTitle", // For title and list items
  "masterPlan",
  "floorPlansTitle", // For title and floor plan details
  "cover",
  "backCover"
]);

export type BrochureAIDataSection = z.infer<typeof BrochureAIDataSectionsEnum>;


// Reusable schema for optional URLs that can be empty strings
const optionalUrlSchema = (message: string = "Invalid URL format. Must be a valid URL or empty.") =>
  z.string()
    .transform(val => val === null || val === undefined ? "" : val) // Ensure null/undefined become empty strings
    .refine((val) => val === '' || z.string().url().safeParse(val).success, { message })
    .optional()
    .default('');

// Reusable schema for optional emails that can be empty strings
const optionalEmailSchema = (message: string = "Invalid email format. Must be a valid email or empty.") =>
  z.string()
    .transform(val => val === null || val === undefined ? "" : val)
    .refine((val) => val === '' || z.string().email().safeParse(val).success, { message })
    .optional()
    .default('');


const FloorPlanSchema = z.object({
  id: z.string().optional().default(() => `fp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
  name: z.string().min(1, 'Floor plan name is required').default('Elegant 3BHK Apartment'),
  area: z.string().min(1, 'Area is required').default('Approx. 1850 sq. ft.'),
  features: z.array(z.string().min(1)).min(1, 'At least one feature is required').default(['Spacious Living Area', 'Modern Kitchen Layout', 'Private Balcony']),
  image: optionalUrlSchema("Invalid URL format for floor plan image. Must be a valid URL or empty.").describe("URL for the floor plan image. Use picsum.photos or leave empty."),
});

const AmenityGridItemSchema = z.object({
  id: z.string().optional().default(() => `grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
  image: optionalUrlSchema("Invalid URL for grid image. Must be a valid URL or empty.").describe("URL for the grid item image. Use picsum.photos or leave empty."),
  label: z.string().default('Amenity Feature').describe("Label for the grid item."),
});


export const BrochureDataSchema = z.object({
  // Cover Page
  projectName: z.string().default('Elysian Estates'),
  projectTagline: z.string().default('Where Luxury Meets Serenity'),
  coverImage: optionalUrlSchema().describe("URL for the main cover image. Use picsum.photos or leave empty."),
  projectLogo: optionalUrlSchema().describe("URL for the project logo. Use picsum.photos or leave empty."),
  reraInfo: z.string().default('RERA No: A123-B456-C789 | Project Approved by State RERA Authority.\nFull details: state.rera.gov.in/project/elysian-estates'),

  // Introduction
  introTitle: z.string().default('Welcome to Elysian Estates: A New Paradigm of Living'),
  introParagraph1: z.string().default('Nestled in the city\'s most vibrant corridor, Elysian Estates presents a unique blend of contemporary architecture and thoughtful community planning. This premier residential enclave is designed for those who seek an elevated lifestyle, offering a sanctuary of peace and sophistication amidst the urban energy.'),
  introParagraph2: z.string().default('Each residence within Elysian Estates is a masterpiece of design, featuring expansive layouts, premium finishes, and an abundance of natural light. With meticulous attention to detail, these homes are crafted to provide unparalleled comfort and a timeless aesthetic, promising a living experience that is both luxurious and intimately personal.'),
  introParagraph3: z.string().default('Discover a community where every element is curated to enhance your well-being. From lush landscaped gardens to world-class amenities, Elysian Estates is more than just a home—it’s a destination for a fulfilling and inspired life.'),
  introWatermark: optionalUrlSchema().describe("Subtle watermark image URL for intro page. Use picsum.photos or leave empty."),

  // Developer Profile
  developerName: z.string().default('Zenith Developers Pvt. Ltd.'),
  developerDesc1: z.string().default('Zenith Developers has been at the forefront of creating landmark properties for over two decades. Our commitment to quality, innovation, and sustainable development has earned us a reputation for excellence in the real estate sector.'),
  developerDesc2: z.string().default('We believe in building not just structures, but vibrant communities that enrich lives. Our portfolio reflects a dedication to superior craftsmanship, customer-centric design, and a vision for a better urban future.'),
  developerImage: optionalUrlSchema().describe("Background image URL for developer page. Use picsum.photos or leave empty."),
  developerLogo: optionalUrlSchema().describe("Developer's logo URL. Use picsum.photos or leave empty."),
  developerDisclaimer: z.string().default("Developer profile and image are for representation. Company details as per official records."),

  // Location
  locationTitle: z.string().default('Prime Location, Unmatched Convenience'),
  locationDesc1: z.string().default('Elysian Estates enjoys a coveted location, offering strategic proximity to major business hubs, educational institutions, healthcare facilities, and premier entertainment zones. Experience the ease of city living with everything you need just moments away.'),
  locationDesc2: z.string().default('With excellent connectivity via arterial roads and public transport, your daily commute is simplified. The surrounding neighborhood is a vibrant tapestry of culture, dining, and recreation, ensuring a dynamic and convenient lifestyle.'),
  keyDistances: z.array(z.string().min(1)).default([
      'City Metro Link - 2 min walk',
      'Orion Business Park - 5 min drive',
      'Global International School - 10 min drive',
      'Apollo Multi-specialty Hospital - 12 min drive',
      'Grand Central Mall - 15 min drive',
      'International Airport Connect - 30 min drive',
  ]).describe("List of nearby locations and their approximate distance/time."),
  locationMapImage: optionalUrlSchema().describe("URL for the location map image. Use picsum.photos or leave empty."),
  mapDisclaimer: z.string().default('*Map is for illustrative purposes only, not to scale. Actual travel times may vary based on traffic conditions.'),
  locationWatermark: optionalUrlSchema().describe("Subtle watermark image URL for location page. Use picsum.photos or leave empty."),
  locationNote: z.string().default('All mentioned landmarks and travel times are approximate and sourced from public information. Verify independently.').describe("Optional note regarding location or distances."),

  // Connectivity
  connectivityTitle: z.string().default('Effortless Connectivity to Key Destinations'),
  connectivityPointsBusiness: z.array(z.string().min(1)).default([
    'Business & Tech Parks', 'Alpha Tech Hub', 'Omega Business Center', 'Innovation Square'
  ]).describe("List of nearby business points, first item is category title."),
   connectivityPointsHealthcare: z.array(z.string().min(1)).default([
    'Leading Hospitals', 'City General Hospital', 'Apex Heart Institute', 'Serene Wellness Clinic'
   ]).describe("List of nearby healthcare points, first item is category title."),
   connectivityPointsEducation: z.array(z.string().min(1)).default([
    'Educational Institutions', 'Presidency International School', 'Horizon University', 'National Management Institute'
   ]).describe("List of nearby education points, first item is category title."),
  connectivityPointsLeisure: z.array(z.string().min(1)).default([
    'Shopping & Entertainment', 'Galleria Mall', 'City Art Museum', 'Gourmet Food Street', 'Regal Multiplex'
  ]).describe("List of nearby leisure/retail points, first item is category title."),
  connectivityNote: z.string().default('Proposed infrastructure developments may further enhance connectivity. Information is subject to change.'),
  connectivityImage: optionalUrlSchema().describe("Image URL illustrating connectivity. Use picsum.photos or leave empty."),
  connectivityDistrictLabel: z.string().default('Urban Connect').describe("Label text overlaid on the connectivity image."),
  connectivityWatermark: optionalUrlSchema().describe("Subtle watermark image URL for connectivity page. Use picsum.photos or leave empty."),

  // Amenities Intro
  amenitiesIntroTitle: z.string().default('A World of Amenities for an Enriched Lifestyle'),
  amenitiesIntroP1: z.string().default('At Elysian Estates, resident well-being is paramount. We offer a comprehensive suite of amenities designed to cater to diverse interests, promoting relaxation, fitness, and social engagement within a secure and beautifully landscaped environment.'),
  amenitiesIntroP2: z.string().default('Experience leisure and recreation like never before. Our thoughtfully curated facilities provide the perfect setting for unwinding after a busy day, pursuing fitness goals, or creating lasting memories with family and friends.'),
  amenitiesIntroP3: z.string().default('From serene green spaces to active recreational zones, every amenity at Elysian Estates is crafted to the highest standards, ensuring an exceptional living experience for all residents.'),
  amenitiesIntroWatermark: optionalUrlSchema().describe("Subtle watermark image URL for amenities intro page. Use picsum.photos or leave empty."),

  // Amenities List
  amenitiesListTitle: z.string().default('Curated Amenities for Every Resident'),
  amenitiesListImage: optionalUrlSchema().describe("Image URL for the amenities list page. Use picsum.photos or leave empty."),
  amenitiesListImageDisclaimer: z.string().default("Artist's impression. Actual amenities may differ."),
  amenitiesWellness: z.array(z.string().min(1)).default([
    'Temperature-Controlled Infinity Pool', 'Holistic Spa & Sauna', 'Yoga & Meditation Deck', 'Landscaped Zen Gardens'
  ]).describe("List of wellness/leisure amenities."),
  amenitiesRecreation: z.array(z.string().min(1)).default([
    'State-of-the-Art Gymnasium', 'Multipurpose Sports Court', 'Luxury Residents\' Clubhouse', "Children's Adventure Park", 'Private Cinema / AV Room'
  ]).describe("List of recreation amenities."),

  // Amenities Grid
  amenitiesGridTitle: z.string().default('Signature Lifestyle Enhancements'),
  amenitiesGridItems: z.array(AmenityGridItemSchema).default([
    { id: 'agi1', image: 'https://picsum.photos/seed/gridGym/400/300', label: 'Modern Fitness Center' },
    { id: 'agi2', image: 'https://picsum.photos/seed/gridClubhouse/400/300', label: 'Elegant Clubhouse Lounge' },
    { id: 'agi3', image: 'https://picsum.photos/seed/gridRooftop/400/300', label: 'Rooftop Sky Lounge' },
    { id: 'agi4', image: 'https://picsum.photos/seed/gridKidsZone/400/300', label: 'Interactive Kids\' Zone' },
  ]).describe("Array of amenity grid items, each with an image and a label."),
  amenitiesGridDisclaimer: z.string().default("Images are indicative. Final amenities are subject to design and availability."),

  // Specifications
  specsTitle: z.string().default('Premium Finishes and Intelligent Features'),
  specsImage: optionalUrlSchema().describe("Image URL for specifications page. Use picsum.photos or leave empty."),
  specsImageDisclaimer: z.string().default("Interior depiction is conceptual and for illustrative purposes only."),
  specsInterior: z.array(z.string().min(1)).default([
    'Living/Dining: Imported Marble Flooring', 'Bedrooms: Premium Laminated Wooden Flooring', 'Kitchen: Designer Modular Kitchen with Quartz Countertop', 'Bathrooms: High-end Sanitary Fixtures & Fittings', 'Windows: UPVC Soundproof Glazed Windows', 'Integrated Smart Home Automation'
  ]).describe("List of interior specifications."),
  specsBuilding: z.array(z.string().min(1)).default([
    'Structure: Earthquake-Resistant RCC Framed Structure', 'Security: Advanced 3-Tier Security System with CCTV Surveillance', 'Elevators: High-Speed Elevators (Passenger & Service)', 'Power Backup: 100% DG Power Backup for All Apartments & Common Areas', 'Sustainable Features: Rainwater Harvesting, STP'
  ]).describe("List of building features/specifications."),
  specsWatermark: optionalUrlSchema().describe("Subtle watermark image URL for specs page. Use picsum.photos or leave empty."),

  // Master Plan
  masterPlanTitle: z.string().default('Thoughtfully Designed Site Master Plan'),
  masterPlanImage: optionalUrlSchema().describe("URL for the master plan image. Use picsum.photos or leave empty."),
  masterPlanImageDisclaimer: z.string().default('Master plan is conceptual and subject to approval and modification by relevant authorities.'),
  masterPlanDesc1: z.string().default('The master plan of Elysian Estates is a harmonious blend of architectural ingenuity and landscape design, ensuring optimal space utilization, natural light, and ventilation for every residence. Towers are strategically placed to offer panoramic views and maintain privacy.'),
  masterPlanDesc2: z.string().default('Extensive green spaces, pedestrian-friendly pathways, and dedicated zones for amenities create a cohesive and vibrant community environment. The layout prioritizes resident convenience, safety, and a seamless connection with nature.'),

  // Floor Plans
  floorPlansTitle: z.string().default('Spacious and Functional Floor Plans'),
  floorPlans: z.array(FloorPlanSchema).default([
    { id: 'fp1', name: 'The Sapphire - 3 Bedroom + Study', area: 'Approx. 2100 sq. ft.', features: ['Grand Living & Dining Area', 'Master Suite with Walk-in Wardrobe', 'Study/Home Office Space', 'Large Balconies', 'Modern Kitchen with Utility'], image: 'https://picsum.photos/seed/fpSapphire/800/600' },
    { id: 'fp2', name: 'The Emerald - 4 Bedroom Sky Residence', area: 'Approx. 2850 sq. ft.', features: ['Expansive Living Space with City Views', 'Two Master Suites', 'Private Elevator Lobby', 'Generous Sundeck', 'Servant Quarters with Separate Entry'], image: 'https://picsum.photos/seed/fpEmerald/800/600' },
  ]).describe("Array of floor plan objects."),
  floorPlansDisclaimer: z.string().default('Floor plans are indicative and not to scale. Areas are approximate and subject to final measurement. Furniture layout is suggestive and not included.'),

  // Back Cover
  backCoverImage: optionalUrlSchema().describe("Background image URL for back cover. Use picsum.photos or leave empty."),
  backCoverLogo: optionalUrlSchema().describe("Logo URL for back cover. Use picsum.photos or leave empty."),
  callToAction: z.string().default('Discover Your Dream Home at Elysian Estates'),
  contactTitle: z.string().default('Connect With Us Today'),
  contactPhone: z.string().default('+91 98765 43210'),
  contactEmail: optionalEmailSchema().default('sales@elysianestates.dev').describe("Contact email address."),
  contactWebsite: optionalUrlSchema().default('https://www.elysianestates.dev').describe("Contact website URL."),
  contactAddress: z.string().default('Sales Gallery & Site Office: 1 Elysian Avenue, Metro City - 500001'),
  fullDisclaimer: z.string().default('Disclaimer: This brochure is intended for informational purposes only and does not constitute an offer or contract. All images, specifications, layouts, and amenities are indicative and subject to change or revision by the developer or competent authorities without prior notice. Artistic impressions and stock images may have been used. The final terms and conditions will be as per the registered agreement for sale. E&OE.'),
  reraDisclaimer: z.string().default('RERA Registration No: A123-B456-C789. This project is registered under the Real Estate (Regulation and Development) Act, 2016. Please visit state.rera.gov.in for details.'),
});

export type BrochureData = z.infer<typeof BrochureDataSchema>;
export type FloorPlanData = z.infer<typeof FloorPlanSchema>;
export type AmenityGridItemData = z.infer<typeof AmenityGridItemSchema>;

export const getDefaultBrochureData = (): BrochureData => {
    // The .default() in Zod schema handles all default values.
    // Parsing an empty object {} will populate all default values.
    try {
        return BrochureDataSchema.parse({});
    } catch (e) {
        // This catch block is a fallback if Zod parsing itself has an issue with defaults,
        // which shouldn't happen with well-defined schemas.
        console.error("Error parsing default BrochureDataSchema, this is unexpected:", e);
        // Manually constructing might be necessary if Zod's .default() behavior fails
        // but ideally, BrochureDataSchema.parse({}) should be sufficient.
        // For robustness, ensure all fields are present, especially optional ones.
        const fallbackData: Record<string, any> = {};
        for (const key in BrochureDataSchema.shape) {
            const fieldSchema = (BrochureDataSchema.shape as any)[key];
            if (fieldSchema._def.typeName === 'ZodDefault') {
                fallbackData[key] = fieldSchema._def.defaultValue();
            } else if (fieldSchema._def.typeName === 'ZodOptional') {
                 // Optional fields without defaults will be undefined.
                 // For string fields that are optional and should be empty string,
                 // ensure the schema handles it (e.g. optionalUrlSchema)
                fallbackData[key] = undefined;
            } else {
                // This case should ideally not be hit if all fields have defaults or are optional
                // For arrays, Zod's default handles it. For simple strings, it handles it.
            }
        }
        // Correctly initialize optional image/URL fields to empty strings
        // as per optionalUrlSchema's default.
        const urlFields: (keyof BrochureData)[] = [
            'coverImage', 'projectLogo', 'introWatermark', 'developerImage', 'developerLogo',
            'locationMapImage', 'locationWatermark', 'connectivityImage', 'connectivityWatermark',
            'amenitiesIntroWatermark', 'amenitiesListImage', 'specsImage', 'specsWatermark',
            'masterPlanImage', 'backCoverImage', 'backCoverLogo'
        ];
        urlFields.forEach(field => {
            if (fallbackData[field] === undefined) fallbackData[field] = '';
        });
        if(fallbackData.amenitiesGridItems === undefined) {
            fallbackData.amenitiesGridItems = [
                { id: 'agi1_fb', image: '', label: 'Modern Fitness Center' },
                { id: 'agi2_fb', image: '', label: 'Elegant Clubhouse Lounge' },
            ];
        }
        if(fallbackData.floorPlans === undefined) {
             fallbackData.floorPlans = [
                { id: 'fp1_fb', name: 'Default Plan 1', area: '1000 sqft', features: ['Feature A'], image: '' },
            ];
        }


        return fallbackData as BrochureData;
    }
}