import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesIntroPageProps {
  data: BrochureData;
}

export const AmenitiesIntroPage: React.FC<AmenitiesIntroPageProps> = ({ data }) => {
  const hasTextContent = data.amenitiesIntroTitle || data.amenitiesIntroP1 || data.amenitiesIntroP2 || data.amenitiesIntroP3;
  const hasVisualContent = !!data.amenitiesIntroWatermark;

  if (!hasTextContent && !hasVisualContent) {
    return null;
  }

  return (
    <PageWrapper className="page-accent-bg" id="amenities-intro-page">
      <div className="page-content">
         {data.amenitiesIntroWatermark && data.amenitiesIntroWatermark.trim() !== '' && (
           <Image
            src={data.amenitiesIntroWatermark}
            alt="Watermark"
            width={227} // 60mm
            height={227} // 60mm
            className="watermark" // Style for accent bg watermark is in css
            data-ai-hint="lifestyle icon elegant"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {hasTextContent && (
            <>
                <div className="section-title">{data.amenitiesIntroTitle}</div>
                <div className="amenities-intro">
                {data.amenitiesIntroP1 && <p>{data.amenitiesIntroP1}</p>}
                {data.amenitiesIntroP2 && <p>{data.amenitiesIntroP2}</p>}
                {data.amenitiesIntroP3 && <p>{data.amenitiesIntroP3}</p>}
                </div>
            </>
        )}
      </div>
    </PageWrapper>
  );
};