import { z } from 'zod';

// Updated FloorPlanSchema: image defaults to empty string
const FloorPlanSchema = z.object({
  id: z.string().optional(), // For mapping arrays
  name: z.string().min(1, 'Floor plan name is required').default('Unnamed Floor Plan'),
  area: z.string().min(1, 'Area is required').default('N/A sq. ft.'),
  features: z.array(z.string().min(1)).min(1, 'At least one feature is required').default(['Basic Feature']),
  image: z.string().optional().default('').describe("URL for the floor plan image. Use picsum.photos."),
});

// Updated BrochureDataSchema: Default optional image URLs to ''
export const BrochureDataSchema = z.object({
  // Cover Page
  projectName: z.string().default('Elysian Towers'),
  projectTagline: z.string().default('Experience Unrivaled Urban Living'),
  coverImage: z.string().optional().default('').describe("URL for the main cover image. Use picsum.photos."),
  projectLogo: z.string().optional().default('').describe("URL for the project logo. Use picsum.photos."),
  reraInfo: z.string().default('RERA No: PRJ/ST/XYZ/001234 | Project registered under RERA Act, 2016.\nDetails available at state.rera.gov.in'),

  // Introduction
  introTitle: z.string().default('Discover Elysian Towers'),
  introParagraph1: z.string().default('Welcome to Elysian Towers, a landmark residential development offering an exquisite collection of apartments designed for contemporary urban living. Situated in the city\'s most sought-after district, Elysian Towers blends architectural brilliance with unparalleled amenities.'),
  introParagraph2: z.string().default('Every residence at Elysian Towers is a testament to luxury and thoughtful design. Featuring spacious layouts, premium finishes, and breathtaking city views, these homes provide the perfect sanctuary amidst the vibrant cityscape. Experience a lifestyle curated for comfort, convenience, and sophistication.'),
  introParagraph3: z.string().default('From the moment you step into the grand lobby, you are enveloped in an atmosphere of elegance. Our commitment to quality ensures every detail, from imported materials to smart home features, meets the highest standards of modern luxury living.'),
  introWatermark: z.string().optional().default('').describe("Subtle watermark image URL for intro page. Use picsum.photos."),

  // Developer Profile
  developerName: z.string().default('Horizon Development Group'),
  developerDesc1: z.string().default('Horizon Development Group is a leading name in luxury real estate, renowned for creating iconic properties that shape city skylines. With a legacy spanning over three decades, we are committed to excellence, innovation, and customer satisfaction.'),
  developerDesc2: z.string().default('Our portfolio showcases a dedication to quality craftsmanship, sustainable practices, and cutting-edge design. We build more than structures; we build communities where people thrive.'),
  developerImage: z.string().optional().default('').describe("Background image URL for developer page. Use picsum.photos."),
  developerLogo: z.string().optional().default('').describe("Developer's logo URL. Use picsum.photos."),
  developerDisclaimer: z.string().default("Conceptual rendering. Actual project may vary."),

  // Location
  locationTitle: z.string().default('Unbeatable Location'),
  locationDesc1: z.string().default('Elysian Towers boasts a prestigious address in the heart of the Central Business District, offering seamless connectivity to financial hubs, premium retail destinations, renowned educational institutions, and world-class healthcare facilities.'),
  locationDesc2: z.string().default('Enjoy the convenience of having major transportation links, including the metro and arterial roads, just moments away. This prime location ensures you are always connected to the pulse of the city while providing a tranquil retreat.'),
  keyDistances: z.array(z.string().min(1)).default([
      'Metro Station - 2 mins walk',
      'Central Park - 5 mins drive',
      'International Airport - 25 mins drive',
      'Prestige Mall - 10 mins drive',
      'Global School - 15 mins drive',
      'City Hospital - 12 mins drive',
      'Financial Center - 8 mins drive',
  ]).describe("List of nearby locations and their approximate distance/time."),
  locationMapImage: z.string().optional().default('').describe("URL for the location map image. Use picsum.photos."),
  mapDisclaimer: z.string().default('*Map is indicative and not to scale. Distances are approximate travel times.'),
  locationWatermark: z.string().optional().default('').describe("Subtle watermark image URL for location page. Use picsum.photos."),


  // Connectivity
  connectivityTitle: z.string().default('Seamless Connectivity'),
  connectivityPointsBusiness: z.array(z.string().min(1)).default([
    'Business Hubs', 'Tech Park One', 'Financial Square', 'Corporate Avenue'
  ]).describe("List of nearby business points, first item is category title."),
   connectivityPointsHealthcare: z.array(z.string().min(1)).default([
    'Healthcare', 'Metro General Hospital', 'LifeCare Clinic', 'Wellness Institute'
   ]).describe("List of nearby healthcare points, first item is category title."),
   connectivityPointsEducation: z.array(z.string().min(1)).default([
    'Education', 'Global International School', 'City University', 'Management College'
   ]).describe("List of nearby education points, first item is category title."),
  connectivityPointsLeisure: z.array(z.string().min(1)).default([
    'Leisure & Retail', 'Central Mall', 'Art Gallery', 'Fine Dining Strip', 'Multiplex Cinema'
  ]).describe("List of nearby leisure/retail points, first item is category title."),
  connectivityNote: z.string().default('Connectivity subject to infrastructure development and traffic conditions.'),
  connectivityImage: z.string().optional().default('').describe("Image URL illustrating connectivity. Use picsum.photos."),
  connectivityDistrictLabel: z.string().default('CBD Hub').describe("Label text overlaid on the connectivity image."),
  connectivityWatermark: z.string().optional().default('').describe("Subtle watermark image URL for connectivity page. Use picsum.photos."),


  // Amenities Intro
  amenitiesIntroTitle: z.string().default('Lifestyle Redefined'),
  amenitiesIntroP1: z.string().default('Elysian Towers offers an exceptional array of amenities meticulously designed to cater to every aspect of your well-being and leisure. Experience a harmonious blend of relaxation, recreation, and social engagement within the community.'),
  amenitiesIntroP2: z.string().default('Our state-of-the-art facilities provide the perfect escape from the everyday hustle. Whether you seek invigorating workouts, serene relaxation, or vibrant social spaces, Elysian Towers delivers an unparalleled lifestyle experience.'),
  amenitiesIntroP3: z.string().default('Designed by leading architects, the amenity spaces combine functionality with aesthetic elegance. Enjoy exclusive access to world-class facilities that elevate your daily life and foster a strong sense of community.'),
  amenitiesIntroWatermark: z.string().optional().default('').describe("Subtle watermark image URL for amenities intro page. Use picsum.photos."),


  // Amenities List
  amenitiesListTitle: z.string().default('Exclusive Amenities'),
  amenitiesListImage: z.string().optional().default('').describe("Image URL for the amenities list page. Use picsum.photos."),
  amenitiesListImageDisclaimer: z.string().default("Conceptual image."),
  amenitiesWellness: z.array(z.string().min(1)).default([
    'Infinity Edge Swimming Pool', 'Jacuzzi & Steam Room', 'Yoga & Pilates Studio', 'Zen Garden & Reflexology Path'
  ]).describe("List of wellness/leisure amenities."),
  amenitiesRecreation: z.array(z.string().min(1)).default([
    'Fully Equipped Gymnasium', 'Indoor Badminton Court', 'Residents\' Lounge & Cafe', "Kids' Adventure Zone", 'Mini Theatre / AV Room'
  ]).describe("List of recreation amenities."),

  // Amenities Grid
  amenitiesGridTitle: z.string().default('Signature Facilities'),
  amenitiesGridImage1: z.string().optional().default('').describe("Image URL for grid item 1. Use picsum.photos."),
  amenitiesGridLabel1: z.string().default('Gymnasium').describe("Label for grid item 1."),
  amenitiesGridImage2: z.string().optional().default('').describe("Image URL for grid item 2. Use picsum.photos."),
  amenitiesGridLabel2: z.string().default('Residents\' Lounge').describe("Label for grid item 2."),
  amenitiesGridImage3: z.string().optional().default('').describe("Image URL for grid item 3. Use picsum.photos."),
  amenitiesGridLabel3: z.string().default('Sky Garden').describe("Label for grid item 3."),
  amenitiesGridImage4: z.string().optional().default('').describe("Image URL for grid item 4. Use picsum.photos."),
  amenitiesGridLabel4: z.string().default('Kids Play Area').describe("Label for grid item 4."),
  amenitiesGridDisclaimer: z.string().default("Images are representative. Actual amenities may vary."),

  // Specifications
  specsTitle: z.string().default('Finishes & Features'),
  specsImage: z.string().optional().default('').describe("Image URL for specifications page. Use picsum.photos."),
  specsImageDisclaimer: z.string().default("Conceptual interior view."),
  specsInterior: z.array(z.string().min(1)).default([
    'Living/Dining: Italian Marble Flooring', 'Bedrooms: Engineered Wooden Flooring', 'Kitchen: European Modular Kitchen with Hob & Chimney', 'Bathrooms: Premium Sanitaryware & CP Fittings', 'Windows: Soundproof Double-Glazed Units', 'Smart Home Automation System'
  ]).describe("List of interior specifications."),
  specsBuilding: z.array(z.string().min(1)).default([
    'Structure: Earthquake Resistant RCC Frame', 'Security: 5-Tier Security with Video Door Phone', 'Elevators: High-Speed Passenger & Service Lifts', 'Power Backup: 100% DG Backup for Apartments & Common Areas', 'Water Treatment Plant'
  ]).describe("List of building features/specifications."),
  specsWatermark: z.string().optional().default('').describe("Subtle watermark image URL for specs page. Use picsum.photos."),


  // Master Plan
  masterPlanTitle: z.string().default('Site Master Plan'),
  masterPlanImage: z.string().optional().default('').describe("URL for the master plan image. Use picsum.photos."),
  masterPlanImageDisclaimer: z.string().default('Master plan is indicative and subject to change.'),
  masterPlanDesc1: z.string().default('The master plan for Elysian Towers is meticulously crafted to optimize space, views, and ventilation. Residential towers are strategically positioned to maximize privacy and natural light, surrounded by lush landscaped greens.'),
  masterPlanDesc2: z.string().default('Dedicated zones for amenities, recreation, and vehicle movement ensure a seamless and harmonious living environment. Over 70% of the site area is dedicated to open spaces, creating a green oasis in the city center.'),

  // Floor Plans
  floorPlansTitle: z.string().default('Intelligent Floor Plans'),
  floorPlans: z.array(FloorPlanSchema).default([
    { id: 'fp1', name: '3 Bedroom Signature', area: 'Approx. 1,850 sq. ft.', features: ['Spacious Living & Dining', 'Master Suite with Walk-in Closet', 'Private Balcony', 'Utility Area'], image: 'https://picsum.photos/seed/fp3bhk/1000/800' },
    { id: 'fp2', name: '4 Bedroom Sky Villa', area: 'Approx. 2,500 sq. ft.', features: ['Expansive Living Room', 'Two Master Suites', 'Large Sundeck', 'Servant Room with separate entry'], image: 'https://picsum.photos/seed/fp4bhk/1000/800' },
     { id: 'fp3', name: '5 Bedroom Duplex Penthouse', area: 'Approx. 4,000 sq. ft.', features: ['Double Height Living Area', 'Private Terrace Garden', 'Home Theatre Room', 'Panoramic City Views'], image: 'https://picsum.photos/seed/fp5bhk/1000/800' },
  ]).describe("Array of floor plan objects."),
  floorPlansDisclaimer: z.string().default('Unit plans are indicative. Areas are approximate. Furniture layout is not included.'),

  // Back Cover
  backCoverImage: z.string().optional().default('').describe("Background image URL for back cover. Use picsum.photos."),
  backCoverLogo: z.string().optional().default('').describe("Logo URL for back cover. Use picsum.photos."),
  callToAction: z.string().default('Your Urban Sanctuary Awaits'),
  contactTitle: z.string().default('Visit Our Sales Gallery'),
  contactPhone: z.string().default('+91 12345 67890'),
  contactEmail: z.string().default('sales@elysiantowers.com'),
  contactWebsite: z.string().default('https://www.elysiantowers.com'),
  contactAddress: z.string().default('Site Address: 1 Elysian Way, CBD, Cityville - 400001'),
  fullDisclaimer: z.string().default('Disclaimer: This brochure is for informational purposes only and does not constitute a legal offer or contract. All specifications, designs, layouts, and amenities are indicative and subject to change without prior notice as per the discretion of the developer or competent authorities. Visual representations, including images and models, are artistic impressions. The final agreement for sale contains the actual terms and conditions. E&OE.'),
  reraDisclaimer: z.string().default('RERA No: PRJ/ST/XYZ/001234. Details at state.rera.gov.in'),
});

