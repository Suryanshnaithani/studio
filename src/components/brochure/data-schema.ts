import { z } from 'zod';

// Enum for sections that support specific field/title generation by AI
export const SpecificFieldGeneratingSectionsEnum = z.enum([
  "introduction",
  "developer",
  "location",
  "connectivity",
  "amenitiesIntro",
  "amenitiesListTitle",
  "amenitiesGridTitle",
  "specificationsTitle",
  "masterPlan",
  "floorPlansTitle",
  "cover", 
  "backCover" 
]);

export type SpecificFieldGeneratingSection = z.infer<typeof SpecificFieldGeneratingSectionsEnum>;

// Schema for strings that are safe to interpolate directly into prompts (e.g., already JSON.stringified)
export const SafeStringSchema = z.string().describe("A string that is safe for direct inclusion in a prompt, often pre-JSON.stringified.");

// Reusable schema for optional URLs that can be empty strings
const optionalUrlSchema = (message: string = "Invalid URL format. Must be a valid URL or empty.") =>
  z.string()
    .refine((val) => val === '' || z.string().url().safeParse(val).success, { message })
    .optional()
    .default('');

// Reusable schema for optional emails that can be empty strings
const optionalEmailSchema = (message: string = "Invalid email format. Must be a valid email or empty.") =>
  z.string()
    .refine((val) => val === '' || z.string().email().safeParse(val).success, { message })
    .optional()
    .default('');


const FloorPlanSchema = z.object({
  id: z.string().optional(), 
  name: z.string().min(1, 'Floor plan name is required').default('Elegant 3BHK Apartment'),
  area: z.string().min(1, 'Area is required').default('Approx. 1850 sq. ft.'),
  features: z.array(z.string().min(1)).min(1, 'At least one feature is required').default(['Spacious Living Area', 'Modern Kitchen Layout', 'Private Balcony']),
  image: optionalUrlSchema("Invalid URL format for floor plan image. Must be a valid URL or empty.").describe("URL for the floor plan image. Use picsum.photos or leave empty."),
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
  amenitiesGridImage1: optionalUrlSchema().describe("Image URL for grid item 1. Use picsum.photos or leave empty."),
  amenitiesGridLabel1: z.string().default('Modern Fitness Center').describe("Label for grid item 1."),
  amenitiesGridImage2: optionalUrlSchema().describe("Image URL for grid item 2. Use picsum.photos or leave empty."),
  amenitiesGridLabel2: z.string().default('Elegant Clubhouse Lounge').describe("Label for grid item 2."),
  amenitiesGridImage3: optionalUrlSchema().describe("Image URL for grid item 3. Use picsum.photos or leave empty."),
  amenitiesGridLabel3: z.string().default('Rooftop Sky Lounge').describe("Label for grid item 3."),
  amenitiesGridImage4: optionalUrlSchema().describe("Image URL for grid item 4. Use picsum.photos or leave empty."),
  amenitiesGridLabel4: z.string().default('Interactive Kids\' Zone').describe("Label for grid item 4."),
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
    { id: 'fp3', name: 'The Ruby - 5 Bedroom Duplex Penthouse', area: 'Approx. 4500 sq. ft.', features: ['Double-Height Living Room', 'Private Terrace with Plunge Pool', 'Home Theatre/Entertainment Room', 'Panoramic Skyline Vistas', 'Exclusive Finishes'], image: 'https://picsum.photos/seed/fpRuby/800/600' },
  ]).describe("Array of floor plan objects."),
  floorPlansDisclaimer: z.string().default('Floor plans are indicative and not to scale. Areas are approximate and subject to final measurement. Furniture layout is suggestive and not included.'),

  // Back Cover
  backCoverImage: optionalUrlSchema().describe("Background image URL for back cover. Use picsum.photos or leave empty."),
  backCoverLogo: optionalUrlSchema().describe("Logo URL for back cover. Use picsum.photos or leave empty."),
  callToAction: z.string().default('Discover Your Dream Home at Elysian Estates'),
  contactTitle: z.string().default('Connect With Us Today'),
  contactPhone: z.string().default('+91 98765 43210'),
  contactEmail: optionalEmailSchema().describe("Contact email address."),
  contactWebsite: optionalUrlSchema().describe("Contact website URL."),
  contactAddress: z.string().default('Sales Gallery & Site Office: 1 Elysian Avenue, Metro City - 500001'),
  fullDisclaimer: z.string().default('Disclaimer: This brochure is intended for informational purposes only and does not constitute an offer or contract. All images, specifications, layouts, and amenities are indicative and subject to change or revision by the developer or competent authorities without prior notice. Artistic impressions and stock images may have been used. The final terms and conditions will be as per the registered agreement for sale. E&OE.'),
  reraDisclaimer: z.string().default('RERA Registration No: A123-B456-C789. This project is registered under the Real Estate (Regulation and Development) Act, 2016. Please visit state.rera.gov.in for details.'),
});

export type BrochureData = z.infer<typeof BrochureDataSchema>;
export type FloorPlanData = z.infer<typeof FloorPlanSchema>;

