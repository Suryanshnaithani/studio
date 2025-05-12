import { z } from 'zod';

const FloorPlanSchema = z.object({
  id: z.string().optional(), // For mapping arrays
  name: z.string().min(1, 'Floor plan name is required'),
  area: z.string().min(1, 'Area is required'),
  features: z.array(z.string().min(1)).min(1, 'At least one feature is required'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const BrochureDataSchema = z.object({
  // Cover Page
  projectName: z.string().default('LUXURY RESIDENCES'),
  projectTagline: z.string().default('Where Elegance Meets Modern Living'),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/cover/1500/2000'),
  projectLogo: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/logo1/400/200'),
  reraInfo: z.string().default('RERA Registration No. ABCDE12345\ndated 01-01-2023. Available at www.rera.gov.in'),

  // Introduction
  introTitle: z.string().default('Welcome to Luxury Residences'),
  introParagraph1: z.string().default('Luxury Residences offers an unparalleled lifestyle with meticulously designed homes and world-class amenities in the heart of the city. Our commitment to excellence is reflected in every detail of this prestigious development.'),
  introParagraph2: z.string().default('Designed for those who appreciate the finer things in life, Luxury Residences combines sophisticated architecture with thoughtful spaces to create homes that are both elegant and functional. Experience the perfect balance of luxury, comfort, and convenience in a vibrant urban setting.'),
  introParagraph3: z.string().default('Each residence is crafted with premium materials and finishes, ensuring that every aspect of your home exudes quality and refinement. From the grand entrance lobby to the private terraces, every space has been designed to elevate your living experience.'),
  introWatermark: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/watermark/200/200'),

  // Developer Profile
  developerName: z.string().default('Premier Developers'),
  developerDesc1: z.string().default('With over two decades of experience, Premier Developers has established itself as a trusted leader in real estate, delivering iconic projects that redefine urban living.'),
  developerDesc2: z.string().default('Our commitment to quality, innovation, and sustainability has earned us numerous accolades and the trust of thousands of satisfied homeowners across the country.'),
  developerImage: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/devbg/1500/2000'),
  developerLogo: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/devlogo/300/200'),
  developerDisclaimer: z.string().default("Artist's impression."),

  // Location
  locationTitle: z.string().default('Prime Location'),
  locationDesc1: z.string().default('Located in the prestigious Central District, Luxury Residences offers unmatched connectivity to business hubs, educational institutions, healthcare facilities, and entertainment venues.'),
  locationDesc2: z.string().default('The strategic location ensures that residents enjoy the perfect balance of urban convenience and serene living, with easy access to major highways and public transportation.'),
  keyDistances: z.array(z.string().min(1)).default([
      'International Airport - 15 km',
      'Central Business District - 5 km',
      'Metro Station - 500 m',
      'Shopping Mall - 2 km',
      'International School - 3 km',
      'City Hospital - 4 km',
  ]),
  locationMapImage: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/map/800/1000'),
  mapDisclaimer: z.string().default('*Map not to scale. Distances are approximate.'),
  locationWatermark: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/watermark2/200/200'),


  // Connectivity
  connectivityTitle: z.string().default('Exceptional Connectivity'),
  connectivityPointsBusiness: z.array(z.string().min(1)).default([
    'Business Hubs', 'Central Tech Park', 'Financial District', 'Corporate Towers'
  ]),
   connectivityPointsHealthcare: z.array(z.string().min(1)).default([
    'Healthcare', 'City General Hospital', 'Medical Center', 'Wellness Clinic'
   ]),
   connectivityPointsEducation: z.array(z.string().min(1)).default([
    'Education', 'International School', 'University Campus', 'Research Institute'
   ]),
  connectivityPointsLeisure: z.array(z.string().min(1)).default([
    'Leisure', 'Central Park', 'Shopping Mall', 'Fine Dining'
  ]),
  connectivityNote: z.string().default('Connectivity and infrastructure subject to change as per municipal development plans.'),
  connectivityImage: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/connect/800/1000'),
  connectivityDistrictLabel: z.string().default('Central District'),
  connectivityWatermark: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/watermark3/200/200'),


  // Amenities Intro
  amenitiesIntroTitle: z.string().default('World-Class Amenities'),
  amenitiesIntroP1: z.string().default('Luxury Residences offers a thoughtfully curated selection of amenities designed to enhance your lifestyle. From wellness facilities to recreational spaces, every amenity has been planned to provide residents with the perfect balance of relaxation, recreation, and community living.'),
  amenitiesIntroP2: z.string().default('Our commitment to excellence extends to every aspect of the community, ensuring that residents enjoy a lifestyle that is both luxurious and fulfilling.'),
  amenitiesIntroP3: z.string().default('The amenities at Luxury Residences have been designed by world-renowned architects and landscape designers to create spaces that are not only functional but also aesthetically pleasing. Every detail has been carefully considered to ensure that residents have access to the finest facilities.'),
  amenitiesIntroWatermark: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/watermark4/200/200'),


  // Amenities List
  amenitiesListTitle: z.string().default('Lifestyle Amenities'),
  amenitiesListImage: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/pool/800/1000'),
  amenitiesListImageDisclaimer: z.string().default("Artist's impression."),
  amenitiesWellness: z.array(z.string().min(1)).default([
    'Temperature-controlled Swimming Pool', 'Luxury Spa & Sauna', 'Meditation & Yoga Deck', 'Landscaped Gardens'
  ]),
  amenitiesRecreation: z.array(z.string().min(1)).default([
    'State-of-the-art Gymnasium', 'Multi-purpose Sports Courts', 'Exclusive Clubhouse', "Children's Play Area", 'Indoor Games Room'
  ]),

  // Amenities Grid
  amenitiesGridTitle: z.string().default('Premium Facilities'),
  amenitiesGridImage1: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/gym/800/800'),
  amenitiesGridLabel1: z.string().default('Gymnasium'),
  amenitiesGridImage2: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/club/800/800'),
  amenitiesGridLabel2: z.string().default('Clubhouse'),
  amenitiesGridImage3: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/garden/800/800'),
  amenitiesGridLabel3: z.string().default('Gardens'),
  amenitiesGridImage4: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/play/800/800'),
  amenitiesGridLabel4: z.string().default('Play Area'),
  amenitiesGridDisclaimer: z.string().default("All images are artist's impressions."),

  // Specifications
  specsTitle: z.string().default('Premium Specifications'),
  specsImage: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/interior/800/1000'),
  specsImageDisclaimer: z.string().default("Artist's impression."),
  specsInterior: z.array(z.string().min(1)).default([
    'Flooring: Imported Marble in Living Areas', 'Kitchen: Fully Modular with Premium Appliances', 'Bathrooms: Designer Fittings & Fixtures', 'Windows: UPVC with Double Glazing', 'Doors: Engineered Wood with Premium Finish', 'Walls: Premium Emulsion Paint'
  ]),
  specsBuilding: z.array(z.string().min(1)).default([
    'Security: 24/7 CCTV Surveillance', 'Power Backup: 100% for Common Areas', 'Elevators: High-Speed with Smart Access', 'Water Supply: 24/7 Treated Water'
  ]),
  specsWatermark: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/watermark5/200/200'),


  // Master Plan
  masterPlanTitle: z.string().default('Master Plan'),
  masterPlanImage: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/masterplan/1500/1000'),
  masterPlanImageDisclaimer: z.string().default('Artist\'s impression. Not to scale.'),
  masterPlanDesc1: z.string().default('The master plan of Luxury Residences has been thoughtfully designed to create a harmonious living environment. The layout integrates residential towers, landscaped gardens, recreational facilities, and open spaces to foster a sense of community while ensuring privacy and exclusivity.'),
  masterPlanDesc2: z.string().default('With over 60% of the total area dedicated to open spaces and amenities, residents can enjoy a lifestyle that balances urban convenience with natural serenity.'),

  // Floor Plans
  floorPlansTitle: z.string().default('Thoughtfully Designed Floor Plans'),
  floorPlans: z.array(FloorPlanSchema).default([
    { id: 'fp1', name: 'Luxury 2 Bedroom', area: '1,200 sq. ft.', features: ['Spacious Living & Dining', 'Master Bedroom with Ensuite', 'Balcony with Panoramic Views', 'Modular Kitchen'], image: 'https://picsum.photos/seed/fp1/1000/800' },
    { id: 'fp2', name: 'Premium 3 Bedroom', area: '1,800 sq. ft.', features: ['Expansive Living Area', 'Two Master Bedrooms', 'Study Room / Home Office', 'Wrap-around Balcony'], image: 'https://picsum.photos/seed/fp2/1000/800' },
  ]),
  floorPlansDisclaimer: z.string().default('Floor plans are indicative. Furniture layout is for representation only.'),

  // Back Cover
  backCoverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/backcover/1500/2000'),
  backCoverLogo: z.string().url('Must be a valid URL').optional().or(z.literal('')).default('https://picsum.photos/seed/logo2/500/300'),
  callToAction: z.string().default('Experience Luxury Living'),
  contactTitle: z.string().default('Contact Us'),
  contactPhone: z.string().default('+91 98765 43210'),
  contactEmail: z.string().email().default('sales@luxuryresidences.com'),
  contactWebsite: z.string().url().default('https://www.luxuryresidences.com'),
  contactAddress: z.string().default('Experience Center, Central District, City - 123456'),
  fullDisclaimer: z.string().default('Disclaimer: This brochure is conceptual and not a legal offering. The information contained herein is subject to change without notice. All images are artistic impressions. Specifications and amenities mentioned are indicative and subject to change as per regulations and final design. Please refer to the final agreement for detailed terms and conditions.'),
  reraDisclaimer: z.string().default('RERA Registration No. ABCDE12345 dated 01-01-2023. Available at www.rera.gov.in'),
});

export type BrochureData = z.infer<typeof BrochureDataSchema>;
export type FloorPlanData = z.infer<typeof FloorPlanSchema>;

// Helper function to get default values
export const getDefaultBrochureData = (): BrochureData => {
    return BrochureDataSchema.parse({});
}
