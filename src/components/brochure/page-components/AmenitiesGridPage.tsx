import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesGridPageProps {
  data: BrochureData;
}

const GridItem: React.FC<{ src?: string; alt: string; label: string; hint: string }> = ({ src, alt, label, hint }) => (
  <div className="grid-item">
    {src && src.trim() !== '' ? (
      <Image
        src={src}
        alt={alt}
        width={300} 
        height={225} 
        className="w-full h-full object-cover"
        data-ai-hint={hint}
        onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide broken img */ }}
      />
    ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
            {alt || "Amenity Image"}
        </div>
    )}
    <div className="grid-label">{label}</div>
  </div>
);

export const AmenitiesGridPage: React.FC<AmenitiesGridPageProps> = ({ data }) => {
  return (
    <PageWrapper className="page-light-bg" id="amenities-grid-page">
      <div className="page-content flex flex-col"> {/* Use flex column */}
        <div className="section-title">{data.amenitiesGridTitle}</div>
        <div className="amenities-grid flex-grow"> {/* Allow grid to take space */}
          <GridItem src={data.amenitiesGridImage1} alt={data.amenitiesGridLabel1 || "Amenity 1"} label={data.amenitiesGridLabel1} hint="modern gym equipment weights" />
          <GridItem src={data.amenitiesGridImage2} alt={data.amenitiesGridLabel2 || "Amenity 2"} label={data.amenitiesGridLabel2} hint="luxury resident lounge seating" />
          <GridItem src={data.amenitiesGridImage3} alt={data.amenitiesGridLabel3 || "Amenity 3"} label={data.amenitiesGridLabel3} hint="landscaped rooftop garden city view" />
          <GridItem src={data.amenitiesGridImage4} alt={data.amenitiesGridLabel4 || "Amenity 4"} label={data.amenitiesGridLabel4} hint="indoor children playground colorful" />
        </div>
         {/* Disclaimer at the bottom of the page content area */}
         {data.amenitiesGridDisclaimer && (
            <div className="mt-auto pt-[3mm] text-center grid-disclaimer"> {/* Push to bottom, add top padding */}
                <p>{data.amenitiesGridDisclaimer}</p>
            </div>
         )}
      </div>
    </PageWrapper>
  );
};