export type BrochureData = z.infer<typeof BrochureDataSchema>;
export type FloorPlanData = z.infer<typeof FloorPlanSchema>;

// Helper function to get default values derived from the schema
export const getDefaultBrochureData = (): BrochureData => {
    // Use .parse({}) to get defaults. Need to handle potential errors if schema changes radically.
    try {
        return BrochureDataSchema.parse({});
    } catch (e) {
        console.error("Error parsing default BrochureDataSchema:", e);
        // Fallback to a manually defined basic structure if parse fails
        // This structure should match the schema including all optional fields as empty strings
        return {
            projectName: 'Elysian Towers',
            projectTagline: 'Experience Unrivaled Urban Living',
            reraInfo: 'RERA No: PRJ/ST/XYZ/001234 | Project registered under RERA Act, 2016.\nDetails available at state.rera.gov.in',
            introTitle: 'Discover Elysian Towers',
            introParagraph1: 'Welcome to Elysian Towers, a landmark residential development offering an exquisite collection of apartments designed for contemporary urban living. Situated in the city\'s most sought-after district, Elysian Towers blends architectural brilliance with unparalleled amenities.',
            introParagraph2: 'Every residence at Elysian Towers is a testament to luxury and thoughtful design. Featuring spacious layouts, premium finishes, and breathtaking city views, these homes provide the perfect sanctuary amidst the vibrant cityscape. Experience a lifestyle curated for comfort, convenience, and sophistication.',
            introParagraph3: 'From the moment you step into the grand lobby, you are enveloped in an atmosphere of elegance. Our commitment to quality ensures every detail, from imported materials to smart home features, meets the highest standards of modern luxury living.',
            developerName: 'Horizon Development Group',
            developerDesc1: 'Horizon Development Group is a leading name in luxury real estate, renowned for creating iconic properties that shape city skylines. With a legacy spanning over three decades, we are committed to excellence, innovation, and customer satisfaction.',
            developerDesc2: 'Our portfolio showcases a dedication to quality craftsmanship, sustainable practices, and cutting-edge design. We build more than structures; we build communities where people thrive.',
            developerDisclaimer: 'Conceptual rendering. Actual project may vary.',
            locationTitle: 'Unbeatable Location',
            locationDesc1: 'Elysian Towers boasts a prestigious address in the heart of the Central Business District, offering seamless connectivity to financial hubs, premium retail destinations, renowned educational institutions, and world-class healthcare facilities.',
            locationDesc2: 'Enjoy the convenience of having major transportation links, including the metro and arterial roads, just moments away. This prime location ensures you are always connected to the pulse of the city while providing a tranquil retreat.',
            keyDistances: [
                'Metro Station - 2 mins walk',
                'Central Park - 5 mins drive',
                'International Airport - 25 mins drive',
                'Prestige Mall - 10 mins drive',
                'Global School - 15 mins drive',
                'City Hospital - 12 mins drive',
                'Financial Center - 8 mins drive',
            ],
            mapDisclaimer: '*Map is indicative and not to scale. Distances are approximate travel times.',
            connectivityTitle: 'Seamless Connectivity',
            connectivityPointsBusiness: ['Business Hubs', 'Tech Park One', 'Financial Square', 'Corporate Avenue'],
            connectivityPointsHealthcare: ['Healthcare', 'Metro General Hospital', 'LifeCare Clinic', 'Wellness Institute'],
            connectivityPointsEducation: ['Education', 'Global International School', 'City University', 'Management College'],
            connectivityPointsLeisure: ['Leisure & Retail', 'Central Mall', 'Art Gallery', 'Fine Dining Strip', 'Multiplex Cinema'],
            connectivityNote: 'Connectivity subject to infrastructure development and traffic conditions.',
            connectivityDistrictLabel: 'CBD Hub',
            amenitiesIntroTitle: 'Lifestyle Redefined',
            amenitiesIntroP1: 'Elysian Towers offers an exceptional array of amenities meticulously designed to cater to every aspect of your well-being and leisure. Experience a harmonious blend of relaxation, recreation, and social engagement within the community.',
            amenitiesIntroP2: 'Our state-of-the-art facilities provide the perfect escape from the everyday hustle. Whether you seek invigorating workouts, serene relaxation, or vibrant social spaces, Elysian Towers delivers an unparalleled lifestyle experience.',
            amenitiesIntroP3: 'Designed by leading architects, the amenity spaces combine functionality with aesthetic elegance. Enjoy exclusive access to world-class facilities that elevate your daily life and foster a strong sense of community.',
            amenitiesListTitle: 'Exclusive Amenities',
            amenitiesListImageDisclaimer: "Conceptual image.",
            amenitiesWellness: ['Infinity Edge Swimming Pool', 'Jacuzzi & Steam Room', 'Yoga & Pilates Studio', 'Zen Garden & Reflexology Path'],
            amenitiesRecreation: ['Fully Equipped Gymnasium', 'Indoor Badminton Court', 'Residents\' Lounge & Cafe', "Kids' Adventure Zone", 'Mini Theatre / AV Room'],
            amenitiesGridTitle: 'Signature Facilities',
            amenitiesGridLabel1: 'Gymnasium',
            amenitiesGridLabel2: 'Residents\' Lounge',
            amenitiesGridLabel3: 'Sky Garden',
            amenitiesGridLabel4: 'Kids Play Area',
            amenitiesGridDisclaimer: "Images are representative. Actual amenities may vary.",
            specsTitle: 'Finishes & Features',
            specsImageDisclaimer: "Conceptual interior view.",
            specsInterior: ['Living/Dining: Italian Marble Flooring', 'Bedrooms: Engineered Wooden Flooring', 'Kitchen: European Modular Kitchen with Hob & Chimney', 'Bathrooms: Premium Sanitaryware & CP Fittings', 'Windows: Soundproof Double-Glazed Units', 'Smart Home Automation System'],
            specsBuilding: ['Structure: Earthquake Resistant RCC Frame', 'Security: 5-Tier Security with Video Door Phone', 'Elevators: High-Speed Passenger & Service Lifts', 'Power Backup: 100% DG Backup for Apartments & Common Areas', 'Water Treatment Plant'],
            masterPlanTitle: 'Site Master Plan',
            masterPlanImageDisclaimer: 'Master plan is indicative and subject to change.',
            masterPlanDesc1: 'The master plan for Elysian Towers is meticulously crafted to optimize space, views, and ventilation. Residential towers are strategically positioned to maximize privacy and natural light, surrounded by lush landscaped greens.',
            masterPlanDesc2: 'Dedicated zones for amenities, recreation, and vehicle movement ensure a seamless and harmonious living environment. Over 70% of the site area is dedicated to open spaces, creating a green oasis in the city center.',
            floorPlansTitle: 'Intelligent Floor Plans',
            floorPlans: [
                { id: 'fp1', name: '3 Bedroom Signature', area: 'Approx. 1,850 sq. ft.', features: ['Spacious Living & Dining', 'Master Suite with Walk-in Closet', 'Private Balcony', 'Utility Area'], image: 'https://picsum.photos/seed/fp3bhk/1000/800' },
                { id: 'fp2', name: '4 Bedroom Sky Villa', area: 'Approx. 2,500 sq. ft.', features: ['Expansive Living Room', 'Two Master Suites', 'Large Sundeck', 'Servant Room with separate entry'], image: 'https://picsum.photos/seed/fp4bhk/1000/800' },
                { id: 'fp3', name: '5 Bedroom Duplex Penthouse', area: 'Approx. 4,000 sq. ft.', features: ['Double Height Living Area', 'Private Terrace Garden', 'Home Theatre Room', 'Panoramic City Views'], image: 'https://picsum.photos/seed/fp5bhk/1000/800' },
            ],
            floorPlansDisclaimer: 'Unit plans are indicative. Areas are approximate. Furniture layout is not included.',
            callToAction: 'Your Urban Sanctuary Awaits',
            contactTitle: 'Visit Our Sales Gallery',
            contactPhone: '+91 12345 67890',
            contactEmail: 'sales@elysiantowers.com',
            contactWebsite: 'https://www.elysiantowers.com',
            contactAddress: 'Site Address: 1 Elysian Way, CBD, Cityville - 400001',
            fullDisclaimer: 'Disclaimer: This brochure is for informational purposes only and does not constitute a legal offer or contract. All specifications, designs, layouts, and amenities are indicative and subject to change without prior notice as per the discretion of the developer or competent authorities. Visual representations, including images and models, are artistic impressions. The final agreement for sale contains the actual terms and conditions. E&OE.',
            reraDisclaimer: 'RERA No: PRJ/ST/XYZ/001234. Details at state.rera.gov.in',
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
