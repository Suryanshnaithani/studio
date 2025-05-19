
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesIntroPageProps {
  data: BrochureData;
}

export const AmenitiesIntroPage: React.FC<AmenitiesIntroPageProps> = ({ data }) => {
  const amenitiesIntroTitle = data.amenitiesIntroTitle?.trim();
  const amenitiesIntroP1 = data.amenitiesIntroP1?.trim();
  const amenitiesIntroP2 = data.amenitiesIntroP2?.trim();
  const amenitiesIntroP3 = data.amenitiesIntroP3?.trim();
  const amenitiesIntroWatermark = data.amenitiesIntroWatermark?.trim();
  
  const hasCoreText = amenitiesIntroTitle || amenitiesIntroP1 || amenitiesIntroP2 || amenitiesIntroP3;

  // Page should render if there's any core text. Watermark is decorative.
  if (!hasCoreText) {
    return null;
  }

  return (
    <PageWrapper className="page-accent-bg" id="amenities-intro-page">
      <div className="page-content">
         {amenitiesIntroWatermark && (
           <Image
            src={amenitiesIntroWatermark}
            alt="Watermark"
            width={227} // 60mm
            height={227} // 60mm
            className="watermark" // Style for accent bg watermark is in css
            data-ai-hint="lifestyle icon elegant"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {/* Render title and text container if any core text is present */}
        {amenitiesIntroTitle && <div className="section-title">{amenitiesIntroTitle}</div>}
        <div className="amenities-intro">
        {amenitiesIntroP1 && <p>{amenitiesIntroP1}</p>}
        {amenitiesIntroP2 && <p>{amenitiesIntroP2}</p>}
        {amenitiesIntroP3 && <p>{amenitiesIntroP3}</p>}
        </div>
      </div>
    </PageWrapper>
  );
};
