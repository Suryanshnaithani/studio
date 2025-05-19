
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesListPageProps {
  data: BrochureData;
}

export const AmenitiesListPage: React.FC<AmenitiesListPageProps> = ({ data }) => {
  const amenitiesListTitle = data.amenitiesListTitle?.trim();
  const amenitiesListImage = data.amenitiesListImage?.trim();
  const amenitiesListImageDisclaimer = data.amenitiesListImageDisclaimer?.trim();

  const wellnessItems = data.amenitiesWellness?.map(item => item?.trim()).filter(Boolean);
  const recreationItems = data.amenitiesRecreation?.map(item => item?.trim()).filter(Boolean);
  const hasWellnessItems = wellnessItems && wellnessItems.length > 0;
  const hasRecreationItems = recreationItems && recreationItems.length > 0;

  const hasTextContent = amenitiesListTitle || hasWellnessItems || hasRecreationItems || amenitiesListImageDisclaimer;
  const hasVisualContent = !!amenitiesListImage;

  if (!hasTextContent && !hasVisualContent) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="amenities-list-page">
      <div className="page-content">
        {amenitiesListTitle && <div className="section-title">{amenitiesListTitle}</div>}
        <div className="amenities-container">
          {(amenitiesListImage || amenitiesListImageDisclaimer) && (
             <div className="amenities-image">
                {amenitiesListImage ? (
                <figure className="relative">
                    <Image
                        src={amenitiesListImage}
                        alt="Amenities Highlight"
                        width={700}
                        height={500}
                        className="w-full h-auto max-h-[75mm] object-cover rounded-[1.5mm] border border-border"
                        data-ai-hint="luxury infinity pool sunset"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    {amenitiesListImageDisclaimer && (
                        <figcaption className="map-disclaimer">
                        <p>{amenitiesListImageDisclaimer}</p>
                        </figcaption>
                    )}
                </figure>
                ) : (
                    <div className="w-full min-h-[65mm] max-h-[75mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-border text-xs p-2 text-center">
                        {amenitiesListImageDisclaimer ? <p className="map-disclaimer !static !bg-transparent !text-muted-foreground !p-0">{amenitiesListImageDisclaimer}</p> : <p>Amenities Image Placeholder</p>}
                    </div>
                )}
            </div>
          )}
          {(hasWellnessItems || hasRecreationItems) && (
            <div className="amenities-list">
                {hasWellnessItems && (
                    <>
                        <h3>Wellness & Leisure</h3>
                        <ul>
                        {wellnessItems.map((item, index) => <li key={`well-${index}`}>{item}</li>)}
                        </ul>
                    </>
                )}
                {hasRecreationItems && (
                    <>
                        <h3>Recreation</h3>
                        <ul>
                        {recreationItems.map((item, index) => <li key={`rec-${index}`}>{item}</li>)}
                        </ul>
                    </>
                )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