export const getDefaultBrochureData = (): BrochureData => {
    try {
        return BrochureDataSchema.parse({});
    } catch (e) {
        console.error("Error parsing default BrochureDataSchema:", e);
        // Fallback to a manually defined basic structure if parse fails
        // This structure should match the schema including all optional fields as empty strings
        return {
            projectName: 'Elysian Estates',
            projectTagline: 'Where Luxury Meets Serenity',
            reraInfo: 'RERA No: A123-B456-C789 | Project Approved by State RERA Authority.\nFull details: state.rera.gov.in/project/elysian-estates',
            introTitle: 'Welcome to Elysian Estates: A New Paradigm of Living',
            introParagraph1: 'Nestled in the city\'s most vibrant corridor, Elysian Estates presents a unique blend of contemporary architecture and thoughtful community planning. This premier residential enclave is designed for those who seek an elevated lifestyle, offering a sanctuary of peace and sophistication amidst the urban energy.',
            introParagraph2: 'Each residence within Elysian Estates is a masterpiece of design, featuring expansive layouts, premium finishes, and an abundance of natural light. With meticulous attention to detail, these homes are crafted to provide unparalleled comfort and a timeless aesthetic, promising a living experience that is both luxurious and intimately personal.',
            introParagraph3: 'Discover a community where every element is curated to enhance your well-being. From lush landscaped gardens to world-class amenities, Elysian Estates is more than just a home—it’s a destination for a fulfilling and inspired life.',
            developerName: 'Zenith Developers Pvt. Ltd.',
            developerDesc1: 'Zenith Developers has been at the forefront of creating landmark properties for over two decades. Our commitment to quality, innovation, and sustainable development has earned us a reputation for excellence in the real estate sector.',
            developerDesc2: 'We believe in building not just structures, but vibrant communities that enrich lives. Our portfolio reflects a dedication to superior craftsmanship, customer-centric design, and a vision for a better urban future.',
            developerDisclaimer: "Developer profile and image are for representation. Company details as per official records.",
            locationTitle: 'Prime Location, Unmatched Convenience',
            locationDesc1: 'Elysian Estates enjoys a coveted location, offering strategic proximity to major business hubs, educational institutions, healthcare facilities, and premier entertainment zones. Experience the ease of city living with everything you need just moments away.',
            locationDesc2: 'With excellent connectivity via arterial roads and public transport, your daily commute is simplified. The surrounding neighborhood is a vibrant tapestry of culture, dining, and recreation, ensuring a dynamic and convenient lifestyle.',
            keyDistances: [
                'City Metro Link - 2 min walk',
                'Orion Business Park - 5 min drive',
                'Global International School - 10 min drive',
                'Apollo Multi-specialty Hospital - 12 min drive',
                'Grand Central Mall - 15 min drive',
                'International Airport Connect - 30 min drive',
            ],
            mapDisclaimer: '*Map is for illustrative purposes only, not to scale. Actual travel times may vary based on traffic conditions.',
            locationNote: 'All mentioned landmarks and travel times are approximate and sourced from public information. Verify independently.',
            connectivityTitle: 'Effortless Connectivity to Key Destinations',
            connectivityPointsBusiness: ['Business & Tech Parks', 'Alpha Tech Hub', 'Omega Business Center', 'Innovation Square'],
            connectivityPointsHealthcare: ['Leading Hospitals', 'City General Hospital', 'Apex Heart Institute', 'Serene Wellness Clinic'],
            connectivityPointsEducation: ['Educational Institutions', 'Presidency International School', 'Horizon University', 'National Management Institute'],
            connectivityPointsLeisure: ['Shopping & Entertainment', 'Galleria Mall', 'City Art Museum', 'Gourmet Food Street', 'Regal Multiplex'],
            connectivityNote: 'Proposed infrastructure developments may further enhance connectivity. Information is subject to change.',
            connectivityDistrictLabel: 'Urban Connect',
            amenitiesIntroTitle: 'A World of Amenities for an Enriched Lifestyle',
            amenitiesIntroP1: 'At Elysian Estates, resident well-being is paramount. We offer a comprehensive suite of amenities designed to cater to diverse interests, promoting relaxation, fitness, and social engagement within a secure and beautifully landscaped environment.',
            amenitiesIntroP2: 'Experience leisure and recreation like never before. Our thoughtfully curated facilities provide the perfect setting for unwinding after a busy day, pursuing fitness goals, or creating lasting memories with family and friends.',
            amenitiesIntroP3: 'From serene green spaces to active recreational zones, every amenity at Elysian Estates is crafted to the highest standards, ensuring an exceptional living experience for all residents.',
            amenitiesListTitle: 'Curated Amenities for Every Resident',
            amenitiesListImageDisclaimer: "Artist's impression. Actual amenities may differ.",
            amenitiesWellness: ['Temperature-Controlled Infinity Pool', 'Holistic Spa & Sauna', 'Yoga & Meditation Deck', 'Landscaped Zen Gardens'],
            amenitiesRecreation: ['State-of-the-Art Gymnasium', 'Multipurpose Sports Court', 'Luxury Residents\' Clubhouse', "Children's Adventure Park", 'Private Cinema / AV Room'],
            amenitiesGridTitle: 'Signature Lifestyle Enhancements',
            amenitiesGridLabel1: 'Modern Fitness Center',
            amenitiesGridLabel2: 'Elegant Clubhouse Lounge',
            amenitiesGridLabel3: 'Rooftop Sky Lounge',
            amenitiesGridLabel4: 'Interactive Kids\' Zone',
            amenitiesGridDisclaimer: "Images are indicative. Final amenities are subject to design and availability.",
            specsTitle: 'Premium Finishes and Intelligent Features',
            specsImageDisclaimer: "Interior depiction is conceptual and for illustrative purposes only.",
            specsInterior: ['Living/Dining: Imported Marble Flooring', 'Bedrooms: Premium Laminated Wooden Flooring', 'Kitchen: Designer Modular Kitchen with Quartz Countertop', 'Bathrooms: High-end Sanitary Fixtures & Fittings', 'Windows: UPVC Soundproof Glazed Windows', 'Integrated Smart Home Automation'],
            specsBuilding: ['Structure: Earthquake-Resistant RCC Framed Structure', 'Security: Advanced 3-Tier Security System with CCTV Surveillance', 'Elevators: High-Speed Elevators (Passenger & Service)', 'Power Backup: 100% DG Power Backup for All Apartments & Common Areas', 'Sustainable Features: Rainwater Harvesting, STP'],
            masterPlanTitle: 'Thoughtfully Designed Site Master Plan',
            masterPlanImageDisclaimer: 'Master plan is conceptual and subject to approval and modification by relevant authorities.',
            masterPlanDesc1: 'The master plan of Elysian Estates is a harmonious blend of architectural ingenuity and landscape design, ensuring optimal space utilization, natural light, and ventilation for every residence. Towers are strategically placed to offer panoramic views and maintain privacy.',
            masterPlanDesc2: 'Extensive green spaces, pedestrian-friendly pathways, and dedicated zones for amenities create a cohesive and vibrant community environment. The layout prioritizes resident convenience, safety, and a seamless connection with nature.',
            floorPlansTitle: 'Spacious and Functional Floor Plans',
            floorPlans: [
                { id: 'fp1', name: 'The Sapphire - 3 Bedroom + Study', area: 'Approx. 2100 sq. ft.', features: ['Grand Living & Dining Area', 'Master Suite with Walk-in Wardrobe', 'Study/Home Office Space', 'Large Balconies', 'Modern Kitchen with Utility'], image: 'https://picsum.photos/seed/fpSapphire/800/600' },
                { id: 'fp2', name: 'The Emerald - 4 Bedroom Sky Residence', area: 'Approx. 2850 sq. ft.', features: ['Expansive Living Space with City Views', 'Two Master Suites', 'Private Elevator Lobby', 'Generous Sundeck', 'Servant Quarters with Separate Entry'], image: 'https://picsum.photos/seed/fpEmerald/800/600' },
                { id: 'fp3', name: 'The Ruby - 5 Bedroom Duplex Penthouse', area: 'Approx. 4500 sq. ft.', features: ['Double-Height Living Room', 'Private Terrace with Plunge Pool', 'Home Theatre/Entertainment Room', 'Panoramic Skyline Vistas', 'Exclusive Finishes'], image: 'https://picsum.photos/seed/fpRuby/800/600' },
            ],
            floorPlansDisclaimer: 'Floor plans are indicative and not to scale. Areas are approximate and subject to final measurement. Furniture layout is suggestive and not included.',
            callToAction: 'Discover Your Dream Home at Elysian Estates',
            contactTitle: 'Connect With Us Today',
            contactPhone: '+91 98765 43210',
            contactEmail: 'enquiries@elysianestates.dev',
            contactWebsite: 'https://www.elysianestates.dev',
            contactAddress: 'Sales Gallery & Site Office: 1 Elysian Avenue, Metro City - 500001',
            fullDisclaimer: 'Disclaimer: This brochure is intended for informational purposes only and does not constitute an offer or contract. All images, specifications, layouts, and amenities are indicative and subject to change or revision by the developer or competent authorities without prior notice. Artistic impressions and stock images may have been used. The final terms and conditions will be as per the registered agreement for sale. E&OE.',
            reraDisclaimer: 'RERA Registration No: A123-B456-C789. This project is registered under the Real Estate (Regulation and Development) Act, 2016. Please visit state.rera.gov.in for details.',
            // Optional fields initialized as empty strings
            coverImage: '', projectLogo: '', introWatermark: '',
            developerImage: '', developerLogo: '', locationMapImage: '', locationWatermark: '',
            connectivityImage: '', connectivityWatermark: '', amenitiesIntroWatermark: '',
            amenitiesListImage: '', amenitiesGridImage1: '', amenitiesGridImage2: '', amenitiesGridImage3: '', amenitiesGridImage4: '',
            specsImage: '', specsWatermark: '', masterPlanImage: '',
            backCoverImage: '', backCoverLogo: ''
        };
    }
}

