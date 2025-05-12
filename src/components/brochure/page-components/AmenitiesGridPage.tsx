import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesGridPageProps {
  data: BrochureData;
}

const GridItem: React.FC<{ src?: string; alt: string; label: string; hint: string }> = ({ src, alt, label, hint }) => (
  <div className="grid-item">
    {src && (
      <Image
        src={src}
        alt={alt}
        width={316} // approx half width minus gap
        height={378} // approx half height minus gap
        objectFit="cover"
        className="w-full h-full object-cover"
        data-ai-hint={hint}
      />
    )}
    <div className="grid-label">{label}</div>
  </div>
);

export const AmenitiesGridPage: React.FC<AmenitiesGridPageProps> = ({ data }) => {
  return (
    <PageWrapper className="page-light-bg" id="amenities-grid-page">
      <div className="page-content">
        <div className="section-title">{data.amenitiesGridTitle}</div>
        <div className="amenities-grid">
          <GridItem src={data.amenitiesGridImage1} alt="Gymnasium" label={data.amenitiesGridLabel1} hint="gym fitness" />
          <GridItem src={data.amenitiesGridImage2} alt="Clubhouse" label={data.amenitiesGridLabel2} hint="lounge interior" />
          <GridItem src={data.amenitiesGridImage3} alt="Gardens" label={data.amenitiesGridLabel3} hint="garden park" />
          <GridItem src={data.amenitiesGridImage4} alt="Play Area" label={data.amenitiesGridLabel4} hint="playground kids" />
        </div>
         <div className="grid-disclaimer" style={{width: 'calc(100% - 40mm)', bottom: '25mm', textAlign: 'right'}}> {/* Position based on page padding */}
             <p>{data.amenitiesGridDisclaimer}</p>
         </div>
      </div>
    </PageWrapper>
  );
};
