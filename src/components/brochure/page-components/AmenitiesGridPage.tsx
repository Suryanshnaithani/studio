import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesGridPageProps {
  data: BrochureData;
}

const GridItem: React.FC<{ src?: string; alt: string; label: string; hint: string }> = ({ src, alt, label, hint }) => (
  <div className="grid-item">
    {src ? (
      <Image
        src={src}
        alt={alt}
        width={300} // Adjusted size calculation based on 2 columns and gap
        height={225} // Adjusted for 4:3 ratio
        className="w-full h-full object-cover"
        data-ai-hint={hint}
      />
    ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            {alt} Placeholder
        </div>
    )}
    <div className="grid-label">{label}</div>
  </div>
);

export const AmenitiesGridPage: React.FC<AmenitiesGridPageProps> = ({ data }) => {
  return (
    <PageWrapper className="page-light-bg" id="amenities-grid-page">
      <div className="page-content relative"> {/* Add relative positioning */}
        <div className="section-title">{data.amenitiesGridTitle}</div>
        <div className="amenities-grid">
          <GridItem src={data.amenitiesGridImage1} alt={data.amenitiesGridLabel1 || "Amenity 1"} label={data.amenitiesGridLabel1} hint="modern gym equipment weights" />
          <GridItem src={data.amenitiesGridImage2} alt={data.amenitiesGridLabel2 || "Amenity 2"} label={data.amenitiesGridLabel2} hint="luxury resident lounge seating" />
          <GridItem src={data.amenitiesGridImage3} alt={data.amenitiesGridLabel3 || "Amenity 3"} label={data.amenitiesGridLabel3} hint="landscaped rooftop garden city view" />
          <GridItem src={data.amenitiesGridImage4} alt={data.amenitiesGridLabel4 || "Amenity 4"} label={data.amenitiesGridLabel4} hint="indoor children playground colorful" />
        </div>
         {/* Position disclaimer absolutely within page-content */}
         <div className="absolute bottom-[18mm] right-[18mm] text-right grid-disclaimer">
             <p>{data.amenitiesGridDisclaimer}</p>
         </div>
      </div>
    </PageWrapper>
  );
};
